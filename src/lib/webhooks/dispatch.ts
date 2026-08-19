import { createHmac } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";
import { buildPayload } from "./payload";
import type { WebhookEndpoint, WebhookEvent, WebhookPayload } from "./types";

const TIMEOUT_MS = 8000;
const MAX_ATTEMPTS = 3;
const BACKOFF_MS = [0, 500, 2000];

/**
 * HMAC-SHA256 over `${timestamp}.${body}`, sent as:
 *   X-InstallPros-Timestamp: <unix seconds>
 *   X-InstallPros-Signature: sha256=<hex>
 * Zapier ignores it; Make / n8n / a custom endpoint can verify with the same
 * secret and reject anything that doesn't match.
 */
function sign(secret: string, timestamp: string, body: string): string {
  return "sha256=" + createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
}

function hasSupabase(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Every destination for this event: the rows in `webhook_endpoints`, plus the
 * `LEAD_WEBHOOK_URL` env var if set. The env var is the zero-config path —
 * paste Will's Zapier catch-hook URL into Vercel and leads start flowing
 * without anyone touching the database.
 */
async function resolveTargets(event: WebhookEvent | "webhook.test"): Promise<WebhookEndpoint[]> {
  const targets: WebhookEndpoint[] = [];

  const envUrl = process.env.LEAD_WEBHOOK_URL?.trim();
  if (envUrl) {
    // The env destination only receives the enriched event by default: it
    // carries the score, which is the part that makes a lead actionable.
    // Set LEAD_WEBHOOK_EVENTS="lead.created,lead.enriched" to change that.
    const envEvents = (process.env.LEAD_WEBHOOK_EVENTS?.trim() || "lead.enriched")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean) as WebhookEvent[];
    targets.push({
      id: "env",
      name: "LEAD_WEBHOOK_URL (env)",
      url: envUrl,
      secret: process.env.LEAD_WEBHOOK_SECRET?.trim() || null,
      events: envEvents,
      headers: {},
      active: true,
      created_at: "",
      last_delivery_at: null,
      last_status: null,
    });
  }

  if (hasSupabase()) {
    try {
      const supabase = createServiceClient();
      const { data } = await supabase.from("webhook_endpoints").select("*").eq("active", true);
      for (const row of (data ?? []) as WebhookEndpoint[]) targets.push(row);
    } catch {
      /* table missing (migration not run) — env destination still works */
    }
  }

  // Empty events array means "everything".
  return targets.filter((t) => t.events.length === 0 || t.events.includes(event as WebhookEvent));
}

export interface DeliveryOutcome {
  endpoint: string;
  ok: boolean;
  statusCode: number | null;
  attempts: number;
  error: string | null;
  durationMs: number;
}

/** POST the payload to one endpoint, retrying transient failures. */
export async function deliver(
  endpoint: Pick<WebhookEndpoint, "id" | "url" | "secret" | "headers">,
  payload: WebhookPayload,
): Promise<DeliveryOutcome> {
  const body = JSON.stringify(payload);
  const started = Date.now();
  let statusCode: number | null = null;
  let error: string | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (BACKOFF_MS[attempt - 1]) await new Promise((r) => setTimeout(r, BACKOFF_MS[attempt - 1]));

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "InstallPros-Webhook/1.0",
      "X-InstallPros-Event": payload.event,
      "X-InstallPros-Timestamp": timestamp,
      ...(endpoint.headers ?? {}),
    };
    if (endpoint.secret) headers["X-InstallPros-Signature"] = sign(endpoint.secret, timestamp, body);

    try {
      const res = await fetch(endpoint.url, {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      statusCode = res.status;

      if (res.ok) {
        return { endpoint: endpoint.url, ok: true, statusCode, attempts: attempt, error: null, durationMs: Date.now() - started };
      }

      error = `HTTP ${res.status}`;
      // 4xx (other than 408/429) is the receiver rejecting the payload —
      // retrying sends the identical body and gets the identical answer.
      if (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429) break;
    } catch (e) {
      error = e instanceof Error ? e.message : "request_failed";
    }
  }

  return {
    endpoint: endpoint.url,
    ok: false,
    statusCode,
    attempts: MAX_ATTEMPTS,
    error,
    durationMs: Date.now() - started,
  };
}

async function logDelivery(
  endpointId: string | null,
  payload: WebhookPayload,
  outcome: DeliveryOutcome,
): Promise<void> {
  if (!hasSupabase()) return;
  try {
    await createServiceClient().from("webhook_deliveries").insert({
      endpoint_id: endpointId,
      endpoint_url: outcome.endpoint,
      event: payload.event,
      lead_id: payload.lead.id.startsWith("00000000") ? null : payload.lead.id,
      payload,
      status: outcome.ok ? "success" : "failed",
      status_code: outcome.statusCode,
      attempts: outcome.attempts,
      error: outcome.error,
      duration_ms: outcome.durationMs,
    });
    if (endpointId && endpointId !== "env") {
      await createServiceClient()
        .from("webhook_endpoints")
        .update({ last_delivery_at: new Date().toISOString(), last_status: outcome.ok ? "success" : "failed" })
        .eq("id", endpointId);
    }
  } catch {
    /* logging is best-effort — never let it break a delivery */
  }
}

/**
 * Destinations that already received this exact event for this lead. Makes
 * dispatch idempotent, which is what lets us trigger it from two places (the
 * lead route server-side, and the browser as a safety net) without ever
 * sending Will's CRM the same lead twice. Also stops "Refresh intel" from
 * re-firing lead.enriched.
 */
async function alreadyDelivered(event: WebhookEvent, leadId: string): Promise<Set<string>> {
  if (!hasSupabase()) return new Set();
  try {
    const { data } = await createServiceClient()
      .from("webhook_deliveries")
      .select("endpoint_url")
      .eq("lead_id", leadId)
      .eq("event", event)
      .eq("status", "success");
    return new Set(((data ?? []) as { endpoint_url: string }[]).map((r) => r.endpoint_url));
  } catch {
    return new Set();
  }
}

/**
 * Send one lead event to every configured destination, in parallel, and log
 * each attempt. Idempotent per (lead, event, destination). Never throws: a
 * webhook failure must never affect lead capture.
 */
export async function dispatchLeadEvent(event: WebhookEvent, leadId: string): Promise<DeliveryOutcome[]> {
  try {
    const all = await resolveTargets(event);
    if (all.length === 0) return [];

    const done = await alreadyDelivered(event, leadId);
    const targets = all.filter((t) => !done.has(t.url));
    if (targets.length === 0) return [];

    const payload = await buildPayload(event, leadId);
    if (!payload) return [];

    return await Promise.all(
      targets.map(async (t) => {
        const outcome = await deliver(t, payload);
        await logDelivery(t.id === "env" ? null : t.id, payload, outcome);
        return outcome;
      }),
    );
  } catch {
    return [];
  }
}
