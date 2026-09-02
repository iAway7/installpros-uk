import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { deliver } from "@/lib/webhooks/dispatch";
import { testPayload } from "@/lib/webhooks/payload";
import type { WebhookEndpoint } from "@/lib/webhooks/types";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Send a realistic fake lead to one endpoint so you can confirm the receiving
 * side works before a real lead depends on it. Logged like any other delivery.
 */
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const auth = createClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { data: profile } = await auth.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const supabase = createServiceClient();
  const { data: endpoint } = await supabase
    .from("webhook_endpoints")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!endpoint) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const payload = testPayload();
  const outcome = await deliver(endpoint as WebhookEndpoint, payload);

  await supabase.from("webhook_deliveries").insert({
    endpoint_id: endpoint.id,
    endpoint_url: outcome.endpoint,
    event: payload.event,
    lead_id: null,
    payload: outcome.sent,
    status: outcome.ok ? "success" : "failed",
    status_code: outcome.statusCode,
    attempts: outcome.attempts,
    error: outcome.error,
    duration_ms: outcome.durationMs,
  });

  await supabase
    .from("webhook_endpoints")
    .update({ last_delivery_at: new Date().toISOString(), last_status: outcome.ok ? "success" : "failed" })
    .eq("id", endpoint.id);

  return NextResponse.json({ outcome });
}
