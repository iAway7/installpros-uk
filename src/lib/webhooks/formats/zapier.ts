import type { WebhookPayload } from "../types";
import { installTypeLabel, splitName, ukPhone } from "./superchat";

/**
 * Flat payload for a Zapier Catch Hook.
 *
 * Will is holding off on moving his team onto the new system and wants leads to
 * keep arriving in the Superchat flow he already trusts, via the Zapier Zap that
 * fans out on the address a lead is sent to. So this is not a second Superchat
 * format: it is the shape a non developer maps by hand in Zapier's field picker.
 *
 * Which drives every decision here:
 *   flat        Zapier shows nested objects as `attribution__utm_source`, so
 *               everything sits at the top level with a name that reads on its
 *               own.
 *   short       every field is either needed to contact the lead or to tie a
 *               sale back to a campaign. Score, property intel, pitch angles,
 *               dashboard links, session and experiment ids, fbclid, utm_term
 *               and utm_content are all left out: nobody mapping fields in
 *               Zapier would know what to do with them.
 *   stable      attribution fields are always present, null when unknown, so
 *               the mapping Will's team builds once does not break on the next
 *               lead. `address` is the one exception (see below).
 *
 * Pair it with lead.created only. There is no score in here, so lead.enriched
 * would deliver the same lead a second time and message the customer twice.
 */
export interface ZapierLeadPayload {
  lead_id: string;
  submitted_at: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  email: string;
  postcode: string;
  /** Only present when the visitor picked one, so the key can be absent. */
  address?: string;
  install_type: string;
  marketing_consent: boolean;
  landing_page: string | null;
  source_url: string | null;
  traffic_source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  gclid: string | null;
  device_type: string | null;
}

/**
 * Pull one labelled segment out of the funnel's notes string, which is written
 * as "Service: x | State: y | ZIP: z | Address: a | Consent: yes | Form: f".
 *
 * Consent has never had a column and the address only got one recently, so for
 * leads already in the table this string is the only place either value exists.
 * Google's formatted addresses carry commas but never a pipe, so splitting on
 * the pipe is safe. Returns null when the segment is absent, which covers the
 * postcode only funnel and the "Send test" payload, whose notes are prose.
 */
function fromNotes(notes: string | null, label: string): string | null {
  if (!notes) return null;
  for (const segment of notes.split("|")) {
    const trimmed = segment.trim();
    if (trimmed.toLowerCase().startsWith(`${label.toLowerCase()}:`)) {
      const value = trimmed.slice(label.length + 1).trim();
      return value || null;
    }
  }
  return null;
}

export function toZapier(payload: WebhookPayload): ZapierLeadPayload {
  const [first_name, last_name] = splitName(payload.lead.name);
  const address = fromNotes(payload.lead.notes, "Address");

  const out: ZapierLeadPayload = {
    lead_id: payload.lead.id,
    submitted_at: new Date(payload.lead.created_at).toISOString(),
    first_name,
    last_name,
    full_name: payload.lead.name,
    phone: ukPhone(payload.lead.phone),
    email: payload.lead.email,
    postcode: payload.lead.postcode,
    install_type: installTypeLabel(payload.lead.service),
    // Anything other than a recorded "yes" is treated as no consent. Absence of
    // a tick is not permission, and this value may end up deciding whether the
    // customer is marketed to.
    marketing_consent: fromNotes(payload.lead.notes, "Consent")?.toLowerCase() === "yes",
    landing_page: payload.attribution.landing_page,
    source_url: payload.attribution.source_url,
    traffic_source: payload.attribution.traffic_source,
    utm_source: payload.attribution.utm_source,
    utm_medium: payload.attribution.utm_medium,
    utm_campaign: payload.attribution.utm_campaign,
    gclid: payload.attribution.gclid,
    device_type: payload.attribution.device_type,
  };

  if (address) out.address = address;
  return out;
}
