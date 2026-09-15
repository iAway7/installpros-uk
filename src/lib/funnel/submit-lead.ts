import { track, identifyLead, getLeadAttribution, EVENTS } from "@/lib/analytics";
import { toUkNationalDigits } from "@/lib/funnel/validation";
import { readSectorInterest } from "@/lib/funnel/sector-interest";
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
  /** "approximate" when the postcode came from the coordinates of a street the
   *  visitor picked rather than from their own premise. It reaches the notes so
   *  whoever works the lead knows the property intel describes the right area
   *  but not guaranteed the right house — and knows to ask for the number. */
  postcodePrecision?: "exact" | "approximate" | "none";
  /** Which landing page's form this is, e.g. "starlink_commercial". Will asked
   *  for each landing's form to be identifiable on its own, so a lead can be
   *  traced to the page that produced it rather than to "the funnel". `source`
   *  already says which of the two forms on the page it was; this says which
   *  page. Both are needed: the hero form on the commercial landing and the
   *  hero form on the residential one are the same component. */
  formName?: string;
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

  // Set only if they arrived at the form through a sector card. Appended to the
  // notes rather than given a column, because the lead schema is shared with
  // the residential funnel and this is commercial-only for now.
  const sector = readSectorInterest();

  track(EVENTS.QUOTE_SUBMITTED, { install_type: input.installationType as never, form_name: input.formName });

  // A dropped connection throws before there is any response to inspect. The
  // forms already catch it, but it would otherwise leave no trace at all, and
  // "the network failed" and "the server said no" need telling apart when we
  // come to read these numbers.
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
      notes: `Service: ${input.installationType} | State: ${input.state} | ZIP: ${input.zipCode}${input.address ? ` | Address: ${input.address}` : ""} | Consent: ${input.marketingConsent ? "yes" : "no"}${sector ? ` | Sector: ${sector}` : ""}${input.formName ? ` | Form: ${input.formName}` : ""}${input.postcodePrecision === "approximate" ? " | Postcode: APPROXIMATE (street-level — confirm house number)" : ""}`,
      meta: getLeadAttribution(),
    }),
  }).catch((e) => {
    track(EVENTS.LEAD_SUBMIT_FAILED, {
      form_name: input.formName,
      failure_status: 0,
      failure_reason: "network_error",
    });
    throw e;
  });

  // A refusal from the server has to stop this function.
  //
  // It used to fall straight through: on a non-OK response we kept the
  // throwaway local_ id and carried on, which meant the visitor got the success
  // toast and /thank-you, Google Ads was told a lead existed, and the A/B test
  // counted a conversion — for a lead nobody had stored and no one would ever
  // call. Silent, and worst of all invisible: no row, no alert, nothing to
  // notice. A backend outage looked exactly like a good day.
  //
  // Throwing hands control to the `catch` both forms already have, so the
  // visitor is told to try again with their details still on screen. Nothing
  // below this line runs, which is the point: no conversion is reported for a
  // lead that does not exist.
  if (!res.ok) {
    const reason = await res
      .json()
      .then((j: { error?: string }) => j?.error ?? null)
      .catch(() => null);
    track(EVENTS.LEAD_SUBMIT_FAILED, {
      form_name: input.formName,
      failure_status: res.status,
      failure_reason: reason ?? `http_${res.status}`,
    });
    throw new Error(`lead_submit_failed:${res.status}:${reason ?? "unknown"}`);
  }

  let leadId = `local_${crypto.randomUUID()}`;
  // Whether the lead actually landed in the database. Supabase being absent is
  // the one non-persisted case that is still a success: local/dev has no
  // backend, and the funnel has to stay walkable.
  let leadPersisted = false;
  {
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
      // event_label is deliberately unchanged. The Google Ads conversion action
      // keys off the event name, but the label is what the existing reports
      // segment on, and rewriting it would break the history. The landing page
      // goes in its own parameter instead.
      event_label: `form_submission_${input.source}`,
      form_name: input.formName,
      value: 1,
    });
  }

  identifyLead(leadId, { email: input.email, service: input.installationType });
  track(EVENTS.LEAD_CREATED, {
    install_type: input.installationType as never,
    form_name: input.formName,
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
