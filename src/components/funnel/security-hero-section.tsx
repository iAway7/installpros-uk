import { ZipAvailabilityChecker } from "./zip-availability-checker";
import { HeroHeadline } from "./hero-headline";
import { SecurityHeroTrustBar } from "./security-hero-trust-bar";

/**
 * Hero for the Ajax alarm and CCTV landing.
 *
 * A copy of hero-section.tsx, cut down, rather than new props on it: that
 * file renders /install-quote, the page live in Google Ads, and the rule since
 * 29 September is to duplicate instead of reaching into it. The form and the
 * H1 are still the shared ZipAvailabilityChecker and HeroHeadline, used as
 * they are, so the funnel, its validation and its tracking are the ones the
 * converting page runs on.
 *
 * What changed from the original:
 *   - NO PHOTOGRAPH BY DEFAULT. There is no picture of an Ajax system we
 *     fitted, and the pages are built on every photograph being ours (see
 *     process-steps-section.tsx). Rather than a stock hallway with a keypad,
 *     the hero is a dark surface with a faint set of rings behind the form, a
 *     sensor's field rather than a satellite's. `image` is still here for
 *     the day Will sends real install photos (question 4); pass it and the
 *     photograph and the overlay come back exactly as on the other pages.
 *   - Its own trust bar, without the Starlink badges.
 *   - No flag on the badge: it does not talk about coverage.
 */
export function SecurityHeroSection(
  { image, imageMobile, headline, subheadline, badge, badgeNarrow, headlineConfigKey, defaultInstallType, formName }: {
    /** A REAL photograph of an Ajax install. Omit it for the dark surface. */
    image?: string;
    /** Phone crop of the same photograph. */
    imageMobile?: string;
    headline: string;
    subheadline: string;
    badge: string;
    badgeNarrow?: string;
    headlineConfigKey: string;
    defaultInstallType: string;
    formName: string;
  },
) {
  return (
    <section className="relative flex min-h-[88svh] flex-col md:min-h-[100svh]">
      <div className="absolute inset-0 overflow-hidden">
        {image ? (
          <>
            {imageMobile ? (
              <picture>
                <source media="(max-width: 767px)" srcSet={imageMobile} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="" aria-hidden="true" loading="eager" decoding="sync" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-top" />
              </picture>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={image} alt="" aria-hidden="true" loading="eager" decoding="sync" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-top" />
            )}
            <div className="hero-overlay absolute inset-0" />
          </>
        ) : (
          <>
            {/* The overlay's own navy, lit from above the headline, so the
                page still sits with the others when someone arrives from a
                Starlink one. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 70% at 50% 0%, #1d3045 0%, #0d1b2a 48%, #05080c 100%)",
              }}
            />
            {/* Rings centred on the form, not the headline: the eye should end
                up on the field. Decorative, and faint enough that the white
                text never sits on anything but dark. */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[62%] h-[1400px] w-[1400px] -translate-x-1/2 -translate-y-1/2 md:top-[64%]"
              viewBox="0 0 1400 1400"
              fill="none"
            >
              {[140, 260, 380, 500, 620, 700].map((r, i) => (
                <circle key={r} cx="700" cy="700" r={r} stroke="white" strokeOpacity={0.07 - i * 0.009} strokeWidth="1" />
              ))}
            </svg>
          </>
        )}
      </div>

      <div className="relative z-20 flex flex-1 justify-center pt-28 pb-16 md:pt-36">
        <div className="container mx-auto my-auto text-center text-white">
          <div className="animate-slide-up mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 md:mb-8">
            <span className="text-body-sm font-medium tracking-wide text-white/95">
              {badgeNarrow ? (
                <>
                  <span className="md:hidden">{badgeNarrow}</span>
                  <span className="hidden md:inline">{badge}</span>
                </>
              ) : (
                badge
              )}
            </span>
          </div>

          <HeroHeadline headline={headline} configKey={headlineConfigKey} />

          <p className="animate-slide-up animate-delay-200 mx-auto mb-8 max-w-3xl text-balance text-lg text-white/95 md:mb-10 md:text-xl lg:mb-12 lg:text-2xl">
            {subheadline}
          </p>

          <div className="animate-slide-up animate-delay-300 mx-auto w-full md:max-w-2xl">
            <ZipAvailabilityChecker defaultInstallType={defaultInstallType} skipServiceStep formName={formName} />
          </div>
        </div>
      </div>

      <SecurityHeroTrustBar />
    </section>
  );
}
