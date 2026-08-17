import { Users, Sparkles, CalendarClock, TrendingUp, PoundSterling, Timer, FileClock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type Lead,
  type LeadStatus,
  LEAD_STATUSES,
  STATUS_LABEL,
  STATUS_STYLE,
  WON_STATUSES,
  serviceOf,
} from "@/lib/dashboard/leads";

export const dynamic = "force-dynamic";

type Row = Pick<
  Lead,
  "id" | "created_at" | "status" | "traffic_source" | "service" | "notes" | "estimated_value" | "contacted_at" | "quoted_at"
>;

const DAY = 864e5;

/** Average of (later - created_at) in hours, over leads where later is set. */
function avgHours(leads: Row[], later: (l: Row) => string | null): number | null {
  const deltas = leads
    .map((l) => {
      const end = later(l);
      return end ? new Date(end).getTime() - new Date(l.created_at).getTime() : null;
    })
    .filter((d): d is number => d !== null && d >= 0);
  if (!deltas.length) return null;
  return deltas.reduce((a, b) => a + b, 0) / deltas.length / 36e5;
}

function fmtHours(h: number | null): string {
  if (h == null) return "—";
  if (h < 1) return `${Math.round(h * 60)}m`;
  if (h < 48) return `${h.toFixed(1)}h`;
  return `${(h / 24).toFixed(1)}d`;
}

export default async function OverviewPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("id, created_at, status, traffic_source, service, notes, estimated_value, contacted_at, quoted_at")
    .order("created_at", { ascending: false });

  const leads = ((data as Row[] | null) ?? []);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const weekAgo = now.getTime() - 7 * DAY;
  const twoWeeksAgo = now.getTime() - 14 * DAY;

  const ts = (l: Row) => new Date(l.created_at).getTime();

  const total = leads.length;
  const today = leads.filter((l) => ts(l) >= startOfToday).length;
  const thisWeek = leads.filter((l) => ts(l) >= weekAgo).length;
  const lastWeek = leads.filter((l) => ts(l) >= twoWeeksAgo && ts(l) < weekAgo).length;
  const thisMonth = leads.filter((l) => ts(l) >= startOfMonth).length;
  const weekDelta = lastWeek ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : null;

  const newCount = leads.filter((l) => l.status === "new").length;
  const won = leads.filter((l) => WON_STATUSES.includes(l.status)).length;
  const convRate = total ? Math.round((won / total) * 1000) / 10 : 0;

  // Revenue still in play: everything not lost and not yet installed.
  const pipelineValue = leads
    .filter((l) => l.status !== "lost" && l.status !== "installed")
    .reduce((sum, l) => sum + (Number(l.estimated_value) || 0), 0);

  const timeToContact = avgHours(leads, (l) => l.contacted_at);
  const timeToQuote = avgHours(leads, (l) => l.quoted_at);

  // Daily counts, last 14 days (oldest → newest) for the trend line.
  const daily: number[] = Array.from({ length: 14 }, (_, i) => {
    const dayStart = startOfToday - (13 - i) * DAY;
    return leads.filter((l) => ts(l) >= dayStart && ts(l) < dayStart + DAY).length;
  });

  const byStatus = LEAD_STATUSES.map((s) => ({ status: s, count: leads.filter((l) => l.status === s).length }));

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Your lead pipeline at a glance.</p>
      </div>

      {error ? (
        <Card>
          <CardContent className="p-6 text-body-sm text-destructive">
            Couldn&apos;t load data ({error.message}). Check the Supabase connection.
          </CardContent>
        </Card>
      ) : total === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-12 text-center">
            <Users className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No leads yet</h3>
            <p className="max-w-sm text-body-sm text-muted-foreground">
              As soon as someone completes the form on your landing page, they&apos;ll show up here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* The number that matters: this week vs last week + trend */}
          <Card>
            <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
              <div className="shrink-0">
                <p className="text-label font-medium uppercase tracking-wide text-muted-foreground">Leads this week</p>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-5xl font-bold tabular-nums">{thisWeek}</span>
                  {weekDelta !== null && (
                    <span className={`text-body-sm font-semibold ${weekDelta >= 0 ? "text-success" : "text-destructive"}`}>
                      {weekDelta >= 0 ? "▲" : "▼"} {Math.abs(weekDelta)}% vs last week ({lastWeek})
                    </span>
                  )}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <Sparkline values={daily} />
                <p className="mt-1 text-right text-[11px] text-muted-foreground">Daily leads · last 14 days</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi icon={<CalendarClock className="h-5 w-5" />} label="Today" value={today} />
            <Kpi icon={<Users className="h-5 w-5" />} label="This month" value={thisMonth} />
            <Kpi icon={<Sparkles className="h-5 w-5" />} label="New / unworked" value={newCount} accent />
            <Kpi icon={<TrendingUp className="h-5 w-5" />} label="Conversion rate" value={`${convRate}%`} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Kpi
              icon={<PoundSterling className="h-5 w-5" />}
              label="Revenue in pipeline"
              value={pipelineValue ? `£${pipelineValue.toLocaleString("en-GB")}` : "—"}
            />
            <Kpi icon={<Timer className="h-5 w-5" />} label="Avg time to first contact" value={fmtHours(timeToContact)} />
            <Kpi icon={<FileClock className="h-5 w-5" />} label="Avg time to quote" value={fmtHours(timeToQuote)} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Pipeline by status</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {byStatus.map(({ status, count }) => (
                  <div key={status} className="flex items-center gap-3">
                    <span className={`inline-flex w-24 justify-center rounded-full px-2.5 py-0.5 text-label font-semibold ${STATUS_STYLE[status as LeadStatus]}`}>
                      {STATUS_LABEL[status as LeadStatus]}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
                    </div>
                    <span className="w-8 text-right text-body-sm font-medium tabular-nums">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

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
          </div>

          <Card>
            <CardHeader><CardTitle>Top traffic sources</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {bySource.map(([source, count]) => (
                <div key={source} className="flex items-center gap-3">
                  <span className="w-28 truncate text-body-sm capitalize">{source}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
                  </div>
                  <span className="w-8 text-right text-body-sm font-medium tabular-nums">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

/** Server-rendered SVG trend line — no client JS needed. */
function Sparkline({ values }: { values: number[] }) {
  const w = 600;
  const h = 80;
  const pad = 4;
  const max = Math.max(...values, 1);
  const step = (w - pad * 2) / (values.length - 1);
  const y = (v: number) => h - pad - (v / max) * (h - pad * 2);
  const points = values.map((v, i) => `${pad + i * step},${y(v)}`).join(" ");
  const area = `${pad},${h - pad} ${points} ${w - pad},${h - pad}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-20 w-full" preserveAspectRatio="none" aria-hidden>
      <polygon points={area} className="fill-primary/10" />
      <polyline points={points} className="fill-none stroke-primary" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {values.map((v, i) => (
        <circle key={i} cx={pad + i * step} cy={y(v)} r={2.5} className="fill-primary" />
      ))}
    </svg>
  );
}

function Kpi({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string | number; accent?: boolean }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold tabular-nums">{value}</div>
          <div className="text-label text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
