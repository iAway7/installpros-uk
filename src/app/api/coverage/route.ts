import { NextResponse } from "next/server";
import { isValidUkPostcode, normalisePostcode } from "@/lib/utils";

export const runtime = "edge";

/**
 * Coverage check. Mirrors the superior US funnel: returns the ACTUAL place name
 * for the postcode so the UI can echo it back ("Starlink is live in Penrith"),
 * instead of a generic always-available message.
 *
 * Production: swap the lookup for postcodes.io (free UK API) + your real
 * Starlink cell-capacity table. The shape returned here is the contract the
 * frontend already consumes, so only this function changes.
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

    // Demo capacity rule: a small slice of postcodes are "waitlist" to exercise
    // that UI path. Replace with your real cell-capacity check.
    const hash = postcode.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const isWaitlist = hash % 11 === 0;

    if (isWaitlist) {
      return NextResponse.json({
        result: "waitlist",
        location_name: locationName,
        region,
        eta_days: 14,
      });
    }

    return NextResponse.json({
      result: "available",
      location_name: locationName,
      region,
    });
  } catch {
    return NextResponse.json({ result: "error" }, { status: 502 });
  }
}
