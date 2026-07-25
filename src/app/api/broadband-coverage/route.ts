import { NextResponse } from "next/server";
import { getCoverage } from "@/lib/broadband/coverage";

export const runtime = "nodejs";
export const maxDuration = 15;

/**
 * Smart coverage lookup for /starlink-installation. Cached hard server-side
 * (see lib/broadband/coverage.ts) — safe to call once per checked postcode.
 * Returns state "unknown" when no data source produced anything usable; the
 * client must then keep its generic message. Never an error to the funnel.
 */
export async function POST(req: Request) {
  let body: { postcode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ state: "unknown", message: null });
  }
  const postcode = String(body.postcode ?? "").slice(0, 10);
  if (!postcode.trim()) return NextResponse.json({ state: "unknown", message: null });

  try {
    const result = await getCoverage(postcode);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ state: "unknown", message: null });
  }
}
