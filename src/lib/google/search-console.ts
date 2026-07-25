import { getGoogleAccessToken, isGoogleConfigured } from "./auth";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

export interface ScRow {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchConsoleData {
  configured: boolean;
  ok: boolean;
  error?: string;
  site?: string;
  totals: { clicks: number; impressions: number; ctr: number; position: number };
  byDate: { date: string; clicks: number; impressions: number }[];
  topQueries: ScRow[];
  topPages: ScRow[];
}

const EMPTY: SearchConsoleData = {
  configured: false,
  ok: false,
  totals: { clicks: 0, impressions: 0, ctr: 0, position: 0 },
  byDate: [],
  topQueries: [],
  topPages: [],
};

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
}

async function query(
  site: string,
  token: string,
  body: Record<string, unknown>,
): Promise<{ rows?: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }[] }> {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error(`Search Console API ${res.status}`);
  return res.json();
}

/**
 * Pulls a Search Console summary for the last `days` days: headline totals, a
 * daily clicks/impressions series, and the top queries + pages.
 */
export async function getSearchConsole(days = 28): Promise<SearchConsoleData> {
  if (!isGoogleConfigured() || !process.env.GOOGLE_SEARCH_CONSOLE_SITE) return { ...EMPTY };

  const site = process.env.GOOGLE_SEARCH_CONSOLE_SITE;
  const token = await getGoogleAccessToken(SCOPE);
  if (!token) return { ...EMPTY, configured: true, error: "Could not authenticate the service account." };

  const startDate = isoDaysAgo(days);
  const endDate = isoDaysAgo(1);
  const base = { startDate, endDate };

  try {
    const [byDateRes, queryRes, pageRes] = await Promise.all([
      query(site, token, { ...base, dimensions: ["date"], rowLimit: days + 5 }),
      query(site, token, { ...base, dimensions: ["query"], rowLimit: 10 }),
      query(site, token, { ...base, dimensions: ["page"], rowLimit: 10 }),
    ]);

    const byDate = (byDateRes.rows ?? []).map((r) => ({
      date: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
    }));

    const totals = byDate.reduce(
      (acc, r) => {
        acc.clicks += r.clicks;
        acc.impressions += r.impressions;
        return acc;
      },
      { clicks: 0, impressions: 0 },
    );
    const positions = queryRes.rows ?? [];
    const avgPosition = positions.length
      ? positions.reduce((s, r) => s + r.position, 0) / positions.length
      : 0;

    const toRows = (rows: typeof positions): ScRow[] =>
      rows.map((r) => ({
        key: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      }));

    return {
      configured: true,
      ok: true,
      site,
      totals: {
        clicks: totals.clicks,
        impressions: totals.impressions,
        ctr: totals.impressions ? totals.clicks / totals.impressions : 0,
        position: avgPosition,
      },
      byDate,
      topQueries: toRows(queryRes.rows ?? []),
      topPages: toRows(pageRes.rows ?? []),
    };
  } catch (e) {
    return { ...EMPTY, configured: true, error: e instanceof Error ? e.message : "Request failed" };
  }
}
