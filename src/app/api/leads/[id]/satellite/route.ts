import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Satellite view of the lead's location. Two sources:
 *   1. Google Static Maps — only if GOOGLE_MAPS_API_KEY is set (sharper).
 *   2. Esri World Imagery tiles — default: free, no account, no card.
 *
 * Coordinates come from the resolved property when the team has run the
 * exact-address lookup — Propalt returns the building's own lat/lng, so the
 * frame sits on the actual roof rather than the middle of the street — and
 * from the postcode centroid otherwise. Cached a day.
 */

/** Web-Mercator tile coordinates for lat/lng at zoom z. */
function tileXY(lat: number, lng: number, z: number): { x: number; y: number } {
  const n = 2 ** z;
  const x = Math.floor(((lng + 180) / 360) * n);
  const rad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n);
  return { x, y };
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("unauthorized", { status: 401 });

  const { data: lead } = await supabase.from("leads").select("postcode").eq("id", params.id).single();
  if (!lead) return new Response("not_found", { status: 404 });

  try {
    // Exact property coordinates first — only present once someone has
    // resolved the address.
    const { data: intel } = await supabase
      .from("lead_intel")
      .select("property_lat, property_lng")
      .eq("lead_id", params.id)
      .maybeSingle();

    let lat: number | null | undefined = intel?.property_lat;
    let lng: number | null | undefined = intel?.property_lng;
    const exact = lat != null && lng != null;

    if (!exact) {
      const pcRes = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(String(lead.postcode).trim())}`,
        { next: { revalidate: 86400 } },
      );
      if (!pcRes.ok) return new Response("postcode_unresolved", { status: 404 });
      const pc = (await pcRes.json()) as { result?: { latitude?: number; longitude?: number } };
      lat = pc.result?.latitude;
      lng = pc.result?.longitude;
    }
    if (lat == null || lng == null) return new Response("postcode_unresolved", { status: 404 });

    const zoomOut = new URL(request.url).searchParams.get("zoom") === "out";
    const key = process.env.GOOGLE_MAPS_API_KEY;

    // Prefer Google when a key exists (sharper, larger frame)…
    if (key) {
      const img = await fetch(
        `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoomOut ? 17 : 19}&size=640x400&scale=2&maptype=satellite&key=${key}`,
        { next: { revalidate: 86400 } },
      );
      if (img.ok) {
        return new Response(img.body, {
          headers: {
            "Content-Type": img.headers.get("Content-Type") ?? "image/png",
            "Cache-Control": "private, max-age=86400",
            "X-Centred-On": exact ? "property" : "postcode",
          },
        });
      }
    }

    // …otherwise Esri World Imagery tile (free, no key). 256px tile.
    const z = zoomOut ? 16 : 18;
    const { x, y } = tileXY(lat, lng, z);
    const tile = await fetch(
      `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
      { next: { revalidate: 86400 } },
    );
    if (!tile.ok) return new Response("imagery_error", { status: 502 });
    return new Response(tile.body, {
      headers: {
        "Content-Type": tile.headers.get("Content-Type") ?? "image/jpeg",
        "Cache-Control": "private, max-age=86400",
        "X-Imagery-Source": "esri",
        "X-Centred-On": exact ? "property" : "postcode",
      },
    });
  } catch {
    return new Response("error", { status: 500 });
  }
}
