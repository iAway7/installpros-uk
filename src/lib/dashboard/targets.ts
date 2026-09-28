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
export function buildTargetsReport(counts: Pick<TargetCounts, "byDevice" | "whatsappAfterLead">, leads: LeadForTargets[]): TargetsReport {
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

  const rows: TargetRow[] = [
    {
      metric: "Form-start rate",
      detail: "visitors who touch the first field",
      baseline: BASELINE.formStart,
      target: TARGET.formStart,
      actual: formStart,
      status: status(formStart, TARGET.formStart, visitors),
    },
    {
      metric: "Form completion",
      detail: "leads / form starts",
      baseline: BASELINE.completion,
      target: TARGET.completion,
      actual: completion,
      status: status(completion, TARGET.completion, starts),
      hold: true,
    },
    {
      metric: "Visitor → lead",
      detail: "the headline number",
      baseline: BASELINE.visitorLead,
      target: TARGET.visitorLead,
      actual: visitorLead,
      status: status(visitorLead, TARGET.visitorLead, visitors),
    },
    {
      metric: "Mobile visitor → lead",
      detail: "closing half the gap to desktop",
      baseline: BASELINE.mobileVisitorLead,
      target: TARGET.mobileVisitorLead,
      actual: mobileRate,
      status: status(mobileRate, TARGET.mobileVisitorLead, mobile?.visitors ?? 0),
    },
  ];

  return { visitors, starts, leads: total, rows, devices, whatsappAfterLead: counts.whatsappAfterLead };
}

export function pct(rate: number | null, digits = 1): string {
  return rate === null ? "—" : `${(rate * 100).toFixed(digits)}%`;
}
