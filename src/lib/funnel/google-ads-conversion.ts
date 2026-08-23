/**
 * Fire the Google Ads conversion for a submitted lead, at most once per session.
 *
 * This used to live inline in the photo-upload step, which was the only page a
 * converted lead could land on. Now that the funnel can hand off to the
 * thank-you page instead, the call has to be reachable from both: whichever
 * page a lead reaches first records the conversion, and the sessionStorage flag
 * stops the second one recording it again.
 *
 * gtag arrives via GTM and may not be on the page yet when this runs, so it
 * polls for a few seconds rather than firing into a void. Returns a cleanup
 * function for the caller's effect, or undefined when there is nothing running
 * (no conversion label configured, already recorded, storage blocked).
 */
export function fireGoogleAdsConversion(): (() => void) | undefined {
  if (typeof window === "undefined") return;

  // Conversion target is env-driven ("AW-XXXXXXXXX/label"); skip if unset.
  const sendTo = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
  if (!sendTo) return;

  try {
    if (sessionStorage.getItem("googleAdsConversionTracked") === "1") return;
  } catch {
    // Storage blocked: firing anyway risks double-counting, so stay quiet.
    return;
  }

  let attempts = 0;
  const interval = setInterval(() => {
    attempts += 1;
    const w = window as unknown as { gtag?: (...a: unknown[]) => void };
    if (typeof w.gtag === "function") {
      w.gtag("event", "conversion", { send_to: sendTo, value: 1.0, currency: "GBP" });
      try {
        sessionStorage.setItem("googleAdsConversionTracked", "1");
      } catch {
        /* noop */
      }
      clearInterval(interval);
    } else if (attempts >= 10) {
      clearInterval(interval);
    }
  }, 500);

  return () => clearInterval(interval);
}
