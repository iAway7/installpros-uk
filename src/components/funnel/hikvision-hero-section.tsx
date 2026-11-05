import { HeroHeadline } from "./hero-headline";
import { SecurityHeroTrustBar } from "./security-hero-trust-bar";
import { HikvisionHeroFunnel } from "./hikvision-hero-funnel";

/** Last in the trust bar, where the Starlink pages carry "Authorised Starlink
 *  Installer". Jordan, 5 November: "we are already Hikvision partners"; the
 *  company is authenticated on Hik-Partner Pro (Partner No. HIK10840194333),
 *  which Hikvision's own docs call an authenticated channel partner.
 *
 *  The plain Hikvision wordmark (Gus's file, 5 November) and our own word
 *  "partner". Not the "CERTIFIED PARTNER" lockup he also found, and not a
 *  VASP badge: no certificate or VASP tier (Authorised, Silver, Gold,
 *  Platinum) is confirmed. All white, the version Hikvision's own site uses
 *  in its dark header (its markup calls it HikvisionLogo-bai, "bai" being
 *  white; Gus, 5 November). A white chip behind the red and grey one looked
 *  stuck on. If a tier is confirmed, the official badge from the
 *  portal replaces it. */
const PARTNER_BADGE = (
  <div key="hikvision-partner" className="flex items-center gap-2.5">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/funnel/hikvision-logo-white.svg" alt="Hikvision" width={84} height={14} className="h-3.5 w-auto" />
    <span aria-hidden="true" className="h-3.5 w-px bg-primary" />
    <span className="whitespace-nowrap text-[11px] font-semibold uppercase leading-none tracking-[0.18em] text-white/85">Partner</span>
  </div>
);

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
                hero-overlay the other landings share. On phones the photo is
                a crop with the camera small at the top and the rest fading
                to black, so the overlay stays light over the camera, dark
                under the header (white logo on a light soffit) and dark from
                the badge down. */}
            <div
              className="absolute inset-0 md:hidden"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(14,16,19,0.6) 0%, rgba(14,16,19,0.15) 11%, rgba(14,16,19,0.1) 20%, rgba(14,16,19,0.2) 28%, rgba(14,16,19,0.7) 38%, rgba(14,16,19,0.85) 100%)",
              }}
            />
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

      <div className="relative z-20 flex flex-1 justify-center pt-44 pb-16 md:pt-36">
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

      <SecurityHeroTrustBar extra={PARTNER_BADGE} roomy />
    </section>
  );
}
