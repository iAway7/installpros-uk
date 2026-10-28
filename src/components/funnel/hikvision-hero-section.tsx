import { HeroHeadline } from "./hero-headline";
import { SecurityHeroTrustBar } from "./security-hero-trust-bar";
import { HikvisionHeroFunnel } from "./hikvision-hero-funnel";

/**
 * Hero for the Hikvision CCTV landing. A cut-down copy of
 * security-hero-section.tsx, which renders the live Ajax page.
 *
 * Changed from the Ajax hero: no drawn camera, rings or alert cards. That
 * decoration is an Ajax camera (security-hero-decor.tsx), and this page sells
 * a different one. Until there is a photograph the hero is the same dark
 * surface Ajax started from. The trust bar is the Ajax one, imported as it
 * is: Google, Trustpilot, UK-wide, DBS checked, none of it about the product.
 * "UK-wide installs" stays (Gus, 27 October), although two camera owners in
 * the chats were lost for want of an engineer near them.
 *
 * PHOTOGRAPH: a Gemini render of a Hikvision dome under a soffit at dusk,
 * logo visible (Gus, 28 October). A real install from Jordan (question 8)
 * replaces it. Without `image` the hero falls back to the dark surface.
 */
export function HikvisionHeroSection({
  image,
  imageSrcSet,
  imageMobile,
  imagePosition,
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
  /** Widths of `image`, for desktop. */
  imageSrcSet?: string;
  /** Phone crop of the same photograph (a srcset string is fine). */
  imageMobile?: string;
  /** object-position from md up, to move the camera clear of the text. */
  imagePosition?: string;
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
              <img src={image} srcSet={imageSrcSet} sizes={imageSrcSet ? "100vw" : undefined} alt="" aria-hidden="true" loading="eager" decoding="sync" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-top md:[object-position:var(--hero-pos,50%_0%)]" style={imagePosition ? ({ "--hero-pos": imagePosition } as React.CSSProperties) : undefined} />
            </picture>
            {/* The page's one dark, #0e1013 (Gus, 28 October), not the blue
                hero-overlay the other landings share. */}
            <div className="absolute inset-0 md:hidden" style={{ background: "linear-gradient(to bottom, rgba(14,16,19,0.6), rgba(14,16,19,0.7), rgba(0,0,0,0.85))" }} />
            {/* From md up the overlay thins over the camera, so the logo
                reads; the text never reaches that side. */}
            <div
              className="absolute inset-0 hidden md:block"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.6)), radial-gradient(26% 42% at 84% 44%, rgba(14,16,19,0.12) 0%, rgba(14,16,19,0.62) 100%)",
              }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(120% 70% at 50% 0%, #22262c 0%, #0e1013 48%, #050607 100%)" }}
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

        </div>
      </div>

      <SecurityHeroTrustBar />
    </section>
  );
}
