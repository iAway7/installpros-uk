import { HeroHeadline } from "./hero-headline";
import { SecurityHeroTrustBar } from "./security-hero-trust-bar";
import { VoipLeadForm } from "./voip-lead-form";

/**
 * Hero for the digital landline page. A copy of hikvision-hero-section.tsx
 * (the live Hikvision page), with its form swapped for voip-lead-form.tsx.
 * The trust bar is the Ajax one, imported as it is: Google, Trustpilot,
 * UK-wide, DBS checked, none of it about the product.
 *
 * PHOTOGRAPH: none yet. The plan (voip-research/estructura-y-borrador.md) is
 * the real handset on a farmhouse hall table with the Starlink router in
 * view: nobody shows a phone next to Starlink. Until it exists the hero is
 * the dark surface the Hikvision page started from.
 */
export function VoipHeroSection({
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} srcSet={imageSrcSet} sizes={imageSrcSet ? "100vw" : undefined} alt="" aria-hidden="true" loading="eager" decoding="sync" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-top" />
            </picture>
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(14,16,19,0.55), rgba(14,16,19,0.8))" }} />
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
            <VoipLeadForm formName={formName} position="hero" />
          </div>

          {/* The one instruction that saves the number: 2 buyers lost theirs
              by cancelling BT first (voip-research, section 1). */}
          <p className="mt-6 text-body-sm text-white/70">No need to cancel anything yet.</p>
        </div>
      </div>

      <SecurityHeroTrustBar />
    </section>
  );
}
