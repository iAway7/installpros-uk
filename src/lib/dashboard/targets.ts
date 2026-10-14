import type { TargetCounts } from "@/lib/posthog/query";

/**
 * The funnel programme's baseline and targets, as fixed in the June 2026
 * audit ("Funnel Baseline & Targets", 1 Apr – 17 Jun, 78 days). Leads came
 * from Paperform, visitors and form starts from GA4. These are the numbers
 * the new landing page is measured against, so they are constants here, not
 * something recomputed from live data.
 */
export const BASELINE = {
  formStart: 0.332,
  completion: 0.323,
  visitorLead: 0.107,
  mobileVisitorLead: 0.18,
} as const;

export const TARGET = {
  formStart: 0.4,
  completion: 0.323, // "hold": the guardrail, not a lift
  visitorLead: 0.129,
  mobileVisitorLead: 0.21,
} as const;

/** A metric with no baseline simply has no row: better an absent line than a
 *  number nobody can defend. */
export interface Programme {
  formStart?: number;
  completion?: number;
  visitorLead?: number;
  mobileVisitorLead?: number;
}

/**
 * The commercial page's own baseline, which is a different page on a different
 * site with a different audience, so it does not get judged against the
 * residential one above.
 *
 * Source: the Paperform "INSTALLPROS - COMMERCIAL STARLINK" form on
 * installpros.co.uk/commercial-starlink-installation, and GA4 for the same
 * page. Window 21 July to 14 October 2026, every day the form was live. Gus
 * chose the full window rather than the two complete months: taking the best
 * stretch and calling it the rate is how a baseline becomes a story.
 *
 *   40 leads · 314 GA4 active users · 128 form starts · 526 Paperform viewers
 *
 * visitorLead is 40/314, the GA4 denominator, so it is built the same way as
 * the residential numbers above and the two can be read side by side.
 *
 * Two things are deliberately absent.
 *
 * formStart, because it would be 128/314 and those come from different tools
 * counting different populations: Paperform reports 526 people seeing the form
 * on a page GA4 says had 314 users, and nobody has explained the gap. A ratio
 * across that seam would be invented precision.
 *
 * mobileVisitorLead, because Paperform does not give the device split of those
 * 40 leads.
 *
 * KNOWN FLOOR. 40 counts only the leads through the commercial form. The page
 * also has four "Get a quote" buttons going to /contact-details/, a generic
 * form shared across the site with no record of which page sent each person,
 * so an unknown number of commercial leads are missing. The real rate is
 * higher than 12.7% and this page therefore understates what it has to beat,
 * which is the error in the comfortable direction. Fixed going forward by
 * tagging those links; the history does not come back.
 */
export const COMMERCIAL_BASELINE: Programme = {
  completion: 0.3125,
  visitorLead: 0.127,
};

/** Same rule the residential programme used: hold completion, lift the
 *  headline rate by a fifth. 12.7% to 15.2%. */
export const COMMERCIAL_TARGET: Programme = {
  completion: 0.3125,
  visitorLead: 0.152,
};

export const COMMERCIAL_PAGE = "/commercial-starlink-installation";

/** Which baseline a landing is measured against. */
export function programmeFor(page: string): { baseline: Programme; target: Programme } {
  return page === COMMERCIAL_PAGE
    ? { baseline: COMMERCIAL_BASELINE, target: COMMERCIAL_TARGET }
    : { baseline: BASELINE, target: TARGET };
}

/** First day the new landing received paid traffic. The default "since". */
export const LAUNCH_DATE = "2026-09-22";

/** Below this many visitors a rate is shown but not judged. */
const MIN_VISITORS = 30;

export type TargetStatus = "beaten" | "below" | "insufficient";

export interface TargetRow {
  metric: string;
  detail: string;
  baseline: number;
  target: number;
  /** null when it cannot be computed (no visitors, no starts). */
  actual: number | null;
  status: TargetStatus;
  /** For "hold" rows the target is a floor, which is what beaten means anyway. */
  hold?: boolean;
}

export interface DeviceRow {
  device: string;
  visitors: number;
  starts: number;
  leads: number;
  rate: number | null;
}

export interface TargetsReport {
  visitors: number;
  starts: number;
  leads: number;
  rows: TargetRow[];
  devices: DeviceRow[];
  whatsappAfterLead: number;
}

export interface LeadForTargets {
  device_type: string | null;
}

function status(actual: number | null, target: number, sample: number): TargetStatus {
  if (actual === null || sample < MIN_VISITORS) return "insufficient";
  return actual >= target ? "beaten" : "below";
}

/** Pure maths, so it can be checked without PostHog or Supabase. `leads`
 *  must already be filtered to the same landing, source and dates as
 *  `counts`, and have test submissions removed. */
export function buildTargetsReport(
  counts: Pick<TargetCounts, "byDevice" | "whatsappAfterLead">,
  leads: LeadForTargets[],
  page = "",
): TargetsReport {
  const { baseline, target } = programmeFor(page);
  const visitors = counts.byDevice.reduce((n, d) => n + d.visitors, 0);
  const starts = counts.byDevice.reduce((n, d) => n + d.starts, 0);
  const total = leads.length;

  const leadsByDevice = new Map<string, number>();
  for (const l of leads) {
    const d = l.device_type ?? "unknown";
    leadsByDevice.set(d, (leadsByDevice.get(d) ?? 0) + 1);
  }

  const ORDER = ["mobile", "desktop", "tablet"];
  const devices: DeviceRow[] = ORDER.filter((d) => counts.byDevice.some((c) => c.device === d) || leadsByDevice.has(d)).map((device) => {
    const c = counts.byDevice.find((x) => x.device === device);
    const v = c?.visitors ?? 0;
    const n = leadsByDevice.get(device) ?? 0;
    return { device, visitors: v, starts: c?.starts ?? 0, leads: n, rate: v ? n / v : null };
  });

  const formStart = visitors ? starts / visitors : null;
  const completion = starts ? total / starts : null;
  const visitorLead = visitors ? total / visitors : null;
  const mobile = devices.find((d) => d.device === "mobile");
  const mobileRate = mobile?.rate ?? null;

  // A metric the page has no baseline for does not get a row. The commercial
  // programme has two of the four; see COMMERCIAL_BASELINE for why.
  const defs = [
    { key: "formStart", metric: "Form-start rate", detail: "visitors who touch the first field", actual: formStart, sample: visitors },
    { key: "completion", metric: "Form completion", detail: "leads / form starts", actual: completion, sample: starts, hold: true },
    { key: "visitorLead", metric: "Visitor → lead", detail: "the headline number", actual: visitorLead, sample: visitors },
    { key: "mobileVisitorLead", metric: "Mobile visitor → lead", detail: "closing half the gap to desktop", actual: mobileRate, sample: mobile?.visitors ?? 0 },
  ] as const;

  const rows: TargetRow[] = defs.flatMap((d) => {
    const b = baseline[d.key];
    const t = target[d.key];
    if (b === undefined || t === undefined) return [];
    return [{
      metric: d.metric,
      detail: d.detail,
      baseline: b,
      target: t,
      actual: d.actual,
      status: status(d.actual, t, d.sample),
      ...("hold" in d ? { hold: d.hold } : {}),
    }];
  });

  return { visitors, starts, leads: total, rows, devices, whatsappAfterLead: counts.whatsappAfterLead };
}

export function pct(rate: number | null, digits = 1): string {
  return rate === null ? "—" : `${(rate * 100).toFixed(digits)}%`;
}
