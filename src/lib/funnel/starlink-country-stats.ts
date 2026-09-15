/**
 * Starlink's own published network figures, per country, read off the public
 * availability map at starlink.com/map (the "network statistics" layer) and
 * typed in here by hand. There is no API for them and scraping the map is
 * against Starlink's terms, so this table is the source and it goes stale:
 * re-read the map and update the numbers every month or so.
 *
 * Why country level at all: 34 conversations in the Superchat corpus ask what
 * speed they would get and 29 whether it works where they are, and the honest
 * answer is that nobody has it per postcode. Starlink speed depends on the
 * satellite cell and how busy it is, not on the postcode, and it moves month
 * to month. A country range with Starlink's name on it is the most specific
 * true thing the page can say. It replaces the "247 Mbps" illustration in the
 * After panel once the visitor has run the speed test.
 *
 * The visitor's country comes from speed.cloudflare.com/meta, which the speed
 * test already calls: the top-level `country` there is the visitor's IP
 * geolocation. Not the test server (`colo`), which is wherever their ISP
 * happens to peer and can be abroad.
 *
 * Countries not in this table show nothing new: the panel keeps its
 * illustration rather than inventing a figure.
 *
 * Down speeds are Mbps, latency is ms, both as the min/max of the range the
 * map shows.
 */
export type StarlinkCountryStats = {
  name: string;
  downMin: number;
  downMax: number;
  latencyMin: number;
  latencyMax: number;
};

export const STARLINK_COUNTRY_STATS: Record<string, StarlinkCountryStats> = {
  // Read off the map on 13 September 2026 while testing from Spain.
  ES: { name: "Spain", downMin: 255, downMax: 366, latencyMin: 21, latencyMax: 27 },
  // TODO: fill from the map before this reaches UK traffic. The UK is one
  // entry on the map (England, Scotland, Wales and Northern Ireland share it);
  // the Republic of Ireland and the Crown dependencies are separate entries.
  // GB: { name: "United Kingdom", downMin: 0, downMax: 0, latencyMin: 0, latencyMax: 0 },
  // IE: { name: "Ireland", downMin: 0, downMax: 0, latencyMin: 0, latencyMax: 0 },
  // IM: { name: "Isle of Man", downMin: 0, downMax: 0, latencyMin: 0, latencyMax: 0 },
  // JE: { name: "Jersey", downMin: 0, downMax: 0, latencyMin: 0, latencyMax: 0 },
  // GG: { name: "Guernsey", downMin: 0, downMax: 0, latencyMin: 0, latencyMax: 0 },
};

export function getStarlinkCountryStats(countryCode: string | null | undefined): StarlinkCountryStats | null {
  if (!countryCode) return null;
  return STARLINK_COUNTRY_STATS[countryCode.toUpperCase()] ?? null;
}
