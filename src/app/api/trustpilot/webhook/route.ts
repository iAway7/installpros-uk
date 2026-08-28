import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidateTag } from "next/cache";
import { createPlainServiceClient, supabaseConfigured } from "@/lib/supabase/service";
import { TRUSTPILOT_TAG, type TrustpilotStats } from "@/lib/reviews/trustpilot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Trustpilot webhook receiver.
 *
 * Trustpilot posts here on every service review event (Developers → Webhook
 * Notifications). We have no API key, so this endpoint is the ONLY way review
 * data reaches the site — see supabase/migrations/0011_trustpilot_reviews.sql.
 *
 * Auth: Trustpilot does not sign these requests, so the shared secret in
 * TRUSTPILOT_WEBHOOK_TOKEN is the whole door. Without it anyone who guessed the
 * URL could publish fake reviews on our funnel. Accepted either as `?token=`
 * or as an `x-webhook-token` header.
 *
 * Always answers 200 once authenticated, even when a row fails to write. A 500
 * makes Trustpilot retry the same payload on a loop, and a stuck retry is worse
 * than a missing review we can re-seed by hand.
 */

interface TrustpilotEventData {
  id?: string;
  language?: string;
  title?: string;
  text?: string;
  stars?: number;
  createdAt?: string;
  isVerified?: boolean;
  link?: string;
  consumer?: { id?: string; name?: string };
  /** Set by us on the invitation or in the portal: service, area, installer. */
  tags?: Array<{ group?: string; value?: string }>;
}

interface TrustpilotEvent {
  eventName?: string;
  version?: string;
  eventData?: TrustpilotEventData;
}

/** Timing-safe-ish comparison; both sides are short secrets, not user input. */
function tokenOk(given: string | null): boolean {
  const expected = process.env.TRUSTPILOT_WEBHOOK_TOKEN;
  if (!expected || !given) return false;
  if (given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

function readToken(req: Request): string | null {
  const url = new URL(req.url);
  return url.searchParams.get("token") ?? req.headers.get("x-webhook-token");
}

/** created | updated | deleted, matched loosely so a renamed event still lands. */
function kindOf(eventName: string | undefined): "created" | "updated" | "deleted" | null {
  const n = (eventName ?? "").toLowerCase();
  if (n.includes("delet")) return "deleted";
  if (n.includes("updat")) return "updated";
  if (n.includes("creat")) return "created";
  return null;
}

/** Do we already hold this Trustpilot review id? */
async function rowExists(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { count } = await supabase
    .from("trustpilot_reviews")
    .select("id", { count: "exact", head: true })
    .eq("id", id);
  return Boolean(count);
}

/**
 * The hand-seeded rows carry synthetic ids ("seed-2026-08-24-john-spence"),
 * because copying them out of the portal gives us no Trustpilot id. So when an
 * update or delete arrives for a review we seeded, nothing matches by id and we
 * would end up showing the same review twice. Match the twin by author + day
 * and hand the real event its row.
 */
async function findSeedTwin(supabase: SupabaseClient, data: TrustpilotEventData): Promise<string | null> {
  const name = data.consumer?.name?.trim();
  if (!name || !data.createdAt) return null;
  const day = new Date(data.createdAt);
  if (Number.isNaN(day.getTime())) return null;
  const start = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()));
  const end = new Date(start.getTime() + 86400000);

  const { data: rows } = await supabase
    .from("trustpilot_reviews")
    .select("id")
    .eq("source", "seed")
    .eq("consumer_name", name)
    .gte("created_at", start.toISOString())
    .lt("created_at", end.toISOString())
    .limit(1);

  return rows?.[0]?.id ?? null;
}

/** Moves the hand-seeded total. Never goes below zero. */
async function bumpCount(supabase: SupabaseClient, delta: number): Promise<void> {
  if (!delta) return;
  const { data } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "trustpilot_stats")
    .maybeSingle();
  const stats = (data?.value as TrustpilotStats | undefined) ?? { count: 0, score: null };
  const next = Math.max(0, (stats.count ?? 0) + delta);
  await supabase.from("app_settings").upsert({
    key: "trustpilot_stats",
    value: { ...stats, count: next },
    updated_at: new Date().toISOString(),
  });
}

