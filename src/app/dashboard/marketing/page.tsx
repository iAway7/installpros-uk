import { MousePointerClick, Eye, Percent, TrendingUp, Users, PoundSterling, Search, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSearchConsole } from "@/lib/google/search-console";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchConsoleChart } from "@/components/dashboard/search-console-chart";
import { WON_STATUSES, type LeadStatus } from "@/lib/dashboard/leads";

export const dynamic = "force-dynamic";

export default async function MarketingPage() {
  const supabase = createClient();
  const [{ data: leadRows }, sc] = await Promise.all([
    supabase.from("leads").select("id, created_at, status"),
    getSearchConsole(28),
  ]);

  const leads = (leadRows as { id: string; created_at: string; status: LeadStatus }[] | null) ?? [];
  const totalLeads = leads.length;
  const won = leads.filter((l) => WON_STATUSES.includes(l.status)).length;
  const convRate = totalLeads ? Math.round((won / totalLeads) * 1000) / 10 : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Marketing</h1>
        <p className="text-muted-foreground">Acquisition and SEO performance, blended with your lead pipeline.</p>
      </div>

      {/* Blended overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={<Users className="h-5 w-5" />} label="Total leads" value={totalLeads} />
        <Kpi icon={<TrendingUp className="h-5 w-5" />} label="Conversion rate" value={`${convRate}%`} />
        <Kpi
          icon={<Search className="h-5 w-5" />}
          label="Search clicks (28d)"
          value={sc.ok ? sc.totals.clicks.toLocaleString("en-GB") : "—"}
        />
        <Kpi
          icon={<PoundSterling className="h-5 w-5" />}
          label="Cost / lead"
          value="—"
          hint="Connect Google Ads"
        />
      </div>

      {/* Search Console */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Google Search Console</h2>
          {sc.ok && sc.site ? <span className="text-label text-muted-foreground">{sc.site} · last 28 days</span> : null}
        </div>

        {!sc.configured ? (
          <ConnectCard
            title="Connect Search Console"
            body="Add a Google service account and grant it read access to your Search Console property to see clicks, impressions, positions and top queries here."
            doc="See GOOGLE-SETUP.md for the 5-minute setup."
          />
        ) : !sc.ok ? (
          <Card>
            <CardContent className="p-6 text-body-sm text-destructive">
              Couldn&apos;t load Search Console data{sc.error ? ` — ${sc.error}` : ""}. Check the service account has
              access to <strong>{process.env.GOOGLE_SEARCH_CONSOLE_SITE}</strong>.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi icon={<MousePointerClick className="h-5 w-5" />} label="Clicks" value={sc.totals.clicks.toLocaleString("en-GB")} />
              <Kpi icon={<Eye className="h-5 w-5" />} label="Impressions" value={sc.totals.impressions.toLocaleString("en-GB")} />
              <Kpi icon={<Percent className="h-5 w-5" />} label="Avg CTR" value={`${(sc.totals.ctr * 100).toFixed(1)}%`} />
              <Kpi icon={<TrendingUp className="h-5 w-5" />} label="Avg position" value={sc.totals.position.toFixed(1)} />
            </div>

            <Card>
              <CardHeader><CardTitle>Clicks &amp; impressions</CardTitle></CardHeader>
              <CardContent>
                {sc.byDate.length ? <SearchConsoleChart data={sc.byDate} /> : <Empty>No data in this period.</Empty>}
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <RowTable title="Top queries" rows={sc.topQueries} />
              <RowTable title="Top pages" rows={sc.topPages} pageStyle />
            </div>
          </>
        )}
      </section>

      {/* Behaviour → PostHog (not duplicated here) */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">On-site behaviour &amp; funnel</h2>
        <Card>
          <CardContent className="flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-body-sm text-muted-foreground">
              Funnels, drop-off and session replays live in PostHog — we don&apos;t duplicate them here.
            </p>
            <a
              href={process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-body-sm font-semibold text-primary-foreground"
            >
              Open PostHog <ExternalLink className="h-4 w-4" />
            </a>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Kpi({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string | number; hint?: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-foreground">{icon}</div>
        <div className="min-w-0">
          <div className="text-2xl font-bold tabular-nums">{value}</div>
          <div className="truncate text-label text-muted-foreground">{hint ?? label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ConnectCard({ title, body, doc }: { title: string; body: string; doc: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 p-10 text-center">
        <Search className="h-9 w-9 text-muted-foreground" />
        <h3 className="text-body font-semibold">{title}</h3>
        <p className="max-w-md text-body-sm text-muted-foreground">{body}</p>
        <p className="text-label text-muted-foreground">{doc}</p>
      </CardContent>
    </Card>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-8 text-center text-body-sm text-muted-foreground">{children}</p>;
}

function RowTable({ title, rows, pageStyle }: { title: string; rows: { key: string; clicks: number; impressions: number; ctr: number; position: number }[]; pageStyle?: boolean }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="p-0">
        {rows.length === 0 ? (
          <Empty>No data yet.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-body-sm">
              <thead className="border-y border-border bg-secondary/40 text-left text-label uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">{pageStyle ? "Page" : "Query"}</th>
                  <th className="px-3 py-2 text-right font-medium">Clicks</th>
                  <th className="px-3 py-2 text-right font-medium">Impr.</th>
                  <th className="px-3 py-2 text-right font-medium">Pos.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.key}>
                    <td className="max-w-[220px] truncate px-4 py-2" title={r.key}>
                      {pageStyle ? r.key.replace(/^https?:\/\/[^/]+/, "") || "/" : r.key}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.clicks.toLocaleString("en-GB")}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{r.impressions.toLocaleString("en-GB")}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{r.position.toFixed(1)}</td>
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
