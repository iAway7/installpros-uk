import { Users, Sparkles, CalendarClock, CalendarDays, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TrendChart } from "@/components/system/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/system/card";
import { type Lead, serviceOf } from "@/lib/dashboard/leads";
import { getVisitorLeadRate, fmtRate, fmtDelta } from "@/lib/dashboard/conversion";
import { realLeads } from "@/lib/dashboard/leads";
import { Stat } from "@/components/system/stat";
import { EmptyState } from "@/components/system/empty-state";
import { PageHeader } from "@/components/system/page-header";

export const dynamic = "force-dynamic";

type Row = Pick<Lead, "id" | "created_at" | "status" | "traffic_source" | "service" | "notes" | "is_test">;

const DAY = 864e5;

export default async function OverviewPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("id, created_at, status, traffic_source, service, notes, is_test")
    .order("created_at", { ascending: false });

  // Test submissions are flagged, not deleted; they never count here.
  const leads = realLeads((data as Row[] | null) ?? []);
  // Landing-page conversion (leads / unique visitors, PostHog). Null-safe: shows "—" when PostHog is off.
  const conv = await getVisitorLeadRate(leads.map((l) => l.created_at));
  const convDelta = fmtDelta(conv.deltaPoints, conv.windowDays);

  // Day boundaries in UK time: the leads are British and the team works on
  // UK days. The server runs in UTC, so a plain local midnight would start
  // "today" at 01:00 BST. Every count is a rolling window ending now, so the
  // three numbers nest (today ≤ 7 days ≤ 30 days) instead of mixing a rolling
  // week with a calendar month.
  const nowMs = Date.now();
  const startOfToday = ukDayStart(nowMs, 0);
  const sevenDaysAgo = ukDayStart(nowMs, 6);
  const fourteenDaysAgo = ukDayStart(nowMs, 13);
  const thirtyDaysAgo = ukDayStart(nowMs, 29);

  const ts = (l: Row) => new Date(l.created_at).getTime();

  const total = leads.length;
  const today = leads.filter((l) => ts(l) >= startOfToday).length;
  const last7 = leads.filter((l) => ts(l) >= sevenDaysAgo).length;
  const prev7 = leads.filter((l) => ts(l) >= fourteenDaysAgo && ts(l) < sevenDaysAgo).length;
  const last30 = leads.filter((l) => ts(l) >= thirtyDaysAgo).length;
  const weekDelta = prev7 ? Math.round(((last7 - prev7) / prev7) * 100) : null;

  const newCount = leads.filter((l) => l.status === "new").length;

  // Daily counts, last 14 UK days (oldest → newest) for the trend chart.
  const daily = Array.from({ length: 14 }, (_, i) => {
    const dayStart = ukDayStart(nowMs, 13 - i);
    const dayEnd = ukDayStart(nowMs, 12 - i);
    return {
      date: ukIsoDate(dayStart),
      leads: leads.filter((l) => ts(l) >= dayStart && ts(l) < dayEnd).length,
    };
  });

  const byService = Object.entries(
    leads.reduce<Record<string, number>>((acc, l) => {
      const k = serviceOf(l);
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  const bySource = Object.entries(
    leads.reduce<Record<string, number>>((acc, l) => {
      const k = l.traffic_source || "direct";
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

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
          {/* The number that matters: the last 7 days against the 7 before, plus trend */}
          <Card>
            <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="shrink-0">
                <p className="text-label font-medium uppercase tracking-wide text-muted-foreground">Leads, last 7 days</p>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-5xl font-bold tabular-nums">{last7}</span>
                  {weekDelta !== null && (
                    <span className={`text-body-sm font-semibold ${weekDelta >= 0 ? "text-success" : "text-destructive"}`}>
                      {weekDelta >= 0 ? "▲" : "▼"} {Math.abs(weekDelta)}% vs previous 7 days ({prev7})
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={<CalendarClock />} label="Today" value={today} hint="Since midnight, UK time" />
            <Stat icon={<CalendarDays />} label="Last 30 days" value={last30} />
            <Stat icon={<Sparkles />} label="New / unworked" value={newCount} attention />
            <Stat
              icon={<TrendingUp />}
              label={`Visitor → lead rate (${conv.windowDays}d)`}
              value={fmtRate(conv.rate)}
              delta={convDelta ? { text: convDelta.text, direction: convDelta.up ? "up" : "down" } : undefined}
              hint={conv.ok ? undefined : "Connect PostHog"}
            />
          </div>


          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Leads by service</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {byService.map(([service, count]) => (
                  <div key={service} className="flex items-center gap-3">
                    <span className="w-32 truncate text-body-sm" title={service}>{service}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
                    </div>
                    <span className="w-8 text-right text-body-sm font-medium tabular-nums">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Top traffic sources</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {bySource.map(([source, count]) => (
                  <div key={source} className="flex items-center gap-3">
                    <span className="w-28 truncate text-body-sm capitalize">{source}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-chart-2" style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
                    </div>
                    <span className="w-8 text-right text-body-sm font-medium tabular-nums">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

        </>
      )}
    </div>
  );
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
