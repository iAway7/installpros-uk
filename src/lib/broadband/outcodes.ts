import raw from "./outcode-data.json";

/**
 * Ofcom Connected Nations (Jan 2025 release) fixed-coverage data, aggregated
 * from 1.73M postcodes to 2,853 postcode districts (outcodes). Static annual
 * data shipped as a repo asset — no API, no quota, no DB round-trip.
 * Regenerate from the "Fixed coverage - postcodes" ZIP on the Ofcom site.
 *
 * Per outcode: [postcode_count, sfbb_pct, gigabit_pct, unable_30_pct, below_uso_pct]
 */

const DATA = raw as unknown as Record<string, [number, number, number, number, number]>;

export interface OutcodeBroadband {
  outcode: string;
  postcodeCount: number;
  /** avg % premises with superfast (>=30 Mbit/s) available */
  sfbbPct: number;
  /** avg % premises with gigabit available */
  gigabitPct: number;
  /** avg % premises that CANNOT get 30 Mbit/s */
  unable30Pct: number;
  /** avg % premises below the Universal Service Obligation (10 Mbit/s) */
  belowUsoPct: number;
}

export function getOutcodeBroadband(outcode: string): OutcodeBroadband | null {
  const key = outcode.trim().toUpperCase();
  const row = DATA[key];
  if (!row) return null;
  const [postcodeCount, sfbbPct, gigabitPct, unable30Pct, belowUsoPct] = row;
  return { outcode: key, postcodeCount, sfbbPct, gigabitPct, unable30Pct, belowUsoPct };
}

/**
 * Worst-served districts — the Starlink cold-audience list. Filters out tiny
 * special-purpose outcodes (PO boxes, single buildings) via minPostcodes.
 */
export function worstServedOutcodes(limit = 25, minPostcodes = 30): OutcodeBroadband[] {
  return Object.entries(DATA)
    .filter(([, r]) => r[0] >= minPostcodes)
    .map(([outcode, r]) => ({
      outcode, postcodeCount: r[0], sfbbPct: r[1], gigabitPct: r[2], unable30Pct: r[3], belowUsoPct: r[4],
    }))
    .sort((a, b) => b.unable30Pct - a.unable30Pct || b.belowUsoPct - a.belowUsoPct)
    .slice(0, limit);
}
