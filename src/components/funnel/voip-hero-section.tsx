import { HeroHeadline } from "./hero-headline";
import { SecurityHeroTrustBar } from "./security-hero-trust-bar";
import { VoipLeadForm } from "./voip-lead-form";

/**
 * Hero for the digital landline page. A copy of hikvision-hero-section.tsx
 * (the live Hikvision page), with its form swapped for voip-lead-form.tsx.
 * The trust bar is the Ajax one, imported as it is: Google, Trustpilot,
 * UK-wide, DBS checked, none of it about the product.
 *
 * PHOTOGRAPH: Gus's Gemini render, 3 November (voip-research/
 * prompts-imagenes.md, prompt 1): the phone on a farmhouse hall table next to
 * the router, an older hand lifting it, UK sockets: nobody shows a phone next
 * to Starlink. A second render had a made-up Starlink logo on the router, so
 * this one, with none. Without `image` the hero falls back to the dark
 * surface.
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
              {/* From md up anchored right, so the table, the phone and the
                  hand sit at the edge and the headline runs over the hall. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} srcSet={imageSrcSet} sizes={imageSrcSet ? "100vw" : undefined} alt="" aria-hidden="true" loading="eager" decoding="sync" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-top md:object-right" />
            </picture>
            {/* On phones the crop has the lamp, the phone and the hand at the
                top: light there, dark under the header and from the
                subheadline down, where the form sits. */}
            <div
              className="absolute inset-0 md:hidden"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(14,16,19,0.65) 0%, rgba(14,16,19,0.35) 12%, rgba(14,16,19,0.3) 26%, rgba(14,16,19,0.75) 40%, rgba(14,16,19,0.9) 100%)",
              }}
            />
            {/* From md up dark over the hall, where the text sits, and
                thinner over the table at the right. */}
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
