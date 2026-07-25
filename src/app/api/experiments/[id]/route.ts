import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { ExperimentStatus } from "@/lib/experiments/types";

export const runtime = "nodejs";

const STATUSES: ExperimentStatus[] = ["draft", "running", "paused", "complete"];

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, status: 401 };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { ok: false as const, status: 403 };
  return { ok: true as const };
}

/** Update an experiment's status (admin). Stamps started_at / ended_at. */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: "forbidden" }, { status: gate.status });

  let body: { status?: ExperimentStatus; winnerVariantId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const admin = createServiceClient();

  // Ship a winner: route 100% of traffic to the chosen variant and close the test.
  if (body.winnerVariantId) {
    // Guard: the variant must belong to this experiment.
    const { data: winner } = await admin
      .from("experiment_variants")
      .select("id, experiment_id")
      .eq("id", body.winnerVariantId)
      .single();
    if (!winner || winner.experiment_id !== params.id) {
      return NextResponse.json({ error: "variant_not_in_experiment" }, { status: 422 });
    }
    // All variants → 0%, then the winner → 100%.
    const zeroed = await admin.from("experiment_variants").update({ allocation: 0 }).eq("experiment_id", params.id);
    if (zeroed.error) return NextResponse.json({ error: zeroed.error.message }, { status: 500 });
    const won = await admin.from("experiment_variants").update({ allocation: 1 }).eq("id", body.winnerVariantId);
    if (won.error) return NextResponse.json({ error: won.error.message }, { status: 500 });
    const closed = await admin
      .from("experiments")
      .update({ status: "complete", ended_at: new Date().toISOString() })
      .eq("id", params.id);
    if (closed.error) return NextResponse.json({ error: closed.error.message }, { status: 500 });
    return NextResponse.json({ ok: true, shipped: body.winnerVariantId });
  }

  if (!body.status || !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "invalid_status" }, { status: 422 });
  }

  const patch: Record<string, unknown> = { status: body.status };
  if (body.status === "running") patch.started_at = new Date().toISOString();
  if (body.status === "complete") patch.ended_at = new Date().toISOString();

  const { error } = await admin.from("experiments").update(patch).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** Delete an experiment (admin). Cascades to variants + results. */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: "forbidden" }, { status: gate.status });
  const admin = createServiceClient();
  const { error } = await admin.from("experiments").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
