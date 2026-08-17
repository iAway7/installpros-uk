"use client";

import { useExperimentConfig } from "@/components/experiments/experiment-provider";

// Hero H1: 40px → 64px, weight 600, line-height 104%, letter-spacing -3%.
// All of that now lives in the .h1-hero token class (globals.css), so there is
// no inline fontWeight fighting the `.theme-editorial h1 { 700 }` rule.
const CLASS = "h1-hero animate-slide-up animate-delay-100 mb-4 text-white md:mb-6";

/**
 * Hero H1. Renders the default responsive headline server-side (good for SEO),
 * and swaps to an A/B variant headline on the client when one is assigned.
 */
export function HeroHeadline() {
  const config = useExperimentConfig();

  if (config.headline) {
    return <h1 className={CLASS}>{config.headline}</h1>;
  }

  return (
    <h1 className={CLASS}>
      <span className="md:hidden">Professional Starlink Installers</span>
      <span className="hidden md:inline">
        Get Fast, Reliable Internet — <br className="hidden lg:block" />
        Without the Installation Headache
      </span>
    </h1>
  );
}
