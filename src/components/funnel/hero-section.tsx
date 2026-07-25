import { ZipAvailabilityChecker } from "./zip-availability-checker";
import { HeroTrustBar } from "./hero-trust-bar";
import { HeroHeadline } from "./hero-headline";

/** Full-bleed hero with the funnel, and a full-width trust bar pinned at the bottom. */
export function HeroSection(
  { smartCoverage = false, addressMode = false }: { smartCoverage?: boolean; addressMode?: boolean } = {},
) {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/funnel/vr-hero.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1929]/60 via-[#0d1b2a]/70 to-[#000000]/85 md:from-[#0a1929]/40 md:via-[#0d1b2a]/50 md:to-[#000000]/70" />
      </div>

      {/* Centered content. Extra top padding offsets the fixed header so the
          content sits optically centred in the visible area (not behind it). */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 pt-28 pb-16 md:pt-36 md:pb-16">
        <div className="container mx-auto text-center text-white">
          <div className="animate-fade-in-up mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 md:mb-8">
            <span className="text-sm font-semibold text-white">Nationwide UK Coverage</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/funnel/uk-flag.svg" alt="UK Flag" className="h-5 w-5 rounded-[2px]" />
          </div>

          <HeroHeadline />

          <p className="animate-fade-in-up animate-delay-200 mx-auto mb-8 max-w-3xl text-base text-white/90 md:mb-10 md:text-lg lg:mb-12 lg:text-xl">
            <span className="hidden md:inline">Professional Starlink installers. </span>We handle all roof types —
            metal, shingle, and flat. Same-week scheduling.
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
