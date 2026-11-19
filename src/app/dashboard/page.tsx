import { Users, CalendarClock, CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { fetchAll } from "@/lib/supabase/fetch-all";
import { TrendChart } from "@/components/system/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/system/card";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/components/system/table";
import { type Lead, realLeads } from "@/lib/dashboard/leads";
import { normalisePagePath } from "@/lib/dashboard/landings";
import { Stat } from "@/components/system/stat";
import { EmptyState } from "@/components/system/empty-state";
import { PageHeader } from "@/components/system/page-header";

export const dynamic = "force-dynamic";

type Row = Pick<Lead, "id" | "created_at" | "landing_page" | "is_test">;

const DAY = 864e5;

export default async function OverviewPage() {
  const supabase = createClient();
  const { data, error } = await fetchAll<Row>(() =>
    supabase
      .from("leads")
      .select("id, created_at, landing_page, is_test")
      .order("created_at", { ascending: false }),
  );

  // Test submissions are flagged, not deleted; they never count here.
  const leads = realLeads((data as Row[] | null) ?? []);
  // No visitor to lead rate here. The one this page showed divided every
  // database lead by PostHog's visitors, which reads high (PostHog misses
  // about 1 in 4 leads) and disagreed with Targets. Targets has the rate.

  // Day boundaries in UK time: the leads are British and the team works on
  // UK days. The server runs in UTC, so a plain local midnight would start
  // "today" at 01:00 BST. Every count is a rolling window ending now, so the
  // three numbers nest (today ≤ 7 days ≤ 30 days) instead of mixing a rolling
  // week with a calendar month.
  //
  // "Last 7 days" is the six UK days before today plus today so far. The week
  // it is compared with stops at the same hour, seven days back: against
  // seven full days it read as a drop every morning.
  const nowMs = Date.now();
  const startOfToday = ukDayStart(nowMs, 0);
  const sevenDaysAgo = ukDayStart(nowMs, 6);
  const fourteenDaysAgo = ukDayStart(nowMs, 13);
  const prevWeekEnd = ukDayStart(nowMs, 7) + (nowMs - startOfToday);
  const thirtyDaysAgo = ukDayStart(nowMs, 29);

  const ts = (l: Row) => new Date(l.created_at).getTime();

  const total = leads.length;
  const today = leads.filter((l) => ts(l) >= startOfToday).length;
  const last7 = leads.filter((l) => ts(l) >= sevenDaysAgo).length;
  const isPrev7 = (l: Row) => ts(l) >= fourteenDaysAgo && ts(l) < prevWeekEnd;
  const prev7 = leads.filter(isPrev7).length;
  const last30 = leads.filter((l) => ts(l) >= thirtyDaysAgo).length;
  const weekDelta = prev7 ? Math.round(((last7 - prev7) / prev7) * 100) : null;

  // Daily counts, last 14 UK days (oldest → newest) for the trend chart.
  const daily = Array.from({ length: 14 }, (_, i) => {
    const dayStart = ukDayStart(nowMs, 13 - i);
    const dayEnd = ukDayStart(nowMs, 12 - i);
    return {
      date: ukIsoDate(dayStart),
      leads: leads.filter((l) => ts(l) >= dayStart && ts(l) < dayEnd).length,
    };
  });

  // One row per landing that had a lead in the last 30 days, busiest first:
  // the daily check is whether each page is still sending leads, and a total
  // led by /install-quote hides a smaller page that has stopped.
  const byPage = new Map<string, { today: number; last7: number; prev7: number; last30: number; lastAt: number }>();
  for (const l of leads) {
    const t = ts(l);
    if (t < Math.min(thirtyDaysAgo, fourteenDaysAgo)) continue;
    const page = normalisePagePath(l.landing_page);
    const r = byPage.get(page) ?? { today: 0, last7: 0, prev7: 0, last30: 0, lastAt: 0 };
    if (t >= startOfToday) r.today++;
    if (t >= sevenDaysAgo) r.last7++;
    if (isPrev7(l)) r.prev7++;
    if (t >= thirtyDaysAgo) r.last30++;
    r.lastAt = Math.max(r.lastAt, t);
    byPage.set(page, r);
  }
  const pages = Array.from(byPage.entries())
    .filter(([, r]) => r.last30 > 0)
    .sort((x, y) => y[1].last30 - x[1].last30);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader title="Overview" description="Your lead pipeline at a glance." />

      {error ? (
        <Card>
          <CardContent className="text-body-sm text-destructive">
            Couldn&apos;t load data ({error.message}). Check the Supabase connection.
          </CardContent>
        </Card>
      ) : total === 0 ? (
        <EmptyState
          icon={<Users />}
          title="No leads yet"
          description="As soon as someone completes the form on your landing page, they'll show up here."
        />
      ) : (
        <>
          {/* The number that matters: the last 7 days against the week before, plus trend */}
          <Card>
            <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="shrink-0">
                <p className="text-label font-medium uppercase tracking-wide text-muted-foreground">Leads, last 7 days</p>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-5xl font-bold tabular-nums">{last7}</span>
                  {weekDelta !== null && (
                    <span className={`text-body-sm font-semibold ${weekDelta >= 0 ? "text-success" : "text-destructive"}`}>
                      {weekDelta >= 0 ? "▲" : "▼"} {Math.abs(weekDelta)}% vs the 7 days before, to this hour ({prev7})
                    </span>
                  )}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <TrendChart data={daily} series={[{ key: "leads", name: "Leads" }]} height={140} />
                <p className="mt-1 text-right text-label text-muted-foreground">Daily leads · last 14 days</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Stat icon={<CalendarClock />} label="Today" value={today} hint="Since midnight, UK time" />
            <Stat icon={<CalendarDays />} label="Last 30 days" value={last30} hint="29 UK days and today" />
          </div>

          <Card>
            <CardHeader><CardTitle>Leads by landing page</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <Table density="compact">
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Landing page</TableHeaderCell>
                    <TableHeaderCell numeric>Today</TableHeaderCell>
                    <TableHeaderCell numeric>Last 7 days</TableHeaderCell>
                    <TableHeaderCell numeric>7 days before</TableHeaderCell>
                    <TableHeaderCell numeric>Last 30 days</TableHeaderCell>
                    <TableHeaderCell numeric>Last lead</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pages.map(([page, r]) => (
                    <TableRow key={page}>
                      <TableCell className="font-mono">{page}</TableCell>
                      <TableCell numeric className="font-semibold">{r.today}</TableCell>
                      <TableCell numeric>{r.last7}</TableCell>
                      <TableCell numeric className="text-muted-foreground">{r.prev7}</TableCell>
                      <TableCell numeric>{r.last30}</TableCell>
                      <TableCell numeric className="whitespace-nowrap text-muted-foreground">{timeAgo(nowMs - r.lastAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="border-t border-border px-4 py-3 text-label text-muted-foreground">
                Pages with a lead in the last 30 days. &ldquo;7 days before&rdquo; stops at this hour, seven days ago. Visitor to lead rates are on Targets.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

/** "12 min ago", "5 h ago", "3 days ago". */
function timeAgo(ms: number): string {
  const min = Math.max(0, Math.round(ms / 60000));
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 48) return `${h} h ago`;
  return `${Math.round(h / 24)} days ago`;
}

const UK = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function ukParts(ms: number) {
  const p = Object.fromEntries(UK.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, min: +p.minute, s: +p.second };
}

/** Milliseconds UK wall-clock time is ahead of UTC at `ms` (0 in GMT, 1h in BST). */
function ukOffset(ms: number): number {
  const p = ukParts(ms);
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s) - Math.floor(ms / 1000) * 1000;
}

/** UTC timestamp of UK midnight, `daysBack` UK calendar days before the day of `ms`. */
function ukDayStart(ms: number, daysBack: number): number {
  const p = ukParts(ms);
  const wallMidnight = Date.UTC(p.y, p.m - 1, p.d - daysBack);
  // The offset at that midnight, not now: a DST change inside the window moves it by an hour.
  return wallMidnight - ukOffset(wallMidnight - ukOffset(wallMidnight));
}

/** YYYY-MM-DD of the UK day that starts at `ms`. */
function ukIsoDate(ms: number): string {
  const p = ukParts(ms);
  return `${p.y}-${String(p.m).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
}
