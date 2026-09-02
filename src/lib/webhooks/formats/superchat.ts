import type { WebhookPayload } from "../types";

/**
 * The flat payload Will's Superchat edge function expects
 * (POST .../functions/v1/superchat-webhook, routed on `event_type`).
 * Documented in their dashboard under "Superchat Integration > Leads Webhook".
 */
export interface SuperchatLeadPayload {
  event_type: "lead_received";
  /**
   * Superchat's own contact id (sc_contact_...). Our leads come from the web
   * form, so no Superchat contact exists yet. Sent as null until Will's
   * developer confirms how their function handles a lead with no contact.
   */
  contact_id: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  postcode: string;
  install_type: string;
  trigger_timestamp: string;
}

/**
 * Our `lead.service` values -> the label their router expects.
 * PENDING confirmation from Will's developer: their example is
 * "Sky Installation", so "Starlink Installation" is an educated guess, and
 * we don't know whether Marine / Commercial / Mobile should route differently.
 */
export const SUPERCHAT_INSTALL_TYPE: Record<string, string> = {
  residential: "Starlink Installation",
  marine: "Starlink Installation",
  commercial: "Starlink Installation",
  mobile_rv: "Starlink Installation",
};
const SUPERCHAT_INSTALL_TYPE_FALLBACK = "Starlink Installation";

/** "John Smith" -> ["John", "Smith"]; "Cher" -> ["Cher", ""]; "Mary Ann Lee" -> ["Mary", "Ann Lee"]. */
export function splitName(full: string): [string, string] {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return ["", ""];
  if (parts.length === 1) return [parts[0], ""];
  return [parts[0], parts.slice(1).join(" ")];
}

/**
 * Normalise a UK number to the "+44 7700 900123" form their example uses.
 * Accepts 07700900123, 447700900123, +447700900123, 00447700900123 and any
 * spacing/punctuation. Anything we can't confidently read is returned trimmed
 * and untouched rather than mangled.
 */
export function ukPhone(raw: string): string {
  const trimmed = raw.trim();
  let digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("0044")) digits = digits.slice(2);
  let national: string | null = null;
  if (digits.startsWith("44") && digits.length >= 12) national = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 11) national = digits.slice(1);
  else if (digits.length === 10) national = digits;
  if (!national) return trimmed;
  if (national.length === 10) return `+44 ${national.slice(0, 4)} ${national.slice(4)}`;
  return `+44 ${national}`;
}

export function toSuperchat(payload: WebhookPayload): SuperchatLeadPayload {
  const [first_name, last_name] = splitName(payload.lead.name);
  const service = (payload.lead.service ?? "").toLowerCase();
  return {
    event_type: "lead_received",
    contact_id: null,
    first_name,
    last_name,
    phone: ukPhone(payload.lead.phone),
    email: payload.lead.email,
    postcode: payload.lead.postcode,
    install_type: SUPERCHAT_INSTALL_TYPE[service] ?? SUPERCHAT_INSTALL_TYPE_FALLBACK,
    trigger_timestamp: new Date(payload.lead.created_at).toISOString(),
  };
}
