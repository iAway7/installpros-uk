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
 * Consent and the address are read from their own columns. They used to be
 * parsed out of the free-text notes string, which was the only place they
 * existed until migration 0019 gave them real homes.
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

export function toZapier(payload: WebhookPayload): ZapierLeadPayload {
  const [first_name, last_name] = splitName(payload.lead.name);

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
    // Flattened to a boolean because Zapier filters on true/false, not on a
    // third state. Null means nobody was asked, and that is sent as false:
    // absence of a tick is not permission. The distinction is kept intact on
    // our side in leads.marketing_consent for anyone who has to evidence it.
    marketing_consent: payload.lead.marketing_consent === true,
    landing_page: payload.attribution.landing_page,
    source_url: payload.attribution.source_url,
    traffic_source: payload.attribution.traffic_source,
    utm_source: payload.attribution.utm_source,
    utm_medium: payload.attribution.utm_medium,
    utm_campaign: payload.attribution.utm_campaign,
    gclid: payload.attribution.gclid,
    device_type: payload.attribution.device_type,
  };

  if (payload.lead.address) out.address = payload.lead.address;
  return out;
}
