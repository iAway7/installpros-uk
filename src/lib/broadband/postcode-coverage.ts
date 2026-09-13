import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Ofcom Connected Nations fixed coverage for one postcode, read from our own
 * table (see 0014_ofcom_postcode_coverage.sql). No key, no quota, no external
 * call: the annual open-data release is loaded once with
 * scripts/load-ofcom-postcode-coverage.mjs.
 *
 * Ofcom publishes the distribution of premises across speed bands rather than
 * a single max speed. That is the shape kept here, because "82% of premises
 * can't get 30 Mbit/s" is both more truthful and more useful on a sales call
 * than an estimated maximum.
 */
export interface PostcodeCoverage {
  /** % of premises with 300 Mbit/s or more available */
  pct300plus: number | null;
  /** % with superfast (30 Mbit/s+) available */
  pctSfbb: number | null;
  pctGigabit: number | null;
  /** % that cannot reach the 10 Mbit/s universal service obligation */
  pctUnable10: number | null;
  /** % that cannot reach 30 Mbit/s: the headline "poor broadband" figure */
  pctUnable30: number | null;
  release: string;
}

export async function fetchPostcodeCoverage(
  supabase: SupabaseClient,
  pcCompact: string,
): Promise<PostcodeCoverage | null> {
  const { data } = await supabase
    .from("ofcom_postcode_coverage")
    .select("pct_300plus, pct_sfbb, pct_gigabit, pct_unable_10, pct_unable_30, release")
    .eq("postcode", pcCompact)
    .maybeSingle();
  if (!data) return null;
  return {
    pct300plus: data.pct_300plus,
    pctSfbb: data.pct_sfbb,
    pctGigabit: data.pct_gigabit,
    pctUnable10: data.pct_unable_10,
    pctUnable30: data.pct_unable_30,
    release: data.release,
  };
}

/**
 * One line for the lead card, in a narrow two-column grid: percentage first,
 * then the band, so it scans at a glance and fits on a single line. Leads with
 * whichever fact matters most to the person about to make the call rather than
 * listing every percentage.
 */
export function coverageHeadline(c: PostcodeCoverage | null): string | null {
  if (!c) return null;
  const { pctUnable10, pctUnable30, pct300plus, pctSfbb } = c;

  if (pctUnable10 != null && pctUnable10 >= 5) return `${pctUnable10}% below 10 Mbps`;
  if (pctUnable30 != null && pctUnable30 >= 20) return `${pctUnable30}% under 30 Mbps`;
  if (pct300plus != null && pct300plus >= 50) return `${pct300plus}% on 300+ Mbps`;
  if (pctUnable30 != null && pctUnable30 > 0) return `${pctUnable30}% under 30 Mbps`;
  if (pctSfbb != null) return `${pctSfbb}% superfast`;
  return null;
}
