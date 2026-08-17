"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Play, Pause, CheckCircle2, Trash2, Trophy, Loader2, FlaskConical, X, Rocket, Info, Layers, FileText } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TESTABLE_PAGES } from "@/lib/experiments/pages";
import { DEFAULT_HERO_HEADLINE } from "@/lib/funnel/defaults";
import type { Experiment, ExperimentStatus, VariantResult } from "@/lib/experiments/types";

/** Small hover/focus tooltip for explaining a field. */
function InfoHint({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex align-middle" tabIndex={0}>
      <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" aria-hidden />
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-5 z-20 w-60 -translate-x-1/2 rounded-md bg-foreground px-3 py-2 text-xs font-normal leading-snug text-background opacity-0 shadow-popover transition-opacity duration-150 group-hover:opacity-100 group-focus:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

export interface ExperimentWithResults {
  experiment: Experiment;
  results: VariantResult[];
  totalVisitors: number;
  totalConversions: number;
}

const STATUS_STYLE: Record<ExperimentStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  running: "bg-success/10 text-success",
  paused: "bg-amber-500/10 text-amber-600",
  complete: "bg-primary/10 text-primary",
};

export function ExperimentsView({ experiments, isAdmin }: { experiments: ExperimentWithResults[]; isAdmin: boolean }) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-6">
      {isAdmin && (
        <div className="flex justify-end">
          <Button onClick={() => setCreating((v) => !v)} variant={creating ? "outline" : "default"}>
            {creating ? (
              <>
                <X className="h-4 w-4" /> Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> New experiment
              </>
            )}
          </Button>
        </div>
      )}

      {creating && <CreateForm onDone={() => setCreating(false)} />}

      {experiments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-12 text-center">
            <FlaskConical className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No experiments yet</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              {isAdmin
                ? "Create your first A/B test — e.g. two hero headlines — then set it running."
                : "An admin can create A/B tests here."}
            </p>
          </CardContent>
        </Card>
      ) : (
        experiments.map((x) => <ExperimentCard key={x.experiment.id} data={x} isAdmin={isAdmin} />)
      )}
    </div>
  );
}

