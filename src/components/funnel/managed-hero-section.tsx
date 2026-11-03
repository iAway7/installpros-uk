import { HeroHeadline } from "./hero-headline";
import { SecurityHeroTrustBar } from "./security-hero-trust-bar";
import { ManagedLeadForm } from "./managed-lead-form";

/**
 * Hero for the managed service page. A copy of voip-hero-section.tsx with
 * its form swapped for managed-lead-form.tsx; the trust bar is the Ajax one,
 * as there.
 *
 * PHOTOGRAPH: none yet. Gus is generating them from managed-research/
 * prompts-imagenes.md (prompt 1: a converted stone barn at dusk with the dish
 * and a camera on the wall). Until then `image` is left out and the hero
 * falls back to the dark surface. The overlays below are the VoIP ones and
 * get tuned to the photo when it arrives.
 */
export function ManagedHeroSection({
  image,
  imageSrcSet,
  imageMobile,
  headline,
  subheadline,
  subheadlineNarrow,
  badge,
  headlineConfigKey,
  formName,
}: {
  /** The agreed photograph, once it exists. */
  image?: string;
  imageSrcSet?: string;
  imageMobile?: string;
  headline: string;
  subheadline: string;
  subheadlineNarrow?: string;
  badge: string;
  headlineConfigKey: string;
  formName: string;
}) {
  return (
    <section className="relative flex min-h-[88svh] flex-col md:min-h-[100svh]">
      <div className="absolute inset-0 overflow-hidden">
        {image ? (
          <>
            <picture>
              {imageMobile && <source media="(max-width: 767px)" srcSet={imageMobile} />}
              {/* From md up anchored right, where the building sits. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} srcSet={imageSrcSet} sizes={imageSrcSet ? "100vw" : undefined} alt="" aria-hidden="true" loading="eager" decoding="sync" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-top md:object-right" />
            </picture>
            {/* Phones: dark under the header and from the subheadline down,
                where the form sits. */}
            <div
              className="absolute inset-0 md:hidden"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(14,16,19,0.65) 0%, rgba(14,16,19,0.35) 12%, rgba(14,16,19,0.3) 26%, rgba(14,16,19,0.75) 40%, rgba(14,16,19,0.9) 100%)",
              }}
            />
            {/* From md up dark where the text sits, thinner at the right. */}
            <div
              className="absolute inset-0 hidden md:block"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.55)), radial-gradient(24% 46% at 86% 40%, rgba(14,16,19,0.15) 0%, rgba(14,16,19,0.72) 100%)",
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
            <span className="text-body-sm font-medium tracking-wide text-white/95">{badge}</span>
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
            <ManagedLeadForm formName={formName} position="hero" />
          </div>

          {/* Many who ask for a fixed IP don't need one (managed-research,
              section 1), so the hero promises the check, not the IP. */}
          <p className="mt-6 text-body-sm text-white/70">Not sure? We check first.</p>
        </div>
      </div>

      <SecurityHeroTrustBar />
    </section>
  );
}
