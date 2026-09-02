import type { WebhookPayload } from "../types";

/**
 * The flat payload Will's Superchat edge function expects
 * (POST .../functions/v1/superchat-webhook, routed on `event_type`).
 * Documented in their dashboard under "Superchat Integration > Leads Webhook".
 */
export interface SuperchatLeadPayload {
  event_type: "lead_received";
  /**
   * Unique id for the lead. Will's developer (2 Sep 2026): web leads have no
   * Superchat contact, so send our own unique id instead; it lets their side
   * update the same record if a lead arrives twice ("partial completion").
   * Currently our lead UUID; CONTACT_ID_PREFIX is there for when they confirm
   * the format they want.
   */
  contact_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  postcode: string;
  install_type: string;
  trigger_timestamp: string;
}

/** Prepended to our lead UUID. Empty until Will's developer sends the id format. */
export const CONTACT_ID_PREFIX = "";

/**
 * Our `lead.service` values -> what goes in their `install_type`.
 * Will's developer confirmed (2 Sep 2026) it is a free-text field, so we keep
 * the distinction instead of collapsing everything to one label.
 */
export const SUPERCHAT_INSTALL_TYPE: Record<string, string> = {
  residential: "Starlink Residential",
  marine: "Starlink Marine",
  commercial: "Starlink Commercial",
  mobile_rv: "Starlink Mobile/RV",
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
    contact_id: `${CONTACT_ID_PREFIX}${payload.lead.id}`,
    first_name,
    last_name,
    phone: ukPhone(payload.lead.phone),
    email: payload.lead.email,
    postcode: payload.lead.postcode,
    install_type: SUPERCHAT_INSTALL_TYPE[service] ?? SUPERCHAT_INSTALL_TYPE_FALLBACK,
    trigger_timestamp: new Date(payload.lead.created_at).toISOString(),
  };
}
