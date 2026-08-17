import { createClient } from "@/lib/supabase/server";
import { computeResults, type ResultRow } from "@/lib/experiments/stats";
import type { Experiment, Variant, VariantResult } from "@/lib/experiments/types";
import { ExperimentsView, type ExperimentWithResults } from "@/components/dashboard/experiments-view";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ExperimentsPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).single()
    : { data: null };
  const isAdmin = profile?.role === "admin";

  const { data: expRows, error } = await supabase
    .from("experiments")
    .select("id, key, name, hypothesis, status, primary_metric, created_at, started_at, ended_at")
    .order("created_at", { ascending: false });

  const experiments = (expRows as Experiment[] | null) ?? [];
  let payload: ExperimentWithResults[] = [];

  if (experiments.length) {
    const expIds = experiments.map((e) => e.id);
    const { data: variantRows } = await supabase
      .from("experiment_variants")
      .select("id, experiment_id, key, name, is_control, allocation, config")
      .in("experiment_id", expIds);
    const variants = (variantRows as Variant[] | null) ?? [];

    const variantIds = variants.map((v) => v.id);
    const { data: resultRows } = variantIds.length
      ? await supabase
          .from("experiment_results")
          .select("variant_id, visitors, conversions")
          .in("variant_id", variantIds)
      : { data: [] as ResultRow[] };
    const results = (resultRows as ResultRow[] | null) ?? [];

    payload = experiments.map((e) => {
      const full: Experiment = { ...e, variants: variants.filter((v) => v.experiment_id === e.id) };
      const rows = results.filter((r) => full.variants.some((v) => v.id === r.variant_id));
      const computed: VariantResult[] = computeResults(full, rows);
      return {
        experiment: full,
        results: computed,
        totalVisitors: computed.reduce((s, r) => s + r.visitors, 0),
        totalConversions: computed.reduce((s, r) => s + r.conversions, 0),
      };
    });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Experiments</h1>
        <p className="text-muted-foreground">Run A/B tests on the landing page and read the results.</p>
      </div>

      {error ? (
        <Card>
          <CardContent className="p-6 text-body-sm text-destructive">
            Couldn&apos;t load experiments ({error.message}). Make sure migration 0002 has been run.
          </CardContent>
        </Card>
      ) : (
        <ExperimentsView experiments={payload} isAdmin={isAdmin} />
      )}
    </div>
  );
}
