import { NextResponse } from "next/server";
import { rateLimit, LIMITS } from "@/lib/rate-limit";

/**
 * Place Details proxy → Google Places (New). Given a placeId (from the
 * autocomplete endpoint), returns the formatted address plus the postcode and
 * post town parsed out of the address components. Server-side so the key stays
 * hidden. Sending the same sessionToken used for autocomplete bills the whole
 * lookup as one session (cheaper).
 */
export async function POST(req: Request) {
  const limited = rateLimit(req, LIMITS.addressDetails);
  if (limited) return limited;

  const key = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return NextResponse.json({ error: "address_details_unconfigured" }, { status: 200 });

  let placeId = "";
  let sessionToken: string | undefined;
  try {
    const body = (await req.json()) as { placeId?: string; sessionToken?: string };
    placeId = (body.placeId ?? "").trim();
    sessionToken = body.sessionToken;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!placeId) return NextResponse.json({ error: "missing_place_id" }, { status: 400 });

  try {
    const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`);
    if (sessionToken) url.searchParams.set("sessionToken", sessionToken);

    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "formattedAddress,addressComponents,location",
      },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return NextResponse.json({ error: "upstream_error" }, { status: 200 });

    const json = (await res.json()) as {
      formattedAddress?: string;
      addressComponents?: Array<{ longText?: string; shortText?: string; types?: string[] }>;
      location?: { latitude?: number; longitude?: number };
    };

    const comps = json.addressComponents ?? [];
    const byType = (t: string) => comps.find((c) => c.types?.includes(t));
    const postcode = byType("postal_code")?.longText ?? "";
    // Post town is the useful "area" for the funnel copy; fall back sensibly.
    const town =
      byType("postal_town")?.longText ??
      byType("locality")?.longText ??
      byType("administrative_area_level_2")?.longText ??
      byType("administrative_area_level_1")?.longText ??
      "";

    // Street-level pick: Google gives a postal_code only for a premise, and a
    // UK street can span several postcodes, so choosing "De La Bere Ave" yields
    // none. It does still give the street's coordinates, and postcodes.io turns
    // those into the nearest real postcode for free — which is enough for
    // everything we key on the area: the Ofcom outcode join, broadband
    // availability, region. It is NOT the visitor's own house: on a long street
    // the nearest unit can sit at the other end, so it comes back flagged and
    // the caller has to decide what that is good for.
    const approx = postcode ? null : await nearestPostcode(json.location);

    return NextResponse.json({
      address: json.formattedAddress ?? "",
      postcode: postcode || approx || "",
      postcode_precision: postcode ? "exact" : approx ? "approximate" : "none",
      town,
      location: json.location ?? null,
    });
  } catch {
    return NextResponse.json({ error: "network_error" }, { status: 200 });
  }
}

/**
 * Nearest real postcode to a lat/lng, or null when there is none close enough
 * (offshore, or a coordinate postcodes.io does not cover). Never throws: a
 * failed lookup just means we carry on without one.
 */
async function nearestPostcode(
  loc: { latitude?: number; longitude?: number } | undefined,
): Promise<string | null> {
  const lat = loc?.latitude;
  const lon = loc?.longitude;
  if (typeof lat !== "number" || typeof lon !== "number") return null;
  try {
    const url = `https://api.postcodes.io/postcodes?lon=${lon}&lat=${lat}&limit=1&radius=2000`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(4000),
      // The postcode grid does not move; a street resolves to the same unit
      // every time, so this is worth caching hard.
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: Array<{ postcode?: string }> | null };
    return json.result?.[0]?.postcode ?? null;
  } catch {
    return null;
  }
}
