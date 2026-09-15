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
  /** The server refused or failed to store a lead the visitor had completed. */
  LEAD_SUBMIT_FAILED: "lead_submit_failed",
  COVERAGE_CHECKED: "coverage_checked",
  SCROLL_DEPTH: "scroll_depth",
  VIDEO_PLAYED: "video_played",
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
  // "needs_house_number": the visitor picked a street in the address
  // autocomplete, which carries no postcode, so the funnel asked them to
  // pick a house number instead of letting the step pass. Watch this one:
  // if it is a large share of checks, blocking is costing more than asking
  // for the postcode by hand would.
  coverage_result?: "available" | "waitlist" | "invalid" | "needs_house_number";
  location_name?: string; // echoed place name — the US-funnel differentiator
  /** Which of the two forms on the page fired this: the hero checker or the
   *  one in the footer CTA. They are different components and only the hero
   *  used to report at all, so a low needs_house_number count could equally
   *  have meant "nobody gets stuck" or "we are blind to half the page".
   *  Pair it with form_name (which landing) to locate a drop-off exactly. */
  form_position?: "hero" | "footer";
  /** Where the postcode came from. "approximate" means the visitor picked a
   *  street, so it is the nearest unit to that street's coordinates rather
   *  than their own premise — area-level data is sound, house-level is not.
   *  The share of approximate vs exact is what says whether asking for a house
   *  number up front would be worth the friction. */
  postcode_precision?: "exact" | "approximate" | "none";
  // quote_* / lead_created
  install_type?: InstallType;
  lead_id?: string;
  value?: number;
  /** lead_created only. True when /api/lead actually stored the lead.
   *  False means the submit reached us but nothing was saved, so the id is a
   *  throwaway local_ uuid. Google Ads triggers on this: without it a backend
   *  outage would report conversions for leads that do not exist. */
  lead_persisted?: boolean;
  /** lead_submit_failed only. HTTP status /api/lead answered with (0 when the
   *  request never completed), plus its error code when it sent one. This is
   *  the only trace a refused lead leaves, so it is what tells us whether the
   *  postcode gate is rejecting real people or the backend is down. */
  failure_status?: number;
  failure_reason?: string;
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
  // video_played
  video_id?: string;
  video_location?: string;
  // quote_started — which of the two A/B first fields the visitor touched
  first_field?: "postcode" | "address";
}

export type InstallType = "residential" | "business" | "rural" | "marine" | "events";

export interface AnalyticsEvent extends EventContext, EventProperties {
  event: EventName;
  ts: string; // ISO timestamp
}
