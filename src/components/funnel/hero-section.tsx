import { ZipAvailabilityChecker } from "./zip-availability-checker";
import { HeroTrustBar } from "./hero-trust-bar";
import { HeroHeadline } from "./hero-headline";

/** Full-bleed hero with the funnel, and a full-width trust bar pinned at the bottom. */
export function HeroSection(
  { smartCoverage = false, addressMode = false }: { smartCoverage?: boolean; addressMode?: boolean } = {},
) {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/funnel/vr-hero.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
        // `fixed` is broken on iOS Safari (the image rescales and jumps), so the
        // parallax only kicks in from md up, where it actually works.
        data-parallax
      >
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Centered content. Extra top padding offsets the fixed header so the
          content sits optically centred in the visible area (not behind it). */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 pt-28 pb-16 md:pt-36 md:pb-16">
        <div className="container mx-auto text-center text-white">
          {/* Supporting label, not a headline: it sits above the value
              proposition, so it has to read as subordinate to it. The pill
              already supplies contrast and containment — adding size and
              semibold on top of that made a 14px chip outweigh the 16px
              sentence underneath. */}
          <div className="animate-fade-in-up mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 md:mb-8">
            <span className="text-xs font-medium tracking-wide text-white/95">Nationwide UK Coverage</span>
            {/* Decorative: the label already says UK. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/funnel/uk-flag.svg" alt="" aria-hidden="true" className="h-4 w-4 rounded-[2px]" />
          </div>

          <HeroHeadline />

          <p className="animate-fade-in-up animate-delay-200 mx-auto mb-8 max-w-3xl text-balance text-lg text-white/95 md:mb-10 md:text-xl lg:mb-12 lg:text-2xl">
            <span className="hidden md:inline">Professional Starlink installers. </span>All roof types: metal,
            shingle, flat. Same-week scheduling.
          </p>

          <div className="animate-fade-in-up animate-delay-300 mx-auto w-full md:max-w-2xl">
            <ZipAvailabilityChecker smartCoverage={smartCoverage} addressMode={addressMode} />
          </div>
        </div>
      </div>

      {/* Trust bar — full width, pinned to the bottom of the hero */}
      <HeroTrustBar />
    </section>
  );
}
