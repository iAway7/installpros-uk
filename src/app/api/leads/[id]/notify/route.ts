import { NextResponse } from "next/server";
import { dispatchLeadEvent } from "@/lib/webhooks/dispatch";

export const runtime = "nodejs";
export const maxDuration = 30;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Safety net for the `lead.created` webhook, called fire-and-forget by the
 * funnel right after submit — same pattern as enrichment.
 *
 * /api/lead already triggers the dispatch server-side, but a serverless
 * function can be frozen the moment it returns its response, which would drop
 * a send in flight. This gives the delivery a second chance from a request
 * that is allowed to run to completion.
 *
 * Safe to leave unauthenticated: dispatchLeadEvent is idempotent per
 * (lead, event, destination), so a real lead can only ever be forwarded once,
 * and an id that doesn't exist produces no payload and therefore no request.
 *
 * Responds `{ delivered, failed, statusCodes }`. All zeros means nothing was
 * attempted: already delivered, no destination for `lead.created`, or an
 * unknown id.
 */
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  if (!UUID_RE.test(params.id)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }
  const results = await dispatchLeadEvent("lead.created", params.id);
  // `results` has one entry per destination attempted, failures included, so
  // its length alone reports a 404 from a switched-off zap as a delivery.
  const delivered = results.filter((r) => r.ok).length;
  return NextResponse.json({
    delivered,
    failed: results.length - delivered,
    // One per destination attempted, null when no HTTP response came back
    // (timeout, network error). Endpoint URLs and payloads stay out of the
    // response because this route is public.
    statusCodes: results.map((r) => r.statusCode),
  });
}
