import Link from "next/link";
import { Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/system/card";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/components/system/table";
import { DateFilter, SelectFilter } from "@/components/system/filters";
import { createClient } from "@/lib/supabase/server";
import { realLeads } from "@/lib/dashboard/leads";
import { fetchSources, fetchTargetCounts, isOrganicSource, posthogConfigured, FUNNEL_PAGES, ORGANIC_SOURCE } from "@/lib/posthog/query";
import { buildTargetsReport, pct, LAUNCH_DATE, type TargetStatus, type TargetsReport } from "@/lib/dashboard/targets";
import { EmptyState } from "@/components/system/empty-state";
import { PageHeader } from "@/components/system/page-header";
import { Pill, type PillVariant } from "@/components/system/badge";

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
  until?: string;
  page?: string;
  source?: string;
}

interface Filters {
  since: string;
  /** Inclusive end of the range. Empty means "up to now". */
  until: string;
  page: string;
  source: string;
}

function stripSlash(p: string | null | undefined): string {
  return (p ?? "").replace(/\/+$/, "") || "/";
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** `until` is inclusive, but created_at is a timestamp, so the Supabase
 *  filter needs the day after it as an exclusive bound. */
function dayAfter(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default async function TargetsPage({ searchParams }: { searchParams: SearchParams }) {
  const since = ISO_DATE.test(searchParams.since ?? "") ? (searchParams.since as string) : LAUNCH_DATE;
  const untilParam = ISO_DATE.test(searchParams.until ?? "") ? (searchParams.until as string) : "";
  // An end before the start would silently report zeroes; treat it as open-ended.
  const until = untilParam && untilParam < since ? "" : untilParam;
  const page = (FUNNEL_PAGES as readonly string[]).includes(searchParams.page ?? "") ? (searchParams.page as string) : DEFAULT_PAGE;
  const source = searchParams.source?.slice(0, 60) || DEFAULT_SOURCE;
  const filters: Filters = { since, until, page, source };

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
  let leadsQuery = supabase
    .from("leads")
    .select("id, created_at, device_type, landing_page, traffic_source, is_test")
    .gte("created_at", since);
  if (until) leadsQuery = leadsQuery.lt("created_at", dayAfter(until));
  const [counts, sources, leadsResult] = await Promise.all([
    fetchTargetCounts({ since, until, page, source }),
    fetchSources(365),
    leadsQuery,
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
        <span className="font-semibold text-foreground tabular-nums">{report.leads.toLocaleString("en-GB")}</span>{" "}
        leads {until ? `from ${since} to ${until}` : `since ${since}`}.
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
          <Table density="compact">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Metric</TableHeaderCell>
                <TableHeaderCell numeric>Baseline</TableHeaderCell>
                <TableHeaderCell numeric>Target</TableHeaderCell>
                <TableHeaderCell numeric>Actual</TableHeaderCell>
                <TableHeaderCell className="text-right">Status</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.rows.map((r) => (
                <TableRow key={r.metric}>
                  <TableCell>
                    <div className="font-medium">{r.metric}</div>
                    <div className="text-label text-muted-foreground">{r.detail}</div>
                  </TableCell>
                  <TableCell numeric className="text-muted-foreground">{pct(r.baseline)}</TableCell>
                  <TableCell numeric className="text-muted-foreground">{pct(r.target)}{r.hold ? " (hold)" : ""}</TableCell>
                  <TableCell numeric className="font-semibold">{pct(r.actual)}</TableCell>
                  <TableCell className="text-right"><StatusBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-secondary/20">
                <TableCell colSpan={3}>
                  <div className="font-medium">WhatsApp after lead</div>
                  <div className="text-label text-muted-foreground">tapped WhatsApp on the thank-you page; not added to conversion</div>
                </TableCell>
                <TableCell numeric colSpan={2}>
                  {report.whatsappAfterLead} of {report.leads} leads
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
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
          <EmptyState variant="inline" description="No visitors or leads in this period." />
        ) : (
          <div className="overflow-x-auto">
            <Table density="compact">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Device</TableHeaderCell>
                  <TableHeaderCell numeric>Visitors</TableHeaderCell>
                  <TableHeaderCell numeric>Form starts</TableHeaderCell>
                  <TableHeaderCell numeric>Leads</TableHeaderCell>
                  <TableHeaderCell numeric>Visitor → lead</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.devices.map((d) => (
                  <TableRow key={d.device}>
                    <TableCell className="capitalize">{d.device}</TableCell>
                    <TableCell numeric>{d.visitors.toLocaleString("en-GB")}</TableCell>
                    <TableCell numeric className="text-muted-foreground">{d.starts.toLocaleString("en-GB")}</TableCell>
                    <TableCell numeric>{d.leads.toLocaleString("en-GB")}</TableCell>
                    <TableCell numeric className="font-semibold">{pct(d.rate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const STATUS_TONE: Record<TargetStatus, [string, PillVariant]> = {
  beaten: ["Beaten", "success"],
  below: ["Below target", "warning"],
  insufficient: ["Not enough data", "muted"],
};

function StatusBadge({ status }: { status: TargetStatus }) {
  const [label, tone] = STATUS_TONE[status];
  return <Pill variant={tone}>{label}</Pill>;
}

function Shell({ filters, sources, children }: { filters: Filters; sources: [string, string][]; children: React.ReactNode }) {
  const { since, until, page, source } = filters;
  const isDefault = since === LAUNCH_DATE && !until && page === DEFAULT_PAGE && source === DEFAULT_SOURCE;
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Targets" description="The new landing against the June 2026 baseline and the targets set for it. Rates need at least 30 visitors before they are judged." />

      <div className="flex flex-wrap items-end gap-3">
        <DateFilter name="since" label="From" value={since} min={LAUNCH_DATE} placeholder={LAUNCH_DATE} />
        <DateFilter name="until" label="To" value={until} min={since} placeholder="Up to now" clearable />
        <SelectFilter name="page" label="Landing page" value={page} options={FUNNEL_PAGES.map((p): [string, string] => [p, p])} />
        <SelectFilter name="source" label="Traffic source" value={source} options={sources} />
        {!isDefault && (
          <Link href="/dashboard/targets" className="pb-2 text-body-sm text-muted-foreground hover:text-foreground hover:underline">
            Reset
          </Link>
        )}
      </div>

      {children}
    </div>
  );
}

