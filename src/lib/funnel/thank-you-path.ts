/**
 * Where a lead goes after submitting.
 *
 * One page per segment rather than one shared page, which is the convention
 * for post-submit pages: each one has to deliver on the promise its own
 * landing made, and a residential visitor is being asked for roof photos while
 * a commercial one needs to be asked about the site. The names keep the
 * "thank-you-" prefix on purpose. It is what lets Analytics filter every
 * post-submit page as one group with a "starts with" rule while still
 * reporting them separately; naming them after the thing they ask for, like
 * /send-photos, reads better in isolation and loses that.
 *
 * The URL has nothing to do with the Google Ads conversion, which fires on the
 * `lead_created` dataLayer event at submit with lead_persisted true, not on a
 * pageview. Checked against the exported GTM container, 7 October. So these
 * can be renamed or split again without touching measurement.
 *
 * Unknown types fall back to /thank-you, which still exists. A redirect that
 * can only ever send someone to a page that is there is worth the one line,
 * and it covers anyone mid-flow across a deploy.
 */
const BY_INSTALL_TYPE: Record<string, string> = {
  residential: "/thank-you-residential",
};

export function thankYouPath(installType: string | undefined, leadId: string): string {
  const base = BY_INSTALL_TYPE[(installType ?? "").toLowerCase()] ?? "/thank-you";
  return `${base}?leadId=${encodeURIComponent(leadId)}`;
}
