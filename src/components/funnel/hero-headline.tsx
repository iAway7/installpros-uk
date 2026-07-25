"use client";

import { useExperimentConfig } from "@/components/experiments/experiment-provider";

const CLASS =
  "animate-fade-in-up animate-delay-100 mb-4 text-[2.5rem] leading-[1.04] tracking-[-0.03em] text-white md:mb-6 md:text-[4rem]";
// Hero H1: 40px → 64px, weight 600, line-height 104%, letter-spacing -3%.
// fontWeight is inline to beat the .theme-funnel h1 { font-weight: 700 } rule.
const H1_STYLE = { fontWeight: 600 } as const;

/**
 * Hero H1. Renders the default responsive headline server-side (good for SEO),
 * and swaps to an A/B variant headline on the client when one is assigned.
 */
export function HeroHeadline() {
  const config = useExperimentConfig();

  if (config.headline) {
    return <h1 className={CLASS} style={H1_STYLE}>{config.headline}</h1>;
  }

  return (
    <h1 className={CLASS} style={H1_STYLE}>
      <span className="md:hidden">Professional Starlink Installers</span>
      <span className="hidden md:inline">
        Get Fast, Reliable Internet — <br className="hidden lg:block" />
        Without the Installation Headache
      </span>
    </h1>
  );
}
