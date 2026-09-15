import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Worst-served postcode districts, from our own copy of the Ofcom Connected
 * Nations open data (see 0017_ofcom_outcode_coverage.sql).
 *
 * Two things worth remembering before putting these numbers in front of anyone:
 *
 *  1. Ofcom measures AVAILABILITY, not speed. "36% can't get 10 Mbit/s" means
 *     36% of premises cannot order a 10 Mbit/s line at any price — it says
 *     nothing about what the people who can order one actually receive.
 *  2. The district figure is the plain mean of its postcodes, because Ofcom
 *     publishes percentages per postcode and no premises count to weight them
 *     by. A district of 800 postcodes is therefore far more trustworthy than
 *     one of 20, which is why `minPostcodes` exists — without it the list fills
 *     up with airports, industrial estates and single-farm postcodes.
 */
export interface OutcodeCoverage {
  outcode: string;
  postcodes: number;
  /** % of premises that cannot reach the 10 Mbit/s universal service obligation */
  pctUnable10: number | null;
  /** % that cannot reach 30 Mbit/s ("superfast") */
  pctUnable30: number | null;
  pctSfbb: number | null;
  pct300plus: number | null;
  release: string;
}

/** "202601" → "January 2026" — the release label Ofcom uses. */
export function releaseLabel(release: string | null | undefined): string {
  if (!release || release.length !== 6) return "Ofcom Connected Nations";
  const year = release.slice(0, 4);
  const month = Number(release.slice(4, 6));
  const names = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return names[month - 1] ? `${names[month - 1]} ${year}` : year;
}

export async function worstServedOutcodes(
  supabase: SupabaseClient,
  { limit = 12, minPostcodes = 150 }: { limit?: number; minPostcodes?: number } = {},
): Promise<OutcodeCoverage[]> {
  const { data } = await supabase
    .from("ofcom_outcode_coverage")
    .select("outcode, postcodes, pct_unable_10, pct_unable_30, pct_sfbb, pct_300plus, release")
    .gte("postcodes", minPostcodes)
    .order("pct_unable_10", { ascending: false })
    .order("pct_unable_30", { ascending: false })
    .limit(limit);

  return (data ?? []).map((r) => ({
    outcode: r.outcode as string,
    postcodes: r.postcodes as number,
    pctUnable10: r.pct_unable_10,
    pctUnable30: r.pct_unable_30,
    pctSfbb: r.pct_sfbb,
    pct300plus: r.pct_300plus,
    release: r.release as string,
  }));
}
