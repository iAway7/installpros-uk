import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/dashboard/leads";

export const runtime = "nodejs";

/** Statuses at-or-beyond "contacted" / "quoted" — used to backfill timestamps. */
const CONTACTED_OR_LATER: LeadStatus[] = ["contacted", "quoted", "booked", "installed"];
const QUOTED_OR_LATER: LeadStatus[] = ["quoted", "booked", "installed"];

/**
 * Update a lead. Any authenticated team member can do this; we verify the
 * session with the user's own client, then write with the service client
 * (RLS reserves direct writes for admins, but working leads is a team task).
 *
 * Accepts: { status?, estimated_value? }
 * Side effect: first transition into contacted/quoted (or beyond) stamps
 * contacted_at / quoted_at — powering the time-to-contact/quote KPIs.
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: { status?: string; estimated_value?: number | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};

  if (body.status !== undefined) {
    const status = body.status as LeadStatus;
    if (!LEAD_STATUSES.includes(status)) {
      return NextResponse.json({ error: "invalid_status" }, { status: 422 });
    }
    update.status = status;
  }

  if (body.estimated_value !== undefined) {
    const v = body.estimated_value;
    if (v !== null && (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 10_000_000)) {
      return NextResponse.json({ error: "invalid_value" }, { status: 422 });
    }
    update.estimated_value = v;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "nothing_to_update" }, { status: 422 });
  }

  const admin = createServiceClient();

  // Stamp first-time transitions without clobbering existing timestamps.
  if (typeof update.status === "string") {
    const { data: existing } = await admin
      .from("leads")
      .select("contacted_at, quoted_at")
      .eq("id", params.id)
      .single();
    const now = new Date().toISOString();
    if (existing && !existing.contacted_at && CONTACTED_OR_LATER.includes(update.status as LeadStatus)) {
      update.contacted_at = now;
    }
    if (existing && !existing.quoted_at && QUOTED_OR_LATER.includes(update.status as LeadStatus)) {
      update.quoted_at = now;
    }
  }

  const { error } = await admin.from("leads").update(update).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
