import { fetchVisitorCounts } from "@/lib/posthog/query";

/**
 * Landing-page conversion rate: leads created (Supabase, the ground truth for
 * submits) over unique landing-page visitors (PostHog). This is the number that
 * says whether the page itself got better, independent of how much traffic it
 * received. Both dashboards share it so they can never disagree.
 */

export const CONVERSION_WINDOW_DAYS = 28;
export const CONVERSION_WEEKS = 12;

const DAY = 864e5;
const WEEK = 7 * DAY;

export interface WeeklyRate {
  /** Monday (UTC) of the week, YYYY-MM-DD. */
  week: string;
  visitors: number;
  leads: number;
  /** 0–1, or null when there were no visitors. */
  rate: number | null;
}

export interface VisitorLeadRate {
  /** false when PostHog is not configured or the query failed; the UI shows "—". */
  ok: boolean;
  configured: boolean;
  error?: string;
  windowDays: number;
  leads: number;
  visitors: number;
  /** 0–1, or null when there were no visitors. */
  rate: number | null;
  previousRate: number | null;
  /** Change in percentage points vs the previous window, or null when either side is unknown. */
  deltaPoints: number | null;
  weekly: WeeklyRate[];
}

/** Monday 00:00 UTC of the week containing `t`, as a timestamp. */
function mondayUtc(t: number): number {
  const d = new Date(t);
  const dow = (d.getUTCDay() + 6) % 7; // Monday = 0
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - dow * DAY;
}

function isoDate(t: number): string {
  return new Date(t).toISOString().slice(0, 10);
}

/** Pure maths, split out so it can be tested without PostHog. */
export function combineVisitorLeadRate(
  leadCreatedAt: string[],
  counts: { current: number; previous: number; weekly: Array<{ week: string; visitors: number }> },
  now: number = Date.now(),
): Omit<VisitorLeadRate, "ok" | "configured" | "error"> {
  const ts = leadCreatedAt.map((s) => new Date(s).getTime()).filter((n) => Number.isFinite(n));
  const windowStart = now - CONVERSION_WINDOW_DAYS * DAY;
  const prevStart = now - CONVERSION_WINDOW_DAYS * 2 * DAY;

  const leads = ts.filter((t) => t >= windowStart).length;
  const prevLeads = ts.filter((t) => t >= prevStart && t < windowStart).length;

  const rate = counts.current ? leads / counts.current : null;
  const previousRate = counts.previous ? prevLeads / counts.previous : null;
  const deltaPoints = rate !== null && previousRate !== null ? (rate - previousRate) * 100 : null;

  // Weekly series: every week in the range, even ones PostHog returned no row for.
  const visitorsByWeek = new Map(counts.weekly.map((r) => [r.week, r.visitors]));
  const thisMonday = mondayUtc(now);
  const weekly: WeeklyRate[] = Array.from({ length: CONVERSION_WEEKS }, (_, i) => {
    const start = thisMonday - (CONVERSION_WEEKS - 1 - i) * WEEK;
    const week = isoDate(start);
    const visitors = visitorsByWeek.get(week) ?? 0;
    const wkLeads = ts.filter((t) => t >= start && t < start + WEEK).length;
    return { week, visitors, leads: wkLeads, rate: visitors ? wkLeads / visitors : null };
  });

  return { windowDays: CONVERSION_WINDOW_DAYS, leads, visitors: counts.current, rate, previousRate, deltaPoints, weekly };
}

/** Fetches PostHog visitor counts and blends them with the given lead timestamps. */
export async function getVisitorLeadRate(leadCreatedAt: string[]): Promise<VisitorLeadRate> {
  const counts = await fetchVisitorCounts(CONVERSION_WINDOW_DAYS, CONVERSION_WEEKS);
  const maths = combineVisitorLeadRate(leadCreatedAt, counts);
  if (!counts.ok) {
    return { ...maths, ok: false, configured: counts.configured, error: counts.error, rate: null, previousRate: null, deltaPoints: null, visitors: 0 };
  }
  return { ...maths, ok: true, configured: true };
}

export function fmtRate(rate: number | null): string {
  return rate === null ? "—" : `${(rate * 100).toFixed(1)}%`;
}

/** "▲ 0.8 pts vs prev. 28d" style caption, or null when there is nothing to compare. */
export function fmtDelta(deltaPoints: number | null, windowDays: number): { text: string; up: boolean } | null {
  if (deltaPoints === null) return null;
  const up = deltaPoints >= 0;
  return { text: `${up ? "▲" : "▼"} ${Math.abs(deltaPoints).toFixed(1)} pts vs prev. ${windowDays}d`, up };
}
