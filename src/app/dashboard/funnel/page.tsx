import Link from "next/link";
import { Filter, AlertTriangle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/system/card";
import {
  fetchDailyRates,
  fetchFunnel,
  fetchFunnelPrevious,
  fetchSources,
  posthogConfigured,
} from "@/lib/posthog/query";

export const dynamic = "force-dynamic";

const DAY_OPTIONS = [7, 14, 28, 90];
const DEVICES = ["mobile", "tablet", "desktop"];

interface SearchParams {
  days?: string;
  device?: string;
  source?: string;
}

export default async function FunnelPage({ searchParams }: { searchParams: SearchParams }) {
  const days = DAY_OPTIONS.includes(Number(searchParams.days)) ? Number(searchParams.days) : 28;
  const device = DEVICES.includes(searchParams.device ?? "") ? searchParams.device : undefined;
  const source = searchParams.source?.slice(0, 60) || undefined;
  const filter = { days, device, source };

  if (!posthogConfigured()) {
    return (
      <Shell days={days} device={device} source={source} sources={[]}>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <Filter className="h-9 w-9 text-muted-foreground" />
            <h3 className="text-body font-semibold">Connect PostHog queries</h3>
            <p className="max-w-md text-body-sm text-muted-foreground">
              Add <code className="rounded bg-secondary px-1">POSTHOG_PERSONAL_API_KEY</code> and{" "}
              <code className="rounded bg-secondary px-1">POSTHOG_PROJECT_ID</code> to your env to see the funnel here.
              Create the key in PostHog → Settings → Personal API keys (query read scope).
            </p>
          </CardContent>
        </Card>
      </Shell>
    );
  }

  const [funnel, prev, daily, sources] = await Promise.all([
    fetchFunnel(filter),
    fetchFunnelPrevious(filter),
    fetchDailyRates(filter),
    fetchSources(days),
  ]);

  if (!funnel.ok) {
    return (
      <Shell days={days} device={device} source={source} sources={sources}>
        <Card>
          <CardContent className="text-body-sm text-destructive">
            Couldn&apos;t query PostHog{funnel.error ? ` — ${funnel.error}` : ""}. Check the API key, project id and host.
          </CardContent>
        </Card>
      </Shell>
    );
  }

  const maxUsers = Math.max(...funnel.steps.map((s) => s.users), 1);

  return (
    <Shell days={days} device={device} source={source} sources={sources}>
      {/* Funnel bars */}
      <Card>
        <CardHeader><CardTitle>Funnel — last {days} days{device ? ` · ${device}` : ""}{source ? ` · ${source}` : ""}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {funnel.steps.every((s) => s.users === 0) ? (
            <p className="py-6 text-center text-body-sm text-muted-foreground">
              No events in this period{device || source ? " for this segment" : ""}. Events flow in once the site has traffic.
            </p>
          ) : (
            funnel.steps.map((s, i) => {
              const prevUsers = prev[i] ?? null;
              const dropped =
                prevUsers !== null && prevUsers > 0 && s.users < prevUsers * 0.8;
              return (
                <div key={s.label} className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2 text-body-sm">
                    <span className="flex items-center gap-2 font-medium">
                      {s.label}
                      {dropped && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                          <AlertTriangle className="h-3 w-3" />
                          −{Math.round((1 - s.users / (prevUsers as number)) * 100)}% vs prev. period
                        </span>
                      )}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {s.users.toLocaleString("en-GB")}
                      {i > 0 && <span className="ml-2 text-label">({Math.round(s.stepConversion * 100)}% of prev · {Math.round(s.totalConversion * 100)}% total)</span>}
                    </span>
                  </div>
                  <div className="h-6 overflow-hidden rounded-md bg-secondary">
                    <div
                      className={`h-full rounded-md ${dropped ? "bg-destructive/60" : "bg-primary"}`}
                      style={{ width: `${(s.users / maxUsers) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Submit-rate trend */}
      <Card>
        <CardHeader><CardTitle>Visitors vs form submits — daily</CardTitle></CardHeader>
        <CardContent>
          {daily.length === 0 ? (
            <p className="py-6 text-center text-body-sm text-muted-foreground">No data in this period.</p>
          ) : (
            <TrendChart data={daily} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm text-muted-foreground">
            Need session replays or step-level form drop-off? That still lives in PostHog.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_POSTHOG_HOST?.replace("://eu.i.", "://eu.") || "https://eu.posthog.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-body-sm font-semibold hover:bg-secondary"
          >
            Open PostHog <ExternalLink className="h-4 w-4" />
          </a>
        </CardContent>
      </Card>
    </Shell>
  );
}

/** Page chrome + filter bar (GET form → server component refetch). */
function Shell({
  days, device, source, sources, children,
}: {
  days: number; device?: string; source?: string; sources: string[]; children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Funnel</h1>
        <p className="text-muted-foreground">Where visitors drop off on the way to becoming leads.</p>
      </div>

      <form method="get" className="flex flex-wrap items-center gap-2">
        <FilterSelect name="days" value={String(days)} options={DAY_OPTIONS.map((d) => [String(d), `Last ${d} days`])} />
        <FilterSelect
          name="device"
          value={device ?? ""}
          options={[["", "All devices"], ...DEVICES.map((d): [string, string] => [d, d[0].toUpperCase() + d.slice(1)])]}
        />
        <FilterSelect
          name="source"
          value={source ?? ""}
          options={[["", "All sources"], ...sources.map((s): [string, string] => [s, s])]}
        />
        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-body-sm font-semibold text-primary-foreground">
          Apply
        </button>
        {(device || source) && (
          <Link href="/dashboard/funnel" className="text-body-sm text-muted-foreground hover:text-foreground hover:underline">
            Clear
          </Link>
        )}
      </form>

      {children}
    </div>
  );
}

function FilterSelect({ name, value, options }: { name: string; value: string; options: [string, string][] }) {
  return (
    <select
      name={name}
      defaultValue={value}
      className="h-9 rounded-md border border-border bg-background px-3 text-body-sm"
    >
      {options.map(([v, label]) => (
        <option key={v} value={v}>{label}</option>
      ))}
    </select>
  );
}

/** Server-rendered SVG: visitors line + submits line. */
function TrendChart({ data }: { data: Array<{ day: string; visitors: number; submits: number }> }) {
  const w = 640;
  const h = 160;
  const pad = 8;
  const max = Math.max(...data.map((d) => d.visitors), 1);
  const step = data.length > 1 ? (w - pad * 2) / (data.length - 1) : 0;
  const y = (v: number) => h - pad - (v / max) * (h - pad * 2);
  const line = (pick: (d: { visitors: number; submits: number }) => number) =>
    data.map((d, i) => `${pad + i * step},${y(pick(d))}`).join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full" preserveAspectRatio="none" aria-hidden>
        <polyline points={line((d) => d.visitors)} className="fill-none stroke-muted-foreground/50" strokeWidth={1.5} />
        <polyline points={line((d) => d.submits)} className="fill-none stroke-primary" strokeWidth={2} />
      </svg>
      <div className="mt-2 flex items-center gap-4 text-label text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-muted-foreground/50" /> Visitors</span>
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-primary" /> Form submits</span>
        <span className="ml-auto">{data[0]?.day} → {data[data.length - 1]?.day}</span>
      </div>
    </div>
  );
}
