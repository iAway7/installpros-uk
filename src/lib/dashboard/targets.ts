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
 * installpros.co.uk/commercial-starlink-installation. Window 21 July to
 * 14 October 2026, every day the form was live. Gus chose the full window over
 * the two complete months: taking the best stretch and calling it the rate is
 * how a baseline becomes a story.
 *
 *   526 viewers · 128 starts · 40 leads
 *
 * All three from Paperform, so the two ratios multiply out to the third and
 * nothing is divided across a seam between tools.
 *
 * This replaced a first version built on GA4's 314 active users for that page,
 * which gave 12.7% rather than 7.6%. GA4 looked like the cleaner denominator
 * because the residential baseline above is GA4-based, until the residential
 * Paperform figures arrived and settled it. For that funnel, 17 July to
 * 30 September: 26,966 viewers, 8,373 starts, 2,671 leads, which is 31.1% /
 * 31.9% / 9.9% against the audit's GA4-derived 33.2% / 32.3% / 10.7%. Two
 * tools, different windows, within two points on all three. Paperform's
 * viewer count is GA4's visitor count plus about 7%.
 *
 * Commercial's gap is 526 against 314, which is 67%, an order of magnitude
 * outside that. With residential as the control the likelier explanation is
 * that the GA4 figure is short rather than that Paperform is long: the page
 * filter matched paths containing "commercial", so any page hosting the same
 * form under another name was never counted. Until somebody confirms which
 * pages that form sits on, the number that at least agrees with itself is the
 * one from the single tool.
 *
 * mobileVisitorLead has no row: Paperform does not give the device split.
 *
 * KNOWN FLOOR. 40 counts only the leads through this form. The page also has
 * four "Get a quote" buttons going to /contact-details/, a generic form shared
 * across the site with no record of which page sent each person, so an unknown
 * number of commercial leads are missing. The real rate is higher than 7.6%
 * and this therefore understates what the new page has to beat, which is the
 * error in the comfortable direction. Fixed going forward by tagging those
 * links; the history does not come back.
 */
export const COMMERCIAL_BASELINE: Programme = {
  formStart: 0.243,
  completion: 0.3125,
  visitorLead: 0.076,
};

/** Same rule the residential programme used: hold completion, lift the other
 *  two by a fifth. */
export const COMMERCIAL_TARGET: Programme = {
  formStart: 0.292,
  completion: 0.3125,
  visitorLead: 0.091,
};

/**
 * The Ajax alarm and CCTV page's baseline, from the Paperform
 * "INSTALLPROS - SECURITY" form on the WordPress site it replaces.
 * 17 July to 30 September 2026.
 *
 *   2,236 viewers · 390 starts · 140 leads
 *
 * All three from Paperform, same as commercial, so the two ratios multiply
 * out to the third.
 *
 * Submissions ran at two to eight a day until roughly 19 August and then fell
 * to almost nothing. The viewer and start curves fall at the same point, so
 * the traffic stopped rather than the form, and the rate across the whole
 * window is unaffected. Worth re-checking if anyone ever finds that September
 * had viewers and no leads, because then the rate here is too low.
 *
 * This is the hardest of the three baselines to beat on completion and the
 * easiest on the other two: 35.9% of people who start this form finish it,
 * against 31.9% residential, but only 17.4% of viewers start at all, against
 * 31.1%. A smaller, more decided audience that the form then struggles to
 * get going.
 *
 * mobileVisitorLead has no row: Paperform does not give the device split.
 */
export const SECURITY_BASELINE: Programme = {
  formStart: 0.174,
  completion: 0.359,
  visitorLead: 0.063,
};

/** Same rule as the other two: hold completion, lift the others by a fifth. */
export const SECURITY_TARGET: Programme = {
  formStart: 0.209,
  completion: 0.359,
  visitorLead: 0.076,
};

/**
 * The vehicle page's baseline, from the Paperform vehicle form on the two
 * WordPress pages it replaces (installpros.co.uk/starlink-installation-for-cars
 * and /starlink-installation-for-campervan). 29 June to 7 October 2026, the
 * window Gus read off Paperform's analytics on 14 October.
 *
 *   Paperform shows 96 viewers · 12 starts · 8 submissions.
 *   Two of the eight are Will's own tests of 29 July (name "Will TESTING",
 *   registration "TEST"), so they come out of both counts:
 *   96 viewers · 10 starts · 6 leads.
 *
 * All three from Paperform, same as commercial and Ajax. The six include
 * one person who submitted twice three minutes apart on 19 September; the
 * new page would count that twice as well, so it stays.
 *
 * READ THE SAMPLE BEFORE THE RATE. Ninety-six viewers and six leads over a
 * hundred days: one lead either way moves visitorLead by a full point. This
 * is the smallest of the four baselines by an order of magnitude, and the
 * only one where the WordPress page was not getting paid traffic, so it is
 * an organic baseline measured against a paid page. It is here because a
 * floor with a known width beats no floor; do not read a beat or a miss of
 * a point as a result.
 *
 * mobileVisitorLead has no row: Paperform does not give the device split.
 */
export const VEHICLES_BASELINE: Programme = {
  formStart: 0.104,
  completion: 0.6,
  visitorLead: 0.0625,
};

/** Same rule as the other three: hold completion, lift the others by a fifth. */
export const VEHICLES_TARGET: Programme = {
  formStart: 0.125,
  completion: 0.6,
  visitorLead: 0.075,
};

export const SECURITY_PAGE = "/ajax-security-installation";

export const COMMERCIAL_PAGE = "/commercial-starlink-installation";

export const VEHICLES_PAGE = "/starlink-installation-for-vehicles";

/** The weather-hero variant of the vehicle page: same audience, same ads,
 *  same baseline. */
export const VEHICLES_VARIANT_PAGE = "/starlink-installation-for-vehicles-2";

/** Which baseline a landing is measured against. */
export function programmeFor(page: string): { baseline: Programme; target: Programme } {
  if (page === COMMERCIAL_PAGE) return { baseline: COMMERCIAL_BASELINE, target: COMMERCIAL_TARGET };
  if (page === SECURITY_PAGE) return { baseline: SECURITY_BASELINE, target: SECURITY_TARGET };
  if (page === VEHICLES_PAGE || page === VEHICLES_VARIANT_PAGE) return { baseline: VEHICLES_BASELINE, target: VEHICLES_TARGET };
  return { baseline: BASELINE, target: TARGET };
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
