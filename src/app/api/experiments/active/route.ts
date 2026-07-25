import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { Experiment, Variant } from "@/lib/experiments/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public: returns currently-running experiments with their variants so the
 * landing page can assign visitors. Returns an empty list when Supabase isn't
 * configured, so the site works without a backend.
 */
export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ experiments: [] });
  }
  try {
    const supabase = createServiceClient();
    const { data: experiments, error } = await supabase
      .from("experiments")
      .select("id, key, name, hypothesis, status, primary_metric")
      .eq("status", "running");
    if (error || !experiments?.length) return NextResponse.json({ experiments: [] });

    const ids = experiments.map((e) => e.id);
    const { data: variants } = await supabase
      .from("experiment_variants")
      .select("id, experiment_id, key, name, is_control, allocation, config")
      .in("experiment_id", ids);

    const out: Experiment[] = experiments.map((e) => ({
      ...e,
      variants: ((variants as Variant[]) ?? []).filter((v) => v.experiment_id === e.id),
    })) as Experiment[];

    return NextResponse.json({ experiments: out });
  } catch {
    return NextResponse.json({ experiments: [] });
  }
}
