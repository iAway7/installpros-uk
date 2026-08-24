import ReactDOM from "react-dom";
import { ZipAvailabilityChecker } from "./zip-availability-checker";
import { HeroTrustBar } from "./hero-trust-bar";
import { HeroHeadline } from "./hero-headline";

/** Full-bleed hero with the funnel, and a full-width trust bar pinned at the bottom. */
export function HeroSection(
  { smartCoverage = false, addressMode = false }: { smartCoverage?: boolean; addressMode?: boolean } = {},
) {
  // The hero photo is a CSS background, which the preload scanner cannot see:
  // it has to fetch the HTML, build the CSSOM and only then discover the URL.
  // This preload removes that round trip.
  //
  // We tried next/image with `priority` instead, for responsive sizing. It cost
  // 1.7s of FCP (1.1s -> 2.8s), measured twice with a warm optimiser cache: the
  // high-priority image preload competes with the 15 KB of render-blocking CSS
  // on a slow connection, so first paint lands later. Reverted. The real fault
  // was never the delivery mechanism — it was the source growing from 19.5 KB
  // to 147 KB. It is now 58 KB, which is what actually needed fixing.
  ReactDOM.preload("/funnel/hero-uk-residential.webp", {
    as: "image",
    fetchPriority: "high",
  });

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div
        className="absolute inset-0"
        // `fixed` is broken on iOS Safari (the image rescales and jumps), so the
        // parallax only kicks in from md up, where it actually works.
        data-parallax
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/funnel/hero-uk-residential.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Centred content, but centred with `my-auto` on the child rather than
          `items-center` on the parent. They look identical while the content
          fits — and behave completely differently when it doesn't. Centre
          alignment overflows equally in both directions, so on a short viewport
          the tallest step (step 4: four cards, consent copy, two buttons) pushed
          its own heading up underneath the fixed header, where it was clipped
          and unreachable. Auto margins collapse to zero instead of overflowing,
          so the content always starts below `pt-28`. */}
      <div className="relative z-10 flex flex-1 justify-center pt-28 pb-16 md:pt-36 md:pb-16">
        <div className="container mx-auto my-auto text-center text-white">
          {/* Supporting label, not a headline: it sits above the value
              proposition, so it has to read as subordinate to it. The pill
              already supplies contrast and containment — adding size and
              semibold on top of that made a 14px chip outweigh the 16px
              sentence underneath. */}
          <div className="animate-slide-up mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 md:mb-8">
            <span className="text-body-sm font-medium tracking-wide text-white/95">Nationwide UK Coverage</span>
            {/* Decorative: the label already says UK. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/funnel/uk-flag.svg" alt="" aria-hidden="true" className="h-4 w-4 rounded-xs" />
          </div>

          <HeroHeadline />

          <p className="animate-slide-up animate-delay-200 mx-auto mb-8 max-w-3xl text-balance text-lg text-white/95 md:mb-10 md:text-xl lg:mb-12 lg:text-2xl">
            <span className="hidden md:inline">Professional Starlink installers. </span>Fitted where the signal
            is strongest. Same-week scheduling.
          </p>

          <div className="animate-slide-up animate-delay-300 mx-auto w-full md:max-w-2xl">
            <ZipAvailabilityChecker smartCoverage={smartCoverage} addressMode={addressMode} />
          </div>
        </div>
      </div>

      {/* Trust bar — full width, pinned to the bottom of the hero */}
      <HeroTrustBar />
    </section>
  );
}
