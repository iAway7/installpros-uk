"use client";

/**
 * Whether the visitor has agreed to analytics, according to CookieYes.
 *
 * CookieYes is delivered by GTM and governs GA4 and Google Ads through Google
 * Consent Mode, which is why those two already answer `gcs=G100` for a visitor
 * who declined. PostHog was the one thing it did not govern: our own code
 * loads it directly, so a visitor could untick Analytics, watch the panel save
 * the choice, and still be given a `ph_*` cookie and have every event recorded.
 * On a UK site running paid traffic that is the gap the banner exists to close.
 *
 * The cookie is the source of truth rather than any CookieYes global, because
 * it is present before their script finishes and survives a reload:
 *
 *   cookieyes-consent=consentid:...,consent:yes,action:yes,necessary:yes,
 *                     functional:no,analytics:yes,performance:no,...
 */

const COOKIE = "cookieyes-consent";

/** Both names CookieYes dispatches when the visitor saves a choice. */
const CONSENT_EVENTS = ["cookieyes_consent_update", "cookie_consent_update"];

/**
 * True only when Analytics is explicitly ticked.
 *
 * Absence is a no. A visitor who has never answered the banner has no cookie,
 * and silence is not agreement, so PostHog stays off until they actively
 * accept. That is the correct reading of consent and it is also the expensive
 * one: it means PostHog only ever sees people who clicked Accept.
 */
export function analyticsConsented(): boolean {
  if (typeof document === "undefined") return false;
  const raw = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE}=`));
  if (!raw) return false;
  return /(^|,)analytics:yes(,|$)/.test(decodeURIComponent(raw.slice(COOKIE.length + 1)));
}

/**
 * Run `fn` when the visitor changes their choice. Returns an unsubscribe.
 *
 * Listening on both document and window, for both event names, because which
 * one CookieYes uses is theirs to change and a missed event here means a
 * visitor accepts and nothing starts until they navigate.
 */
export function onConsentChange(fn: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const targets: EventTarget[] = [document, window];
  for (const target of targets) {
    for (const name of CONSENT_EVENTS) target.addEventListener(name, fn);
  }
  return () => {
    for (const target of targets) {
      for (const name of CONSENT_EVENTS) target.removeEventListener(name, fn);
    }
  };
}
