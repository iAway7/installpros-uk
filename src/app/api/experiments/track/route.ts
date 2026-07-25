import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Public: record a variant exposure or conversion. Increments the daily rollup
 * via the record_experiment_event RPC (migration 0002). No-op without Supabase.
 */
export async function POST(req: Request) {
  let body: { variantId?: string; kind?: "exposure" | "conversion" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  if (!body.variantId || (body.kind !== "exposure" && body.kind !== "conversion")) {
    return NextResponse.json({ error: "invalid" }, { status: 422 });
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ ok: true, persisted: false });

  try {
    const supabase = createServiceClient();
    const today = new Date().toISOString().slice(0, 10);
    const { error } = await supabase.rpc("record_experiment_event", {
      p_variant: body.variantId,
      p_day: today,
      p_visitors: body.kind === "exposure" ? 1 : 0,
      p_conversions: body.kind === "conversion" ? 1 : 0,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
