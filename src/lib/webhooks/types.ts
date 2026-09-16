/** The two moments a lead is worth forwarding. */
export type WebhookEvent = "lead.created" | "lead.enriched";

export const WEBHOOK_EVENTS: WebhookEvent[] = ["lead.created", "lead.enriched"];

export const EVENT_LABEL: Record<WebhookEvent, string> = {
  "lead.created": "Lead created: instantly at submit (contact + attribution)",
  "lead.enriched": "Lead enriched: ~4s later, adds score + property intel",
};

/**
 * How the body is shaped for a given endpoint.
 *   generic   — our native nested payload (WebhookPayload below).
 *   superchat — the flat lead_received shape Will's Superchat function expects.
 *   zapier:     flat and plain named, for a Zapier Catch Hook feeding Will's
 *               existing Superchat Zap. Contact details plus the attribution a
 *               sale can be traced back with, and nothing a non developer
 *               mapping fields in Zapier would have to ask about.
 */
export type WebhookFormat = "generic" | "superchat" | "zapier";

export const WEBHOOK_FORMATS: WebhookFormat[] = ["generic", "superchat", "zapier"];

/**
 * A usable webhook destination. Shared by create and update so the two cannot
 * drift: the update path used to call bare `new URL()`, which happily accepts
 * file:, data: and gopher: URLs that have no business being a destination.
 */
export function isWebhookUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export const FORMAT_LABEL: Record<WebhookFormat, string> = {
  generic: "Generic JSON: full lead, attribution, score and property intel (Make, n8n, custom)",
  superchat: "Superchat (Will): flat lead_received payload, contact fields only",
  zapier: "Zapier Catch Hook: flat contact + attribution fields, ready to map by hand",
};

export interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  secret: string | null;
  events: WebhookEvent[];
  format: WebhookFormat;
  headers: Record<string, string>;
  active: boolean;
  created_at: string;
  last_delivery_at: string | null;
  last_status: string | null;
}

export interface WebhookDelivery {
  id: string;
  endpoint_id: string | null;
  endpoint_url: string;
  event: string;
  lead_id: string | null;
  payload: unknown;
  status: "success" | "failed";
  status_code: number | null;
  attempts: number;
  error: string | null;
  duration_ms: number | null;
  created_at: string;
}

/** What we POST to the receiver. Nested, but Zapier/Make flatten it fine. */
export interface WebhookPayload {
  event: WebhookEvent | "webhook.test";
  sent_at: string;
  lead: {
    id: string;
    created_at: string;
    name: string;
    email: string;
    phone: string;
    postcode: string;
    service: string | null;
    install_type: string | null;
    address: string | null;
    town: string | null;
    /** True ticked, false asked and declined, null never asked. */
    marketing_consent: boolean | null;
    /** exact | approximate | none. See leads.postcode_precision. */
    postcode_precision: string | null;
    sector: string | null;
    form_name: string | null;
    notes: string | null;
    status: string | null;
    /** 1-10. Null on lead.created — enrichment hasn't run yet. */
    score: number | null;
  };
  attribution: {
    landing_page: string | null;
    traffic_source: string | null;
    campaign: string | null;
    device_type: string | null;
    source_url: string | null;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_term: string | null;
    utm_content: string | null;
    gclid: string | null;
    fbclid: string | null;
    session_id: string | null;
    variant_id: string | null;
    experiment_id: string | null;
  };
  /** Null until enrichment has run (i.e. always null on lead.created). */
  intel: Record<string, unknown> | null;
  pitch_angles: string[];
  links: { dashboard: string };
}
