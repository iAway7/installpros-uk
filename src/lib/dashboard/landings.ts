/**
 * Per-landing-page lead counts. Built to be checked against Google Ads:
 * when a landing-page test runs in Google, its "conversions" figure should
 * line up with `paidLeads` here for the same date range. If the two diverge,
 * one of the two measurements is wrong — and it matters which.
 */

export interface LandingLeadRow {
  landing_page: string | null;
  lead_score: number | null;
  gclid: string | null;
  traffic_source: string | null;
  device_type: string | null;
  status: string | null;
  created_at: string;
}

export interface LandingStats {
  page: string;
  /** Every lead that landed here, whatever the source. */
  leads: number;
  /** Leads carrying a gclid — the apples-to-apples number vs Google Ads. */
  paidLeads: number;
  /** Score >= 8. The number that actually predicts revenue. */
  qualified: number;
  /** Mean score across leads that have been scored. */
  avgScore: number | null;
  mobileShare: number | null;
  /** Booked or installed. */
  won: number;
}

const WON = new Set(["booked", "installed"]);

/** "google / cpc"-ish sources, for leads where auto-tagging didn't give a gclid. */
function isPaid(row: LandingLeadRow): boolean {
  if (row.gclid) return true;
  const src = (row.traffic_source ?? "").toLowerCase();
  return src === "google" || src === "googleads" || src === "adwords";
}

export function aggregateLandings(rows: LandingLeadRow[]): LandingStats[] {
  const byPage = new Map<string, LandingLeadRow[]>();
  for (const r of rows) {
    const page = r.landing_page?.trim() || "(unknown)";
    const list = byPage.get(page);
    if (list) list.push(r);
    else byPage.set(page, [r]);
  }

  const stats: LandingStats[] = [];
  for (const [page, list] of Array.from(byPage.entries())) {
    const scored = list.filter((r) => r.lead_score != null);
    const withDevice = list.filter((r) => r.device_type);
    stats.push({
      page,
      leads: list.length,
      paidLeads: list.filter(isPaid).length,
      qualified: list.filter((r) => (r.lead_score ?? 0) >= 8).length,
      avgScore: scored.length
        ? Math.round((scored.reduce((s, r) => s + (r.lead_score ?? 0), 0) / scored.length) * 10) / 10
        : null,
      mobileShare: withDevice.length
        ? Math.round((withDevice.filter((r) => r.device_type === "mobile").length / withDevice.length) * 100)
        : null,
      won: list.filter((r) => WON.has(r.status ?? "")).length,
    });
  }

  return stats.sort((a, b) => b.leads - a.leads);
}

/**
 * Two-proportion comparison is NOT done here on purpose: leads-per-landing
 * has no denominator of its own (we don't count visitors server-side), so a
 * bare lead count can only be read next to the impressions/clicks Google
 * reports. Significance lives in the Experiments page, which does have both.
 */
export function totals(stats: LandingStats[]) {
  return stats.reduce(
    (acc, s) => ({
      leads: acc.leads + s.leads,
      paidLeads: acc.paidLeads + s.paidLeads,
      qualified: acc.qualified + s.qualified,
      won: acc.won + s.won,
    }),
    { leads: 0, paidLeads: 0, qualified: 0, won: 0 },
  );
}

export const RANGES = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
  { days: 0, label: "All time" },
] as const;
