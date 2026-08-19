import { track, identifyLead, getLeadAttribution, EVENTS } from "@/lib/analytics";
import { recordExperimentConversions } from "@/lib/experiments/client";

export interface LeadInput {
  zipCode: string;
  state: string;
  fullName: string;
  phone: string;
  email: string;
  installationType: string;
  source: string; // 'hero_funnel' | 'cta_section'
  address?: string; // full street address (address-autocomplete variant)
  marketingConsent?: boolean; // optional consent tick — recorded, never required
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Single lead-capture path shared by both multi-step forms. Persists via the
 * existing /api/lead route, fires the Google Ads/GA `lead_submission` event,
 * and records the standardized quote_submitted + lead_created analytics events.
 * Returns the lead id used to deep-link into the upload step.
 */
export async function submitLead(input: LeadInput): Promise<string> {
  track(EVENTS.QUOTE_SUBMITTED, { install_type: input.installationType as never });

  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: input.fullName,
      email: input.email,
      phone: input.phone,
      postcode: input.zipCode,
      install_type: "residential", // schema enum; real selection kept in notes
      service: input.installationType,
      notes: `Service: ${input.installationType} | State: ${input.state} | ZIP: ${input.zipCode}${input.address ? ` | Address: ${input.address}` : ""} | Consent: ${input.marketingConsent ? "yes" : "no"}`,
      meta: getLeadAttribution(),
    }),
  });

  let leadId = `local_${crypto.randomUUID()}`;
  if (res.ok) {
    const json = (await res.json()) as { lead_id?: string; persisted?: boolean };
    if (json.lead_id) leadId = json.lead_id;
    // Kick off property-intelligence enrichment — fire and forget.
    if (json.persisted) {
      fetch(`/api/leads/${json.lead_id}/enrich`, { method: "POST", keepalive: true }).catch(() => {});
      // Safety net for the lead.created webhook — /api/lead fires it too, and
      // the dispatch is idempotent, so at most one delivery reaches each
      // destination however many times this runs.
      fetch(`/api/leads/${json.lead_id}/notify`, { method: "POST", keepalive: true }).catch(() => {});
    }
  }

  // GA4 / Google Ads conversion signal (parity with original gtag hook)
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "lead_submission", {
      event_category: "conversion",
      event_label: `form_submission_${input.source}`,
      value: 1,
    });
  }

  identifyLead(leadId, { email: input.email, service: input.installationType });
  track(EVENTS.LEAD_CREATED, { install_type: input.installationType as never, lead_id: leadId });

  // Count this lead as a conversion for any active A/B experiment.
  recordExperimentConversions();

  // Persist contact context for the upload step (parity with original).
  try {
    sessionStorage.setItem(
      "quoteFormData",
      JSON.stringify({
        name: input.fullName,
        email: input.email,
        phone: input.phone,
        state: input.state,
        installationType: input.installationType,
        leadId,
      }),
    );
  } catch {
    /* storage blocked */
  }

  return leadId;
}
