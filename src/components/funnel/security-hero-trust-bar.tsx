import type { ReactNode } from "react";

/**
 * Trust bar for the Ajax landing. A copy of hero-trust-bar.tsx, not a variant
 * of it: that file renders on /install-quote, which is live in Google Ads and
 * is not touched for another page's sake.
 *
 * Two of the original five badges are gone, both because they are Starlink
 * claims on a page that does not sell Starlink:
 *   - "Authorised Starlink Installer", the Getmedigital badge.
 *   - "3,500+ UK installations", which counts Starlink installs. Nobody has
 *     given a figure for Ajax systems fitted, and putting the Starlink one
 *     here would read as alarms.
 * In their place, the one coverage claim the old Ajax page and Will's FAQ
 * both make: installs across the UK.
 *
 * "As featured in THE TIMES" went on 16 October: whatever that coverage was,
 * it is not about security and does no work here. Its slot says the engineers
 * are DBS checked and insured, which Jordan confirmed on 15 October and which
 * matters more to someone letting a stranger fit their alarm.
 *
 * Not an Ajax partner yet (Will, 13 October 2026, applying). When it comes
 * through, that badge goes in the last slot, where the Starlink one sat.
 */

/** Google "G" mark. */
function GoogleG({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

const BADGES: ReactNode[] = [
  <a
    key="google"
    href="https://maps.app.goo.gl/UvqYwqVrAV6R9T5m6"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Read our reviews on Google"
    className="flex items-center gap-2 transition-opacity hover:opacity-80"
  >
    <GoogleG size={20} />
    <span className="text-body font-semibold">5.0</span>
    <span className="text-body tracking-[2px] text-gold">★★★★★</span>
  </a>,
  <a
    key="trustpilot"
    href="https://uk.trustpilot.com/review/installpros.co.uk"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Read our reviews on Trustpilot"
    className="flex items-center gap-2 transition-opacity hover:opacity-80"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#00B67A" aria-hidden="true">
      <path d="M12 1.5l3.09 6.83 7.41.66-5.62 4.93 1.68 7.26L12 17.35l-6.56 3.83 1.68-7.26L1.5 8.99l7.41-.66L12 1.5z" />
    </svg>
    <span className="text-body text-white/70">
      <b className="text-white">Excellent</b> on Trustpilot
    </span>
  </a>,
  <div key="uk" className="flex items-center gap-2">
    <span className="text-body font-semibold">UK-wide</span>
    <span className="whitespace-nowrap text-body text-white/70">installs</span>
  </div>,
  <div key="dbs" className="flex items-center gap-2">
    <span className="text-body font-semibold">DBS checked</span>
    <span className="whitespace-nowrap text-body text-white/70">&amp; insured</span>
  </div>,
];

/** Same two layouts as the original: one row from sm, a marquee below it. */
export function SecurityHeroTrustBar() {
  return (
    <div className="relative z-10 w-full border-t border-white/10 bg-black/85 text-white backdrop-blur">
      <div className="hidden w-full flex-wrap items-center justify-center gap-y-3 px-5 py-4 sm:flex">
        {BADGES.map((badge, i) => (
          <div key={i} className={`flex items-center px-4 lg:px-6 ${i > 0 ? "border-l border-white/15" : ""}`}>
            {badge}
          </div>
        ))}
      </div>

      <div className="overflow-hidden py-4 sm:hidden">
        <div className="hero-marquee flex w-max items-center">
          {[...BADGES, ...BADGES].map((badge, i) => (
            <div key={i} className="flex shrink-0 items-center justify-center px-8" aria-hidden={i >= BADGES.length}>
              {badge}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
