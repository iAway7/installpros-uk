import Link from "next/link";
import { Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/system/card";
import { createClient } from "@/lib/supabase/server";
import { realLeads } from "@/lib/dashboard/leads";
import { fetchSources, fetchTargetCounts, isOrganicSource, posthogConfigured, FUNNEL_PAGES, ORGANIC_SOURCE } from "@/lib/posthog/query";
import { buildTargetsReport, pct, LAUNCH_DATE, type TargetStatus, type TargetsReport } from "@/lib/dashboard/targets";

export const dynamic = "force-dynamic";

const DEFAULT_PAGE = "/install-quote";
const DEFAULT_SOURCE = "google";

/** The sources people actually reason about, in the order they should
 *  appear. Anything else PostHog has seen is listed after these by name. */
const NAMED_SOURCES: [string, string][] = [
  ["google", "Google Ads (paid)"],
  [ORGANIC_SOURCE, "Organic search"],
  ["direct", "Direct / unknown"],
];

function sourceOptions(seen: string[], current: string): [string, string][] {
  const named = new Set(NAMED_SOURCES.map(([v]) => v));
  const rest = seen.filter((s) => !named.has(s) && !isOrganicSource(s));
  if (!named.has(current) && !rest.includes(current)) rest.push(current);
  return [...NAMED_SOURCES, ...rest.map((s): [string, string] => [s, s])];
}

function sourceLabel(source: string): string {
  return NAMED_SOURCES.find(([v]) => v === source)?.[1] ?? source;
}

function matchesSource(lead: { traffic_source: string | null }, source: string): boolean {
  if (source === ORGANIC_SOURCE) return isOrganicSource(lead.traffic_source);
  return (lead.traffic_source ?? "") === source;
}

interface SearchParams {
  since?: string;
  page?: string;
  source?: string;
}

interface Filters {
  since: string;
  page: string;
  source: string;
}

function stripSlash(p: string | null | undefined): string {
  return (p ?? "").replace(/\/+$/, "") || "/";
}

export default async function TargetsPage({ searchParams }: { searchParams: SearchParams }) {
  const since = /^\d{4}-\d{2}-\d{2}$/.test(searchParams.since ?? "") ? (searchParams.since as string) : LAUNCH_DATE;
  const page = (FUNNEL_PAGES as readonly string[]).includes(searchParams.page ?? "") ? (searchParams.page as string) : DEFAULT_PAGE;
  const source = searchParams.source?.slice(0, 60) || DEFAULT_SOURCE;
  const filters: Filters = { since, page, source };

  if (!posthogConfigured()) {
    return (
      <Shell filters={filters} sources={[]}>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <Filter className="h-9 w-9 text-muted-foreground" />
            <h3 className="text-body font-semibold">Connect PostHog queries</h3>
            <p className="max-w-md text-body-sm text-muted-foreground">
              Add <code className="rounded bg-secondary px-1">POSTHOG_PERSONAL_API_KEY</code> and{" "}
              <code className="rounded bg-secondary px-1">POSTHOG_PROJECT_ID</code> to your env to see targets here.
              Create the key in PostHog → Settings → Personal API keys (query read scope).
            </p>
          </CardContent>
        </Card>
      </Shell>
    );
  }

  // Visitors and form starts come from PostHog; leads come from Supabase on
  // purpose. PostHog loses roughly a tenth of people to blockers, the DB
  // has every submission.
  const supabase = createClient();
  const [counts, sources, leadsResult] = await Promise.all([
    fetchTargetCounts({ since, page, source }),
    fetchSources(365),
    supabase
      .from("leads")
      .select("id, created_at, device_type, landing_page, traffic_source, is_test")
      .gte("created_at", since),
  ]);
  const options = sourceOptions(sources, source);

  if (!counts.ok) {
    return (
      <Shell filters={filters} sources={options}>
        <Card>
          <CardContent className="text-body-sm text-destructive">
            Couldn&apos;t query PostHog{counts.error ? `: ${counts.error}` : ""}. Check the API key, project id and host.
          </CardContent>
        </Card>
      </Shell>
    );
  }
  if (leadsResult.error) {
    return (
      <Shell filters={filters} sources={options}>
        <Card>
          <CardContent className="text-body-sm text-destructive">Couldn&apos;t load leads: {leadsResult.error.message}</CardContent>
        </Card>
      </Shell>
    );
  }

  const leads = realLeads(leadsResult.data ?? []).filter(
    (l) => stripSlash(l.landing_page) === stripSlash(page) && matchesSource(l, source),
  );
  const report = buildTargetsReport(counts, leads);

  return (
    <Shell filters={filters} sources={options}>
      <p className="text-body-sm text-muted-foreground">
        <span className="font-semibold text-foreground tabular-nums">{report.visitors.toLocaleString("en-GB")}</span> visitors ·{" "}
        <span className="font-semibold text-foreground tabular-nums">{report.starts.toLocaleString("en-GB")}</span> form starts ·{" "}
        <span className="font-semibold text-foreground tabular-nums">{report.leads.toLocaleString("en-GB")}</span> leads since {since}.
        Visitors and form starts are unique people in PostHog on {page} from {sourceLabel(source)}; leads are real submissions in the database for the same landing and source.
      </p>

      <TargetsTable report={report} />
      <DeviceTable report={report} />
    </Shell>
  );
}

function TargetsTable({ report }: { report: TargetsReport }) {
  return (
    <Card>
      <CardHeader><CardTitle>Targets</CardTitle></CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead className="border-y border-border bg-secondary/40 text-left text-label uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Metric</th>
                <th className="px-3 py-2 text-right font-medium">Baseline</th>
                <th className="px-3 py-2 text-right font-medium">Target</th>
                <th className="px-3 py-2 text-right font-medium">Actual</th>
                <th className="px-3 py-2 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {report.rows.map((r) => (
                <tr key={r.metric}>
                  <td className="px-4 py-2">
                    <div className="font-medium">{r.metric}</div>
                    <div className="text-label text-muted-foreground">{r.detail}</div>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{pct(r.baseline)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{pct(r.target)}{r.hold ? " (hold)" : ""}</td>
                  <td className="px-3 py-2 text-right font-semibold tabular-nums">{pct(r.actual)}</td>
                  <td className="px-3 py-2 text-right"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
              <tr className="bg-secondary/20">
                <td className="px-4 py-2" colSpan={3}>
                  <div className="font-medium">WhatsApp after lead</div>
                  <div className="text-label text-muted-foreground">tapped WhatsApp on the thank-you page; not added to conversion</div>
                </td>
                <td className="px-3 py-2 text-right tabular-nums" colSpan={2}>
                  {report.whatsappAfterLead} of {report.leads} leads
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function DeviceTable({ report }: { report: TargetsReport }) {
  return (
    <Card>
      <CardHeader><CardTitle>By device</CardTitle></CardHeader>
      <CardContent className="p-0">
        {report.devices.length === 0 ? (
          <p className="py-6 text-center text-body-sm text-muted-foreground">No visitors or leads in this period.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-body-sm">
              <thead className="border-y border-border bg-secondary/40 text-left text-label uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Device</th>
                  <th className="px-3 py-2 text-right font-medium">Visitors</th>
                  <th className="px-3 py-2 text-right font-medium">Form starts</th>
                  <th className="px-3 py-2 text-right font-medium">Leads</th>
                  <th className="px-3 py-2 text-right font-medium">Visitor → lead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {report.devices.map((d) => (
                  <tr key={d.device}>
                    <td className="px-4 py-2 capitalize">{d.device}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{d.visitors.toLocaleString("en-GB")}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{d.starts.toLocaleString("en-GB")}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{d.leads.toLocaleString("en-GB")}</td>
                    <td className="px-3 py-2 text-right font-semibold tabular-nums">{pct(d.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const STATUS_STYLE: Record<TargetStatus, [string, string]> = {
  beaten: ["Beaten", "bg-success/15 text-success"],
  below: ["Below target", "bg-amber-500/10 text-amber-600"],
  insufficient: ["Not enough data", "bg-muted text-muted-foreground"],
};

function StatusBadge({ status }: { status: TargetStatus }) {
  const [label, cls] = STATUS_STYLE[status];
  return <span className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-label font-medium ${cls}`}>{label}</span>;
}

function Shell({ filters, sources, children }: { filters: Filters; sources: [string, string][]; children: React.ReactNode }) {
  const { since, page, source } = filters;
  const isDefault = since === LAUNCH_DATE && page === DEFAULT_PAGE && source === DEFAULT_SOURCE;
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Targets</h1>
        <p className="text-muted-foreground">
          The new landing against the June 2026 baseline and the targets set for it. Rates need at least 30 visitors before they are judged.
        </p>
      </div>

      <form method="get" className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-label text-muted-foreground">
          Since
          <input
            type="date"
            name="since"
            defaultValue={since}
            min={LAUNCH_DATE}
            className="h-9 rounded-md border border-border bg-background px-3 text-body-sm text-foreground"
          />
        </label>
        <label className="flex flex-col gap-1 text-label text-muted-foreground">
          Landing page
          <FilterSelect name="page" value={page} options={FUNNEL_PAGES.map((p): [string, string] => [p, p])} />
        </label>
        <label className="flex flex-col gap-1 text-label text-muted-foreground">
          Traffic source
          <FilterSelect name="source" value={source} options={sources} />
        </label>
        <button type="submit" className="h-9 rounded-md bg-primary px-4 text-body-sm font-semibold text-primary-foreground">
          Apply
        </button>
        {!isDefault && (
          <Link href="/dashboard/targets" className="pb-2 text-body-sm text-muted-foreground hover:text-foreground hover:underline">
            Reset
          </Link>
        )}
      </form>

      {children}
    </div>
  );
}

function FilterSelect({ name, value, options }: { name: string; value: string; options: [string, string][] }) {
  return (
    <select name={name} defaultValue={value} className="h-9 rounded-md border border-border bg-background px-3 text-body-sm text-foreground">
      {options.map(([v, label]) => (
        <option key={v} value={v}>{label}</option>
      ))}
    </select>
  );
}
