import { HeroHeadline } from "./hero-headline";
import { SecurityHeroTrustBar } from "./security-hero-trust-bar";
import { SecurityHeroInteractive, type PhotoSpots } from "./security-hero-camera";

/**
 * Hero for the Ajax alarm and CCTV landing.
 *
 * A copy of hero-section.tsx, cut down, rather than new props on it: that
 * file renders /install-quote, the page live in Google Ads, and the rule since
 * 29 September is to duplicate instead of reaching into it. The form and the
 * H1 are the funnel in security-hero-funnel.tsx (a copy, see there) and the
 * shared HeroHeadline, so the validation and the tracking are the ones the
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
  { image, imageMobile, imageSrcSet, imagePosition, photoSpots, headline, subheadline, badge, badgeNarrow, headlineConfigKey, defaultInstallType, formName }: {
    /** A REAL photograph of an Ajax install. Omit it for the dark surface. */
    image?: string;
    /** Phone crop of the same photograph (a srcset string is fine). */
    imageMobile?: string;
    /** Widths of the desktop photograph, e.g. "/a-1280.webp 1280w, ...". */
    imageSrcSet?: string;
    /** object-position for the desktop photograph (md and up; the phone crop
     *  is framed on its own), e.g. "34% 0%" to slide a subject sitting right
     *  of centre further right, out from under the copy. */
    imagePosition?: string;
    /** Where the photograph's camera sits, for the recording light and LIVE. */
    photoSpots?: PhotoSpots;
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
                <img src={image} srcSet={imageSrcSet} sizes={imageSrcSet ? "100vw" : undefined} alt="" aria-hidden="true" loading="eager" decoding="sync" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-top md:[object-position:var(--hero-pos,50%_0%)]" style={imagePosition ? ({ "--hero-pos": imagePosition } as React.CSSProperties) : undefined} />
              </picture>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={image} srcSet={imageSrcSet} sizes={imageSrcSet ? "100vw" : undefined} alt="" aria-hidden="true" loading="eager" decoding="sync" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-top md:[object-position:var(--hero-pos,50%_0%)]" style={imagePosition ? ({ "--hero-pos": imagePosition } as React.CSSProperties) : undefined} />
            )}
            {/* Phones: the shared overlay (globals.css, which the live pages
                use too, so it is not edited) and a darker layer over it. The
                camera sits behind the copy there, so it stays dark. */}
            <div className="hero-overlay absolute inset-0 md:hidden" />
            <div
              className="absolute inset-0 md:hidden"
              style={{
                background:
                  "radial-gradient(70% 60% at 50% 55%, rgba(5,8,12,0.55) 0%, rgba(5,8,12,0.25) 60%, transparent 100%), linear-gradient(to bottom, rgba(13,27,42,0.35), rgba(13,27,42,0.2) 45%, rgba(5,8,12,0.75) 100%)",
              }}
            />
            {/* md and up, Ajax's own overlay instead of the shared one. Gus,
                15 October: the camera lighter, the ceiling darker. So it is
                lightest on the camera and dark everywhere else; the camera's
                centre and size come from PhotoSpotsLayer as CSS variables,
                with a guess for before it runs. The top darkens under the
                header and the bottom fades into the trust bar. */}
            <div
              className="absolute inset-0 hidden md:block"
              style={{
                background:
                  "radial-gradient(var(--cam-rx, 30vw) var(--cam-ry, 42vh) at var(--cam-x, 72%) var(--cam-y, 50%), rgba(5,8,12,0.08) 0%, rgba(5,8,12,0.3) 55%, rgba(5,8,12,0.86) 100%), linear-gradient(to bottom, rgba(5,8,12,0.35), transparent 25%, transparent 70%, rgba(5,8,12,0.8))",
              }}
            />
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
          </>
        )}
      </div>

      <SecurityHeroInteractive
        photo={Boolean(image)}
        photoSpots={photoSpots}
        defaultInstallType={defaultInstallType}
        formName={formName}
        intro={
          <>
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

          </>
        }
      />

      <SecurityHeroTrustBar />
    </section>
  );
}
