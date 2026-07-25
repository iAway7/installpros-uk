import { NextResponse } from "next/server";

/**
 * Place Details proxy → Google Places (New). Given a placeId (from the
 * autocomplete endpoint), returns the formatted address plus the postcode and
 * post town parsed out of the address components. Server-side so the key stays
 * hidden. Sending the same sessionToken used for autocomplete bills the whole
 * lookup as one session (cheaper).
 */
export async function POST(req: Request) {
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

    return NextResponse.json({
      address: json.formattedAddress ?? "",
      postcode,
      town,
      location: json.location ?? null,
    });
  } catch {
    return NextResponse.json({ error: "network_error" }, { status: 200 });
  }
}
