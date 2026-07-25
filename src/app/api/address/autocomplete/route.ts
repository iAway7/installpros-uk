import { NextResponse } from "next/server";

/**
 * Address autocomplete proxy → Google Places Autocomplete (New).
 *
 * Runs server-side so the Google key is never shipped to the browser. The
 * client sends a partial address plus a session token; we return a slim list
 * of predictions ({ placeId, primary, secondary }) for a custom dropdown.
 *
 * Requires GOOGLE_PLACES_API_KEY (falls back to GOOGLE_MAPS_API_KEY) with the
 * "Places API (New)" enabled and billing active on the Google Cloud project.
 */
export async function POST(req: Request) {
  const key = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "address_autocomplete_unconfigured", suggestions: [] }, { status: 200 });
  }

  let input = "";
  let sessionToken: string | undefined;
  try {
    const body = (await req.json()) as { input?: string; sessionToken?: string };
    input = (body.input ?? "").trim();
    sessionToken = body.sessionToken;
  } catch {
    return NextResponse.json({ error: "bad_request", suggestions: [] }, { status: 400 });
  }

  if (input.length < 3) return NextResponse.json({ suggestions: [] });

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key },
      body: JSON.stringify({
        input,
        includedRegionCodes: ["gb"], // UK addresses only
        ...(sessionToken ? { sessionToken } : {}),
      }),
      // Google is fast; don't let a hung request stall the input.
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[address/autocomplete] Google ${res.status}: ${detail}`);
      return NextResponse.json({ error: "upstream_error", status: res.status, detail, suggestions: [] }, { status: 200 });
    }

    const json = (await res.json()) as {
      suggestions?: Array<{
        placePrediction?: {
          placeId?: string;
          text?: { text?: string };
          structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } };
        };
      }>;
    };

    const suggestions = (json.suggestions ?? [])
      .map((s) => s.placePrediction)
      .filter((p): p is NonNullable<typeof p> => Boolean(p?.placeId))
      .map((p) => ({
        placeId: p.placeId as string,
        primary: p.structuredFormat?.mainText?.text ?? p.text?.text ?? "",
        secondary: p.structuredFormat?.secondaryText?.text ?? "",
        full: p.text?.text ?? "",
      }));

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ error: "network_error", suggestions: [] }, { status: 200 });
  }
}
