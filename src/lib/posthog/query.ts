/**
 * Server-side PostHog query client (HogQL over the /api/projects/:id/query
 * endpoint). Powers the in-dashboard Funnel page so the team doesn't have to
 * leave the dashboard for funnel/drop-off analysis.
 *
 * Env (server-only):
 *   POSTHOG_PERSONAL_API_KEY — personal API key with query:read scope
 *                              (PostHog → Settings → Personal API keys)
 *   POSTHOG_PROJECT_ID       — numeric project id (Settings → Project)
 *   NEXT_PUBLIC_POSTHOG_HOST — already set for tracking (eu.i.posthog.com)
 */

export interface HogQLResult {
  ok: boolean;
  configured: boolean;
  error?: string;
  results: unknown[][];
}

export function posthogConfigured(): boolean {
  return Boolean(process.env.POSTHOG_PERSONAL_API_KEY && process.env.POSTHOG_PROJECT_ID);
}

/** The API host differs from the ingest host: eu.i.posthog.com → eu.posthog.com */
function apiHost(): string {
  const h = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
  return h.replace("://eu.i.", "://eu.").replace("://us.i.", "://us.");
}

export async function hogql(query: string): Promise<HogQLResult> {
  if (!posthogConfigured()) return { ok: false, configured: false, results: [] };
  try {
    const res = await fetch(`${apiHost()}/api/projects/${process.env.POSTHOG_PROJECT_ID}/query/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.POSTHOG_PERSONAL_API_KEY}`,
      },
      body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, configured: true, error: `${res.status}: ${text.slice(0, 200)}`, results: [] };
    }
    const json = (await res.json()) as { results?: unknown[][] };
    return { ok: true, configured: true, results: json.results ?? [] };
  } catch (e) {
    return { ok: false, configured: true, error: e instanceof Error ? e.message : "query_failed", results: [] };
  }
}

// ── Funnel definitions ────────────────────────────────────────────────────

/** Ordered funnel steps: event + optional property filter + label. */
export const FUNNEL_STEPS: Array<{ label: string; event: string; where?: string }> = [
  { label: "Visited site", event: "page_view" },
  { label: "Checked coverage", event: "coverage_checked" },
  { label: "Started form", event: "quote_started" },
  { label: "Submitted form", event: "quote_submitted" },
  { label: "Lead created", event: "lead_created" },
  { label: "WhatsApp clicked", event: "whatsapp_clicked" },
];

export interface FunnelStepResult {
  label: string;
  users: number;
  /** Conversion from the previous step (1 for the first step). */
  stepConversion: number;
  /** Conversion from the first step. */
  totalConversion: number;
}

export interface SegmentFilter {
  device?: string; // mobile | tablet | desktop
  source?: string; // traffic_source
  /** Landing page path, e.g. "/install-quote". Required to read the A/B pair
   *  apart: without it the two variants are summed into one funnel and the
   *  experiment cannot be measured at all. */
  page?: string;
  days: number;
}

/** Landing pages worth funnelling separately: the A/B pair, plus each
 *  Ads segment landing. */
export const FUNNEL_PAGES = [
  "/install-quote",
  "/starlink-installation",
  "/commercial-starlink-installation",
] as const;

function segmentWhere(f: SegmentFilter): string {
  const parts = [`timestamp >= now() - interval ${Math.max(1, Math.min(365, f.days))} day`];
  if (f.device) parts.push(`properties.device_type = '${f.device.replace(/'/g, "")}'`);
  if (f.source) parts.push(`properties.traffic_source = '${f.source.replace(/'/g, "")}'`);
  if (f.page) parts.push(`properties.page_path = '${f.page.replace(/'/g, "")}'`);
  return parts.join(" AND ");
}

/** Unique users per funnel step (single HogQL round-trip). */
export async function fetchFunnel(f: SegmentFilter): Promise<{ steps: FunnelStepResult[]; ok: boolean; configured: boolean; error?: string }> {
  const where = segmentWhere(f);
  const selects = FUNNEL_STEPS.map(
    (s, i) => `count(DISTINCT if(event = '${s.event}'${s.where ? ` AND ${s.where}` : ""}, distinct_id, NULL)) AS step_${i}`,
  ).join(", ");
  const r = await hogql(`SELECT ${selects} FROM events WHERE ${where}`);
  if (!r.ok || !r.results.length) return { steps: [], ok: r.ok, configured: r.configured, error: r.error };

  const row = r.results[0] as number[];
  const first = Number(row[0]) || 0;
  const steps: FunnelStepResult[] = FUNNEL_STEPS.map((s, i) => {
    const users = Number(row[i]) || 0;
    const prev = i === 0 ? users : Number(row[i - 1]) || 0;
    return {
      label: s.label,
      users,
      stepConversion: i === 0 ? 1 : prev ? users / prev : 0,
      totalConversion: first ? users / first : 0,
    };
  });
  return { steps, ok: true, configured: true };
}

/** Same funnel for the preceding period, to flag >20% step drops. */
export async function fetchFunnelPrevious(f: SegmentFilter): Promise<number[]> {
  const days = Math.max(1, Math.min(365, f.days));
  const parts = [
    `timestamp >= now() - interval ${days * 2} day`,
    `timestamp < now() - interval ${days} day`,
  ];
  if (f.device) parts.push(`properties.device_type = '${f.device.replace(/'/g, "")}'`);
  if (f.source) parts.push(`properties.traffic_source = '${f.source.replace(/'/g, "")}'`);
  if (f.page) parts.push(`properties.page_path = '${f.page.replace(/'/g, "")}'`);
  const selects = FUNNEL_STEPS.map(
    (s, i) => `count(DISTINCT if(event = '${s.event}', distinct_id, NULL)) AS step_${i}`,
  ).join(", ");
  const r = await hogql(`SELECT ${selects} FROM events WHERE ${parts.join(" AND ")}`);
  if (!r.ok || !r.results.length) return [];
  return (r.results[0] as number[]).map((n) => Number(n) || 0);
}

/** Daily submit rate (quote_submitted / page_view users) for the drop-off trend. */
export async function fetchDailyRates(f: SegmentFilter): Promise<Array<{ day: string; visitors: number; submits: number }>> {
  const where = segmentWhere(f);
  const r = await hogql(
    `SELECT toDate(timestamp) AS day,
            count(DISTINCT if(event = 'page_view', distinct_id, NULL)) AS visitors,
            count(DISTINCT if(event = 'quote_submitted', distinct_id, NULL)) AS submits
     FROM events WHERE ${where}
     GROUP BY day ORDER BY day`,
  );
  if (!r.ok) return [];
  return (r.results as [string, number, number][]).map(([day, visitors, submits]) => ({
    day,
    visitors: Number(visitors) || 0,
    submits: Number(submits) || 0,
  }));
}

/** Distinct traffic sources seen recently (for the filter dropdown). */
export async function fetchSources(days: number): Promise<string[]> {
  const r = await hogql(
    `SELECT properties.traffic_source AS s, count() FROM events
     WHERE timestamp >= now() - interval ${Math.max(1, Math.min(365, days))} day AND notEmpty(properties.traffic_source)
     GROUP BY s ORDER BY count() DESC LIMIT 10`,
  );
  if (!r.ok) return [];
  return (r.results as [string, number][]).map(([s]) => String(s)).filter(Boolean);
}
