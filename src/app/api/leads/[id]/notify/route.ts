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
 */
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  if (!UUID_RE.test(params.id)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }
  const results = await dispatchLeadEvent("lead.created", params.id);
  return NextResponse.json({ delivered: results.length });
}
