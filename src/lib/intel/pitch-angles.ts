import type { LeadIntel } from "./types";

/**
 * Cross-sell hints derived from the enrichment — which service to lead with on
 * the call. Shared by the dashboard lead card and the outbound lead webhook so
 * both always say the same thing.
 */
export function pitchAngles(intel: Pick<
  LeadIntel,
  "max_download_mbps" | "actual_avg_download_mbps" | "crime_burglary" | "crime_total" | "energy_cost_annual"
> | null): string[] {
  if (!intel) return [];
  const angles: string[] = [];

  if (intel.max_download_mbps != null && intel.max_download_mbps < 30) {
    angles.push("Slow broadband — lead with Starlink");
  } else if (intel.actual_avg_download_mbps != null && intel.actual_avg_download_mbps < 25) {
    angles.push(`Residents actually get ~${intel.actual_avg_download_mbps} Mbps — lead with Starlink`);
  }

  if ((intel.crime_burglary ?? 0) >= 5 || (intel.crime_total ?? 0) >= 80) {
    angles.push(`${intel.crime_burglary ?? 0} burglaries nearby last month — pitch CCTV / security`);
  }

  if (intel.energy_cost_annual != null && intel.energy_cost_annual >= 1500) {
    angles.push(`~£${Math.round(Number(intel.energy_cost_annual))}/yr energy costs — pitch smart-home / automation`);
  }

  return angles;
}
