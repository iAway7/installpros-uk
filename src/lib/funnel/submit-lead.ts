import { track, identifyLead, getLeadAttribution, EVENTS } from "@/lib/analytics";
import { toUkNationalDigits } from "@/lib/funnel/validation";
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
  // Store one shape, not whatever the customer typed. The field accepts
  // "07700 900123", "+44 7700 900123" and "07700900123", which all used to
  // reach the CRM verbatim and land there as three different-looking numbers.
  // The fallback keeps the raw string if normalising ever fails, because
  // losing a lead's phone number is worse than storing an untidy one.
  const phone = toUkNationalDigits(input.phone) || input.phone;

  track(EVENTS.QUOTE_SUBMITTED, { install_type: input.installationType as never });

  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: input.fullName,
      email: input.email,
      phone,
      postcode: input.zipCode,
      install_type: "residential", // schema enum; real selection kept in notes
      service: input.installationType,
      notes: `Service: ${input.installationType} | State: ${input.state} | ZIP: ${input.zipCode}${input.address ? ` | Address: ${input.address}` : ""} | Consent: ${input.marketingConsent ? "yes" : "no"}`,
      meta: getLeadAttribution(),
    }),
  });

  let leadId = `local_${crypto.randomUUID()}`;
  // Whether the lead actually landed in the database. The fallback id above
  // keeps the UI moving when it did not, but nothing downstream should treat
  // that as a real lead.
  let leadPersisted = false;
  if (res.ok) {
    const json = (await res.json()) as { lead_id?: string; persisted?: boolean };
    if (json.lead_id) leadId = json.lead_id;
    leadPersisted = json.persisted === true;
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
  track(EVENTS.LEAD_CREATED, {
    install_type: input.installationType as never,
    lead_id: leadId,
    lead_persisted: leadPersisted,
  });

  // Count this lead as a conversion for any active A/B experiment.
  recordExperimentConversions();

  // Persist contact context for the upload step (parity with original).
  try {
    sessionStorage.setItem(
      "quoteFormData",
      JSON.stringify({
        name: input.fullName,
        email: input.email,
        phone,
        postcode: input.zipCode,
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
