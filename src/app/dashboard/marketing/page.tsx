import { MousePointerClick, Eye, Percent, TrendingUp, Search, ExternalLink } from "lucide-react";
import { getSearchConsole } from "@/lib/google/search-console";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/system/card";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/components/system/table";
import { SearchConsoleChart } from "@/components/dashboard/search-console-chart";
import { Stat } from "@/components/system/stat";
import { EmptyState } from "@/components/system/empty-state";
import { PageHeader } from "@/components/system/page-header";

export const dynamic = "force-dynamic";

export default async function MarketingPage() {
  const sc = await getSearchConsole(28);

  // This page used to open with total leads, a visitor to lead rate and a
  // "Cost / lead" tile. The rate divided every database lead by PostHog's
  // visitors, which reads high and disagreed with Targets; the cost could
  // never be filled (no Google Ads API access); the total repeated Overview.
  // What is left is Search Console. The landing pages are noindex, so this is
  // the organic search of installpros.co.uk, not of the landings. It is off
  // the sidebar for that reason, and still answers at /dashboard/marketing.
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Search Console"
        description="Organic Google search for installpros.co.uk. The landing pages are not indexed, so none of this traffic is theirs."
      />

      {/* Search Console */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-title font-semibold">Google Search Console</h2>
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
            <CardContent className="text-body-sm text-destructive">
              Couldn&apos;t load Search Console data{sc.error ? `: ${sc.error}` : ""}. Check the service account has
              access to <strong>{process.env.GOOGLE_SEARCH_CONSOLE_SITE}</strong>.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat icon={<MousePointerClick />} label="Clicks" value={sc.totals.clicks.toLocaleString("en-GB")} />
              <Stat icon={<Eye />} label="Impressions" value={sc.totals.impressions.toLocaleString("en-GB")} />
              <Stat icon={<Percent />} label="Avg CTR" value={`${(sc.totals.ctr * 100).toFixed(1)}%`} />
              <Stat icon={<TrendingUp />} label="Avg position" value={sc.totals.position.toFixed(1)} />
            </div>

            <Card>
              <CardHeader><CardTitle>Clicks &amp; impressions</CardTitle></CardHeader>
              <CardContent>
                {sc.byDate.length ? <SearchConsoleChart data={sc.byDate} /> : <EmptyState variant="inline" description="No data in this period." />}
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
        <h2 className="text-title font-semibold">On-site behaviour &amp; funnel</h2>
        <Card>
          <CardContent className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-body-sm text-muted-foreground">
              Funnels, drop-off and session replays live in PostHog. We don&apos;t duplicate them here.
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

function RowTable({ title, rows, pageStyle }: { title: string; rows: { key: string; clicks: number; impressions: number; ctr: number; position: number }[]; pageStyle?: boolean }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="p-0">
        {rows.length === 0 ? (
          <EmptyState variant="inline" description="No data yet." />
        ) : (
          <div className="overflow-x-auto">
            <Table density="compact">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>{pageStyle ? "Page" : "Query"}</TableHeaderCell>
                  <TableHeaderCell numeric>Clicks</TableHeaderCell>
                  <TableHeaderCell numeric>Impr.</TableHeaderCell>
                  <TableHeaderCell numeric>Pos.</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.key}>
                    <TableCell className="max-w-[220px] truncate" title={r.key}>
                      {pageStyle ? r.key.replace(/^https?:\/\/[^/]+/, "") || "/" : r.key}
                    </TableCell>
                    <TableCell numeric>{r.clicks.toLocaleString("en-GB")}</TableCell>
                    <TableCell numeric className="text-muted-foreground">{r.impressions.toLocaleString("en-GB")}</TableCell>
                    <TableCell numeric className="text-muted-foreground">{r.position.toFixed(1)}</TableCell>
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
