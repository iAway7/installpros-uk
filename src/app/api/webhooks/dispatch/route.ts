import { NextResponse } from "next/server";
import { dispatchLeadEvent } from "@/lib/webhooks/dispatch";
import { verifyInternalSignature } from "@/lib/webhooks/internal";
import { WEBHOOK_EVENTS, type WebhookEvent } from "@/lib/webhooks/types";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Internal fan-out endpoint. Called fire-and-forget by /api/lead the moment a
 * lead is written, so the HTTP response to the visitor is never held up by a
 * slow receiver. Not for public use — requires the internal signature.
 */
export async function POST(req: Request) {
  let body: { event?: string; leadId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { event, leadId } = body;
  if (!event || !leadId || !WEBHOOK_EVENTS.includes(event as WebhookEvent)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (!verifyInternalSignature(event, leadId, req.headers.get("x-internal-signature"))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const results = await dispatchLeadEvent(event as WebhookEvent, leadId);
  return NextResponse.json({ delivered: results.length, results });
}
