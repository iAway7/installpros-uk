/**
 * ───────────────────────────────────────────────────────────────────────────
 * STANDARDIZED EVENT TAXONOMY
 * ───────────────────────────────────────────────────────────────────────────
 * Single source of truth for every analytics event fired across the platform.
 * The SAME event object is dispatched to GA4 (via GTM dataLayer) AND PostHog,
 * so reporting is consistent between Phase 3 (acquisition) and Phase 4 (product).
 *
 * Naming convention: snake_case, verb_noun, past tense for actions.
 * This deliberately fixes the audit finding of mixed snake_case / PascalCase
 * and the ambiguous `quote_form_lead` vs `contact_page_form_lead` events.
 */

export const EVENTS = {
  PAGE_VIEW: "page_view",
  CTA_CLICKED: "cta_clicked",
  QUOTE_STARTED: "quote_started",
  FORM_STEP_VIEWED: "form_step_viewed",
  QUOTE_SUBMITTED: "quote_submitted",
  WHATSAPP_CLICKED: "whatsapp_clicked",
  EMAIL_CLICKED: "email_clicked",
  PHONE_CLICKED: "phone_clicked",
  LEAD_CREATED: "lead_created",
  COVERAGE_CHECKED: "coverage_checked",
  SCROLL_DEPTH: "scroll_depth",
  EXPERIMENT_VIEWED: "experiment_viewed",
  EXPERIMENT_CONVERTED: "experiment_converted",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

export type DeviceType = "mobile" | "tablet" | "desktop";

/** Conversion-grade events — flag these as conversions in GA4 / PostHog. */
export const CONVERSION_EVENTS: EventName[] = [
  EVENTS.QUOTE_SUBMITTED,
  EVENTS.LEAD_CREATED,
  EVENTS.WHATSAPP_CLICKED,
  EVENTS.EXPERIMENT_CONVERTED,
];

/**
 * Context attached to EVERY event. Required by the analytics architecture spec.
 * Captured once per page load and merged into each event payload.
 */
export interface EventContext {
  page_url: string;
  page_path: string;
  page_title: string;
  device_type: DeviceType;
  traffic_source: string; // utm_source || referrer host || "direct"
  campaign: string | null; // utm_campaign
  medium: string | null; // utm_medium
  variant_id: string | null; // active A/B variant (Phase 5)
  experiment_id: string | null; // active experiment (Phase 5)
}

/** Event-specific properties layered on top of the shared context. */
export interface EventProperties {
  // cta_clicked
  cta_id?: string;
  cta_label?: string;
  cta_location?: string; // hero | sticky | final_cta | header | benefits
  // coverage_checked
  postcode?: string;
  coverage_result?: "available" | "waitlist" | "invalid";
  location_name?: string; // echoed place name — the US-funnel differentiator
  // quote_* / lead_created
  install_type?: InstallType;
  lead_id?: string;
  value?: number;
  // form_step_viewed (per-step funnel drop-off)
  step_number?: number;
  step_name?: string;
  form_name?: string;
  // contact intents
  channel?: "whatsapp" | "email" | "phone";
  // scroll_depth
  percent?: 25 | 50 | 75 | 90 | 100;
  // experiment_*
  flag_key?: string;
}

export type InstallType = "residential" | "business" | "rural" | "marine" | "events";

export interface AnalyticsEvent extends EventContext, EventProperties {
  event: EventName;
  ts: string; // ISO timestamp
}
