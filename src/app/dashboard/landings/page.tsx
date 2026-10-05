import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/system/card";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/components/system/table";
import { aggregateLandings, totals, RANGES, type LandingLeadRow } from "@/lib/dashboard/landings";
import { Stat } from "@/components/system/stat";
import { EmptyState } from "@/components/system/empty-state";
import { PageHeader } from "@/components/system/page-header";

export const dynamic = "force-dynamic";

export default async function LandingsPage({
  searchParams,
}: {
  searchParams: { days?: string };
}) {
  const days = Number(searchParams.days ?? 30);
  const range = RANGES.find((r) => r.days === days) ?? RANGES[1];

  const supabase = createClient();
  let query = supabase
    .from("leads")
    .select("landing_page, lead_score, gclid, traffic_source, device_type, status, created_at")
    .eq("is_test", false)
    .order("created_at", { ascending: false });

  if (range.days > 0) {
    const since = new Date(Date.now() - range.days * 86400000).toISOString();
    query = query.gte("created_at", since);
  }

  const { data } = await query;
  const rows = (data as unknown as LandingLeadRow[] | null) ?? [];
  const stats = aggregateLandings(rows);
  const sum = totals(stats);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Landing pages"
        description="Leads by the page they arrived on. This is the number to hold against Google Ads."
        actions={
          <div className="flex gap-1 rounded-lg bg-secondary p-1 text-body-sm font-medium">
            {RANGES.map((r) => (
              <Link
                key={r.days}
                href={`/dashboard/landings?days=${r.days}`}
                className={
                  r.days === range.days
                    ? "rounded-md bg-background px-3 py-1.5 shadow-sm"
                    : "rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground"
                }
              >
                {r.label}
              </Link>
            ))}
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Leads" value={sum.leads} />
        <Stat label="From Google Ads" value={sum.paidLeads} hint="carries a gclid" />
        <Stat label="Qualified (8+)" value={sum.qualified} />
        <Stat label="Booked / installed" value={sum.won} />
      </div>

      {stats.length === 0 ? (
        <EmptyState title="No leads in this range yet" description="Widen the date range, or check back once traffic has come in." />
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table density="default">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Landing page</TableHeaderCell>
                  <TableHeaderCell numeric>Leads</TableHeaderCell>
                  <TableHeaderCell numeric>Google Ads</TableHeaderCell>
                  <TableHeaderCell numeric>Qualified 8+</TableHeaderCell>
                  <TableHeaderCell numeric>Avg score</TableHeaderCell>
                  <TableHeaderCell numeric>Mobile</TableHeaderCell>
                  <TableHeaderCell numeric>Won</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.map((s) => (
                  <TableRow key={s.page}>
                    <TableCell className="font-mono">{s.page}</TableCell>
                    <TableCell numeric className="font-semibold">{s.leads}</TableCell>
                    <TableCell numeric>{s.paidLeads}</TableCell>
                    <TableCell numeric>
                      {s.qualified}
                      <span className="ml-1 text-muted-foreground">
                        ({s.leads ? Math.round((s.qualified / s.leads) * 100) : 0}%)
                      </span>
                    </TableCell>
                    <TableCell numeric>{s.avgScore ?? "—"}</TableCell>
                    <TableCell numeric>{s.mobileShare != null ? `${s.mobileShare}%` : "—"}</TableCell>
                    <TableCell numeric>{s.won}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="space-y-2 p-5 text-body-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Reading this against Google Ads</p>
          <p>
            <span className="font-medium text-foreground">Google Ads</span> counts a lead per{" "}
            <span className="font-mono text-label">gclid</span>, so that column is the one to compare with the
            conversions Google reports for the same date range and the same landing page. A gap of a few
            percent is normal, because attribution windows differ. A gap of 30%+ means one of the two is broken.
          </p>
          <p>
            These are lead <em>counts</em>, not conversion rates: we don&apos;t count visitors server-side, so a
            rate needs the clicks figure from Google. Statistical significance lives on the Experiments page,
            which has both halves.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

