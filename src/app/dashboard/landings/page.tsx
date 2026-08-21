import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/system/card";
import { aggregateLandings, totals, RANGES, type LandingLeadRow } from "@/lib/dashboard/landings";

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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Landing pages</h1>
          <p className="text-muted-foreground">
            Leads by the page they arrived on. This is the number to hold against Google Ads.
          </p>
        </div>
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
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Leads" value={sum.leads} />
        <Stat label="From Google Ads" value={sum.paidLeads} hint="carries a gclid" />
        <Stat label="Qualified (8+)" value={sum.qualified} />
        <Stat label="Booked / installed" value={sum.won} />
      </div>

      {stats.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-body-sm text-muted-foreground">
            No leads in this range yet.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-body-sm">
              <thead className="border-b border-border/50 text-label uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Landing page</th>
                  <th className="px-4 py-3 text-right font-semibold">Leads</th>
                  <th className="px-4 py-3 text-right font-semibold">Google Ads</th>
                  <th className="px-4 py-3 text-right font-semibold">Qualified 8+</th>
                  <th className="px-4 py-3 text-right font-semibold">Avg score</th>
                  <th className="px-4 py-3 text-right font-semibold">Mobile</th>
                  <th className="px-4 py-3 text-right font-semibold">Won</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s) => (
                  <tr key={s.page} className="border-b border-border/30 last:border-0">
                    <td className="px-4 py-3 font-mono">{s.page}</td>
                    <td className="px-4 py-3 text-right font-semibold">{s.leads}</td>
                    <td className="px-4 py-3 text-right">{s.paidLeads}</td>
                    <td className="px-4 py-3 text-right">
                      {s.qualified}
                      <span className="ml-1 text-muted-foreground">
                        ({s.leads ? Math.round((s.qualified / s.leads) * 100) : 0}%)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">{s.avgScore ?? "—"}</td>
                    <td className="px-4 py-3 text-right">{s.mobileShare != null ? `${s.mobileShare}%` : "—"}</td>
                    <td className="px-4 py-3 text-right">{s.won}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-label uppercase text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        {hint && <p className="text-label text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}
