/**
 * The one place the funnel's contact endpoints live.
 *
 * The WhatsApp number was previously copy-pasted as a local `WHATSAPP_URL`
 * const into main-header, slim-header and before-after-section. Those are left
 * alone for now; anything new should import from here so the next number change
 * is a one-line edit rather than a grep.
 */
export const WHATSAPP_NUMBER = "447446112343";
export const SUPPORT_EMAIL = "admin@installpros.co.uk";
export const SUPPORT_PHONE = "020 3397 7003";
export const SUPPORT_PHONE_HREF = "tel:02033977003";

/** Plain chat link, no prefilled text. Parity with the existing headers. */
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

/**
 * WhatsApp deep link with a prefilled message, so the customer lands in a
 * thread that already says who they are instead of an empty chat the engineer
 * then has to chase. An empty or whitespace-only message falls back to the
 * plain link rather than emitting a dangling `?text=`.
 */
export function whatsappUrl(message?: string): string {
  const trimmed = message?.trim();
  if (!trimmed) return WHATSAPP_URL;
  return `${WHATSAPP_URL}?text=${encodeURIComponent(trimmed)}`;
}

/** mailto: with prefilled subject and body, both URL-encoded. */
export function mailtoUrl(subject: string, body: string, to: string = SUPPORT_EMAIL): string {
  const params = new URLSearchParams({ subject, body });
  // URLSearchParams encodes spaces as "+", which mail clients show literally in
  // the subject line. Percent-encoding is what mailto: actually wants.
  return `mailto:${to}?${params.toString().replace(/\+/g, "%20")}`;
}

/**
 * The photo-request copy, in one place so the WhatsApp and email versions can
 * never drift apart. Every field is optional: a lead who cleared their session
 * still gets a valid link, just without the identifying detail.
 */
export function photoRequestMessage(lead: { name?: string; postcode?: string }): string {
  const details = [
    lead.postcode ? `postcode ${lead.postcode}` : null,
    lead.name ? `name ${lead.name}` : null,
  ].filter(Boolean);

  const opener = details.length
    ? `Hi InstallPros, I've just requested a Starlink quote (${details.join(", ")}).`
    : "Hi InstallPros, I've just requested a Starlink quote.";

  return `${opener} Here are photos of my property:`;
}