export async function POST(req: Request) {
  if (!tokenOk(readToken(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!supabaseConfigured()) {
    console.error("[trustpilot/webhook] Supabase is not configured; event dropped");
    return NextResponse.json({ ok: true, stored: 0 });
  }

  let payload: { events?: TrustpilotEvent[] };
  try {
    payload = (await req.json()) as { events?: TrustpilotEvent[] };
  } catch {
    return NextResponse.json({ ok: true, stored: 0, note: "unparseable body" });
  }

  const events = payload.events ?? [];
  if (!events.length) return NextResponse.json({ ok: true, stored: 0 });

  const supabase = createPlainServiceClient();
  let stored = 0;
  let countDelta = 0;

  for (const event of events) {
    const kind = kindOf(event.eventName);
    const data = event.eventData;
    if (!kind || !data?.id) continue;

    try {
      if (kind === "deleted") {
        // Soft delete: the row stays for the record, the read path filters it.
        const target = (await rowExists(supabase, data.id)) ? data.id : await findSeedTwin(supabase, data);
        if (!target) {
          countDelta -= 1; // review we never held, but the total still drops
          stored++;
          continue;
        }
        const { error } = await supabase
          .from("trustpilot_reviews")
          .update({ deleted_at: new Date().toISOString(), synced_at: new Date().toISOString() })
          .eq("id", target);
        if (error) throw error;
        countDelta -= 1;
        stored++;
        continue;
      }

      // Check BEFORE writing: after the upsert the row always exists, so a
      // retry of the same "created" event would double-count the total.
      const known = await rowExists(supabase, data.id);
      const isNew = kind === "created" && !known;

      // First real event for a review we seeded by hand: retire the synthetic
      // row so the two do not both render.
      if (!known) {
        const twin = await findSeedTwin(supabase, data);
        if (twin) await supabase.from("trustpilot_reviews").delete().eq("id", twin);
      }

      const row = {
        id: data.id,
        stars: Math.max(1, Math.min(5, Math.round(data.stars ?? 5))),
        title: data.title ?? null,
        text: (data.text ?? "").trim(),
        consumer_name: data.consumer?.name?.trim() || "Customer",
        language: data.language ?? null,
        // NOT data.link — that is https://api.trustpilot.com/v1/reviews/{id},
        // an API endpoint a visitor cannot read. The public page is the same id
        // under the UK consumer site, which is where the card should point.
        link: `https://uk.trustpilot.com/reviews/${data.id}`,
        is_verified: Boolean(data.isVerified),
        // Stored even though nothing reads it yet: the payload only comes past
        // once, and without the API an untagged review cannot be back-filled.
        tags: Array.isArray(data.tags) ? data.tags.filter((t) => t?.value) : [],
        created_at: data.createdAt ?? new Date().toISOString(),
        source: "webhook",
        // An edit can un-delete a review; clearing this keeps the two in sync.
        deleted_at: null,
        raw: data as unknown as Record<string, unknown>,
        synced_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("trustpilot_reviews").upsert(row, { onConflict: "id" });
      if (error) throw error;

      // Only a genuinely new review moves the total; an edit does not.
      if (isNew) countDelta += 1;
      stored++;
    } catch (err) {
      // Swallow per-event so one bad row cannot block the rest of the batch.
      console.error(`[trustpilot/webhook] ${event.eventName} ${data.id} failed:`, err);
    }
  }

  if (countDelta) await bumpCount(supabase, countDelta);
  if (stored) revalidateTag(TRUSTPILOT_TAG);

  return NextResponse.json({ ok: true, stored, received: events.length });
}

/** Convenience for the portal's "Test" button and for a quick browser check. */
export async function GET(req: Request) {
  if (!tokenOk(readToken(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, endpoint: "trustpilot-webhook" });
}