function ExperimentCard({ data, isAdmin }: { data: ExperimentWithResults; isAdmin: boolean }) {
  const router = useRouter();
  const { experiment, results, totalVisitors, totalConversions } = data;
  const [busy, setBusy] = useState(false);

  async function setStatus(status: ExperimentStatus) {
    setBusy(true);
    try {
      const res = await fetch(`/api/experiments/${experiment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Experiment ${status}`);
      router.refresh();
    } catch {
      toast.error("Couldn't update. Admins only.");
    } finally {
      setBusy(false);
    }
  }

  async function shipWinner(variantId: string, variantName: string) {
    if (!confirm(`Ship “${variantName}”? It will get 100% of traffic and the test will be marked complete.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/experiments/${experiment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winnerVariantId: variantId }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Shipped “${variantName}” to 100% of traffic`);
      router.refresh();
    } catch {
      toast.error("Couldn't ship. Admins only.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete “${experiment.name}” and its results?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/experiments/${experiment.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Experiment deleted");
      router.refresh();
    } catch {
      toast.error("Couldn't delete. Admins only.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>{experiment.name}</CardTitle>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[experiment.status]}`}>
                {experiment.status}
              </span>
            </div>
            {experiment.hypothesis ? <p className="mt-1 text-sm text-muted-foreground">{experiment.hypothesis}</p> : null}
            <p className="mt-1 text-xs text-muted-foreground">
              Goal: {experiment.primary_metric} · {totalVisitors.toLocaleString("en-GB")} visitors ·{" "}
              {totalConversions.toLocaleString("en-GB")} conversions
            </p>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              {busy && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              {(experiment.status === "draft" || experiment.status === "paused") && (
                <Button size="sm" onClick={() => setStatus("running")} disabled={busy}>
                  <Play className="h-4 w-4" /> {experiment.status === "paused" ? "Resume" : "Start"}
                </Button>
              )}
              {experiment.status === "running" && (
                <Button size="sm" variant="outline" onClick={() => setStatus("paused")} disabled={busy}>
                  <Pause className="h-4 w-4" /> Pause
                </Button>
              )}
              {(experiment.status === "running" || experiment.status === "paused") && (
                <Button size="sm" variant="outline" onClick={() => setStatus("complete")} disabled={busy}>
                  <CheckCircle2 className="h-4 w-4" /> Complete
                </Button>
              )}
              <Button size="icon" variant="ghost" onClick={remove} disabled={busy} aria-label="Delete">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-border bg-secondary/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Variant</th>
                <th className="px-3 py-2 text-right font-medium">Split</th>
                <th className="px-3 py-2 text-right font-medium">Visitors</th>
                <th className="px-3 py-2 text-right font-medium">Conv.</th>
                <th className="px-3 py-2 text-right font-medium">Rate</th>
                <th className="px-3 py-2 text-right font-medium">Uplift</th>
                <th className="px-3 py-2 text-right font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {results.map((r) => (
                <tr key={r.variant.id} className={r.isWinner ? "bg-success/5" : undefined}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-medium">
                      {r.variant.name}
                      {r.variant.is_control && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">Original</span>
                      )}
                      {r.isWinner && (
                        <span className="inline-flex items-center gap-1 rounded bg-success/10 px-1.5 py-0.5 text-[11px] font-semibold text-success">
                          <Trophy className="h-3 w-3" /> Winner
                        </span>
                      )}
                      {!r.isWinner && r.isSignificant && (
                        <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[11px] font-semibold text-accent">Significant</span>
                      )}
                    </div>
                    {typeof r.variant.config?.path === "string" ? (
                      <p className="mt-0.5 max-w-[280px] truncate font-mono text-xs text-muted-foreground" title={r.variant.config.path}>
                        {r.variant.config.path}
                      </p>
                    ) : typeof r.variant.config?.headline === "string" ? (
                      <p className="mt-0.5 max-w-[280px] truncate text-xs text-muted-foreground" title={r.variant.config.headline}>
                        “{r.variant.config.headline}”
                      </p>
                    ) : null}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{Math.round(r.variant.allocation * 100)}%</td>
                  <td className="px-3 py-3 text-right tabular-nums">{r.visitors.toLocaleString("en-GB")}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{r.conversions.toLocaleString("en-GB")}</td>
                  <td className="px-3 py-3 text-right font-semibold tabular-nums">{(r.rate * 100).toFixed(1)}%</td>
                  <td className={`px-3 py-3 text-right tabular-nums ${r.upliftPct == null ? "text-muted-foreground" : r.upliftPct >= 0 ? "text-success" : "text-destructive"}`}>
                    {r.upliftPct == null ? "—" : `${r.upliftPct >= 0 ? "+" : ""}${r.upliftPct.toFixed(1)}%`}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                    {r.confidencePct == null ? "—" : `${r.confidencePct.toFixed(0)}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalVisitors > 0 && (
          <div className="space-y-4 border-t border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Significance vs original
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {results
                .filter((r) => !r.variant.is_control)
                .map((r) => (
                  <VariantDetail
                    key={r.variant.id}
                    r={r}
                    canShip={isAdmin && (experiment.status === "running" || experiment.status === "paused")}
                    busy={busy}
                    onShip={() => shipWinner(r.variant.id, r.variant.name)}
                  />
                ))}
            </div>
            {isAdmin && (experiment.status === "running" || experiment.status === "paused") && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-muted-foreground">Prefer to keep the original?</span>
                {results
                  .filter((r) => r.variant.is_control)
                  .map((r) => (
                    <Button
                      key={r.variant.id}
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      onClick={() => shipWinner(r.variant.id, r.variant.name)}
                    >
                      <Rocket className="h-4 w-4" /> Ship {r.variant.name}
                    </Button>
                  ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Zero-anchored 95% CI plot for one variant's absolute lift (pp) vs original. */
function ForestPlot({ r }: { r: VariantResult }) {
  const { diffPct, ciLowPct, ciHighPct } = r;
  if (diffPct == null || ciLowPct == null || ciHighPct == null) return null;

  const bound = Math.max(Math.abs(ciLowPct), Math.abs(ciHighPct), Math.abs(diffPct), 0.5) * 1.15;
  const W = 300;
  const H = 28;
  const midY = H / 2;
  const x = (v: number) => ((v + bound) / (2 * bound)) * W;
  const crossesZero = ciLowPct <= 0 && ciHighPct >= 0;
  const color = crossesZero ? "#9ca3af" : diffPct > 0 ? "#15803d" : "#dc2626";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-7 w-full" role="img" aria-label="Confidence interval of lift">
      {/* zero reference */}
      <line x1={x(0)} y1={3} x2={x(0)} y2={H - 3} stroke="#d1d5db" strokeWidth={1} strokeDasharray="3 3" />
      {/* CI whisker */}
      <line x1={x(ciLowPct)} y1={midY} x2={x(ciHighPct)} y2={midY} stroke={color} strokeWidth={2} />
      <line x1={x(ciLowPct)} y1={midY - 5} x2={x(ciLowPct)} y2={midY + 5} stroke={color} strokeWidth={1.5} />
      <line x1={x(ciHighPct)} y1={midY - 5} x2={x(ciHighPct)} y2={midY + 5} stroke={color} strokeWidth={1.5} />
      {/* point estimate */}
      <circle cx={x(diffPct)} cy={midY} r={3.5} fill={color} />
    </svg>
  );
}

/** Significance meter + CI plot + sample-needed hint for one variant. */
function VariantDetail({
  r,
  canShip,
  busy,
  onShip,
}: {
  r: VariantResult;
  canShip: boolean;
  busy: boolean;
  onShip: () => void;
}) {
  const conf = r.confidencePct ?? 0;
  const sig = r.isSignificant;
  const meterColor = sig ? "bg-success" : "bg-amber-500";

  return (
    <div className="space-y-3 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-medium">
          {r.variant.name}
          {r.isWinner && (
            <span className="inline-flex items-center gap-1 rounded bg-success/10 px-1.5 py-0.5 text-[11px] font-semibold text-success">
              <Trophy className="h-3 w-3" /> Winner
            </span>
          )}
        </span>
        {canShip && (
          <Button size="sm" variant={r.isWinner ? "default" : "outline"} disabled={busy} onClick={onShip}>
            <Rocket className="h-4 w-4" /> Ship
          </Button>
        )}
      </div>

      {/* Significance meter with a 95% threshold marker */}
      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Confidence</span>
          <span className={sig ? "font-semibold text-success" : "text-muted-foreground"}>
            {conf.toFixed(0)}%{sig ? " · significant" : ""}
          </span>
        </div>
        <div className="relative h-2 w-full rounded-full bg-muted">
          <div className={`h-2 rounded-full ${meterColor}`} style={{ width: `${Math.min(100, conf)}%` }} />
          <div className="absolute -top-0.5 h-3 w-px bg-foreground/50" style={{ left: "95%" }} aria-hidden />
        </div>
      </div>

      <ForestPlot r={r} />

      <p className="text-xs text-muted-foreground">
        {r.diffPct == null
          ? "Not enough data yet."
          : `${r.diffPct >= 0 ? "+" : ""}${r.diffPct.toFixed(2)} pp vs original` +
            (r.ciLowPct != null && r.ciHighPct != null
              ? ` (95% CI ${r.ciLowPct >= 0 ? "+" : ""}${r.ciLowPct.toFixed(2)} to ${r.ciHighPct >= 0 ? "+" : ""}${r.ciHighPct.toFixed(2)} pp)`
              : "")}
        {sig
          ? " · reached significance"
          : r.visitorsNeeded && r.visitorsNeeded > 0
            ? ` · ~${r.visitorsNeeded.toLocaleString("en-GB")} more visitors/arm to 95%`
            : ""}
      </p>
    </div>
  );
}

type TestType = "page_split" | "on_page";

interface VariantDraft {
  name: string;
  key: string;
  allocation: number;
  headline: string; // on-page test
  path: string; // page-split test
  is_control: boolean;
}

function CreateForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [type, setType] = useState<TestType>("page_split");
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [metric, setMetric] = useState("lead_created");
  const [variants, setVariants] = useState<VariantDraft[]>([
    { name: "Original", key: "control", allocation: 0.5, headline: "", path: TESTABLE_PAGES[0]?.slug ?? "", is_control: true },
    { name: "Variant A", key: "variant_a", allocation: 0.5, headline: "", path: TESTABLE_PAGES[1]?.slug ?? TESTABLE_PAGES[0]?.slug ?? "", is_control: false },
  ]);
  const [saving, setSaving] = useState(false);

  const isSplit = type === "page_split";

  function updateVariant(i: number, patch: Partial<VariantDraft>) {
    setVariants((vs) => vs.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
  }
  function addVariant() {
    const n = variants.length;
    setVariants((vs) => [
      ...vs,
      { name: `Variant ${String.fromCharCode(64 + n)}`, key: `variant_${n}`, allocation: 0, headline: "", path: TESTABLE_PAGES[0]?.slug ?? "", is_control: false },
    ]);
  }
  function removeVariant(i: number) {
    setVariants((vs) => (vs.length <= 2 ? vs : vs.filter((_, idx) => idx !== i)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !key.trim()) return toast.error("Name and key are required");
    if (isSplit && new Set(variants.map((v) => v.path)).size < variants.length) {
      return toast.error("Each variant must point to a different page");
    }
    if (!isSplit && variants.some((v) => !v.is_control && !v.headline.trim())) {
      return toast.error("Give each variant a headline to test against the control");
    }
    setSaving(true);
    try {
      const res = await fetch("/api/experiments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          key: key.trim().toLowerCase().replace(/\s+/g, "_"),
          hypothesis,
          primary_metric: metric,
          variants: variants.map((v) => ({
            key: v.key,
            name: v.name,
            is_control: v.is_control,
            allocation: v.allocation,
            config: isSplit
              ? v.path
                ? { path: v.path }
                : {}
              : // Same-page test: the control is always the live default (no override);
                // each other variant carries its alternative headline.
                v.is_control || !v.headline.trim()
                ? {}
                : { headline: v.headline.trim() },
          })),
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || "failed");
      }
      toast.success("Experiment created (draft). Press Start to run it.");
      router.refresh();
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't create experiment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New experiment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-5">
          {/* 1. What kind of test */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              What do you want to test?
              <InfoHint text="Two pages: split traffic between two different landing pages and see which converts better. Same page: keep one page and swap a piece of its content." />
            </Label>
            <div className="grid gap-2 sm:grid-cols-2">
              <TypeCard
                active={isSplit}
                onClick={() => setType("page_split")}
                icon={<Layers className="h-4 w-4" />}
                title="Two pages (split URL)"
                desc="Pick two existing pages. Traffic to /go is split between them."
              />
              <TypeCard
                active={!isSplit}
                onClick={() => setType("on_page")}
                icon={<FileText className="h-4 w-4" />}
                title="Same page, change content"
                desc="Keep one page, swap a piece of content (today: the hero headline)."
              />
            </div>
          </div>

          {/* 2. Basics */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="exp-name" className="flex items-center gap-1.5">
                Name <InfoHint text="A label for you and your team. Shown at the top of the experiment card." />
              </Label>
              <Input id="exp-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={isSplit ? "Landing page test" : "Hero headline test"} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="exp-key" className="flex items-center gap-1.5">
                Key <InfoHint text="A short machine id (lowercase, no spaces). Used internally to track this test. It can't be changed later." />
              </Label>
              <Input id="exp-key" value={key} onChange={(e) => setKey(e.target.value)} placeholder={isSplit ? "landing_page" : "hero_headline"} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="exp-hyp" className="flex items-center gap-1.5">
              Hypothesis (optional) <InfoHint text="What you expect to happen and why. Helps you interpret the result later." />
            </Label>
            <Input id="exp-hyp" value={hypothesis} onChange={(e) => setHypothesis(e.target.value)} placeholder={isSplit ? "The address-autocomplete page will convert more leads" : "A benefit-led headline will lift lead conversion"} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="exp-metric" className="flex items-center gap-1.5">
              Primary metric <InfoHint text="The success event compared between variants. lead_created = someone completed the quote form." />
            </Label>
            <select
              id="exp-metric"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-input bg-background px-3 text-base"
            >
              <option value="lead_created">lead_created (form submitted)</option>
              <option value="quote_submitted">quote_submitted</option>
            </select>
          </div>

          {/* 3. Variants */}
          <div className="space-y-3">
            <Label className="flex items-center gap-1.5">
              Variants
              <InfoHint
                text={
                  isSplit
                    ? "Each variant is a whole page. The original is your current best; add others to test against it."
                    : "The original is your current page, unchanged. Each variant tries a different headline against it."
                }
              />
            </Label>
            {variants.map((v, i) => (
              <div key={i} className="rounded-lg border border-border p-3">
                <div className={`grid gap-2 sm:items-end ${isSplit ? "sm:grid-cols-[1fr_1.4fr_90px_auto]" : "sm:grid-cols-[1fr_1.4fr_90px_auto]"}`}>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Name {v.is_control ? "(original)" : ""}</span>
                    <Input value={v.name} onChange={(e) => updateVariant(i, { name: e.target.value })} />
                  </div>

                  {isSplit ? (
                    <div className="space-y-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        Page <InfoHint text="The page this variant shows. Pages come from the app's registry — add more in lib/experiments/pages.ts." />
                      </span>
                      <select
                        value={v.path}
                        onChange={(e) => updateVariant(i, { path: e.target.value })}
                        className="flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
                      >
                        {TESTABLE_PAGES.map((p) => (
                          <option key={p.slug} value={p.slug}>
                            {p.label} — {p.slug}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : v.is_control ? (
                    <div className="space-y-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        Current headline <InfoHint text="The original is what's live now — shown here for reference and left unchanged. Your variants are tested against this." />
                      </span>
                      <div
                        className="flex h-11 w-full items-center truncate rounded-lg border border-dashed border-input bg-muted/40 px-3 text-sm text-muted-foreground"
                        title={DEFAULT_HERO_HEADLINE}
                      >
                        {DEFAULT_HERO_HEADLINE}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        New headline to test <InfoHint text="The alternative headline shown to this variant's visitors, live, instead of the current one." />
                      </span>
                      <Input value={v.headline} onChange={(e) => updateVariant(i, { headline: e.target.value })} placeholder="Same-week Starlink, sorted." />
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      Split % <InfoHint text="Share of traffic sent to this variant. All variants should add up to 100%." />
                    </span>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={Math.round(v.allocation * 100)}
                      onChange={(e) => updateVariant(i, { allocation: Math.max(0, Math.min(100, Number(e.target.value))) / 100 })}
                    />
                  </div>
                  {!v.is_control && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(i)} aria-label="Remove variant">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
              <Plus className="h-4 w-4" /> Add variant
            </Button>
          </div>

          {isSplit && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">How it runs:</span> point your ads / campaign links at{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono">/go</code>. Each visitor is randomly assigned a page
              (and always sees the same one on return). Leads are attributed back to the page they saw.
            </div>
          )}

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="animate-spin" /> Creating…
              </>
            ) : (
              "Create experiment"
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            New experiments start as a draft — press Start to go live.
            {!isSplit && " For same-page tests, only the hero headline is wired to variants right now."}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

/** Selectable card for the experiment-type toggle. */
function TypeCard({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-col items-start gap-1 rounded-lg border-2 p-3 text-left transition-all ${
        active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
      }`}
    >
      <span className={`flex items-center gap-2 text-sm font-semibold ${active ? "text-primary" : "text-foreground"}`}>
        {icon}
        {title}
      </span>
      <span className="text-xs text-muted-foreground">{desc}</span>
    </button>
  );
}
