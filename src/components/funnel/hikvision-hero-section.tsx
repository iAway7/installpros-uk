import { HeroHeadline } from "./hero-headline";
import { SecurityHeroTrustBar } from "./security-hero-trust-bar";
import { HikvisionHeroFunnel } from "./hikvision-hero-funnel";
import { Gap } from "./hikvision-gap";

/**
 * Hero for the Hikvision CCTV landing. A cut-down copy of
 * security-hero-section.tsx, which renders the live Ajax page.
 *
 * Changed from the Ajax hero: no drawn camera, rings or alert cards. That
 * decoration is an Ajax camera (security-hero-decor.tsx), and this page sells
 * a different one. Until there is a photograph the hero is the same navy
 * surface Ajax started from. The trust bar is the Ajax one, imported as it
 * is: Google, Trustpilot, DBS checked, UK, none of it about the product.
 *
 * PHOTOGRAPH: Jordan's question 8 (a real install), otherwise a generated
 * render with no Hikvision logo (hikvision-research/estructura-y-borrador.md,
 * Imágenes). Pass `image` and the photograph and overlay come back as on the
 * Ajax page.
 */
export function HikvisionHeroSection({
  image,
  imageMobile,
  headline,
  subheadline,
  subheadlineNarrow,
  badge,
  badgeNarrow,
  headlineConfigKey,
  defaultInstallType,
  formName,
}: {
  /** A REAL photograph of a Hikvision install, or the agreed render. */
  image?: string;
  /** Phone crop of the same photograph (a srcset string is fine). */
  imageMobile?: string;
  headline: string;
  subheadline: string;
  subheadlineNarrow?: string;
  badge: string;
  badgeNarrow?: string;
  headlineConfigKey: string;
  defaultInstallType: string;
  formName: string;
}) {
  return (
    <section className="relative flex min-h-[88svh] flex-col md:min-h-[100svh]">
      <div className="absolute inset-0 overflow-hidden">
        {image ? (
          <>
            <picture>
              {imageMobile && <source media="(max-width: 767px)" srcSet={imageMobile} />}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" aria-hidden="true" loading="eager" decoding="sync" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-top" />
            </picture>
            <div className="hero-overlay absolute inset-0" />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(120% 70% at 50% 0%, #1d3045 0%, #0d1b2a 48%, #05080c 100%)" }}
          />
        )}
      </div>

      <div className="relative z-20 flex flex-1 justify-center pt-28 pb-16 md:pt-36">
        <div className="container relative mx-auto my-auto text-center text-white">
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
            {subheadlineNarrow ? (
              <>
                <span className="md:hidden">{subheadlineNarrow}</span>
                <span className="hidden md:inline">{subheadline}</span>
              </>
            ) : (
              subheadline
            )}
          </p>

          <div className="animate-slide-up animate-delay-300 mx-auto w-full md:max-w-2xl">
            <HikvisionHeroFunnel defaultInstallType={defaultInstallType} skipServiceStep formName={formName} />
          </div>

          {!image && (
            <p className="mx-auto mt-8 max-w-md text-body-sm text-white/70">
              <Gap q="Q8" tone="dark">Hero photo: a real install, or a render with no logo.</Gap>
            </p>
          )}
        </div>
      </div>

      <SecurityHeroTrustBar />
    </section>
  );
}
