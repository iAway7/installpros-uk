import { NextResponse } from "next/server";
import { isValidUkPostcode, normalisePostcode } from "@/lib/utils";

export const runtime = "edge";

/**
 * Coverage check. Mirrors the superior US funnel: returns the ACTUAL place name
 * for the postcode so the UI can echo it back ("Starlink is live in Penrith"),
 * instead of a generic always-available message.
 *
 * InstallPros installs across the whole UK, so any valid postcode is
 * "available" — the only negative answer is an invalid postcode. The response
 * shape still carries "waitlist", which the frontend handles, in case a real
 * capacity constraint ever needs to be expressed.
 */
export async function POST(req: Request) {
  let body: { postcode?: string; install_type?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ result: "invalid" }, { status: 400 });
  }

  const postcode = normalisePostcode(String(body.postcode || ""));
  if (!isValidUkPostcode(postcode)) {
    return NextResponse.json({ result: "invalid" });
  }

  try {
    // Real UK postcode → location lookup (free, no key required).
    const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      // Postcode not found: treat as invalid rather than guessing coverage.
      return NextResponse.json({ result: "invalid" });
    }

    const json = (await res.json()) as {
      result: { admin_district?: string; region?: string; parish?: string; country?: string };
    };
    const r = json.result;
    const locationName = r.admin_district || r.parish || r.region || "your area";
    const region = r.region && r.region !== locationName ? r.region : r.country;

    return NextResponse.json({
      result: "available",
      location_name: locationName,
      region,
    });
  } catch {
    return NextResponse.json({ result: "error" }, { status: 502 });
  }
}
