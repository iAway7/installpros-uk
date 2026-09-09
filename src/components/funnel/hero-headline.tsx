"use client";

import { useExperimentConfig } from "@/components/experiments/experiment-provider";

// Hero H1: 40px → 64px, weight 600, line-height 104%, letter-spacing -3%.
// All of that now lives in the .h1-hero token class (globals.css), so there is
// no inline fontWeight fighting the `.theme-editorial h1 { 700 }` rule.
const CLASS = "h1-hero animate-slide-up animate-delay-100 mb-4 text-white md:mb-6";

/**
 * Hero H1. Renders the default responsive headline server-side (good for SEO),
 * and swaps to an A/B variant headline on the client when one is assigned.
 *
 * `configKey` is which field of the variant config to read, and it exists
 * because on-page experiments are NOT scoped to a page: ExperimentProvider
 * applies every running experiment's config on whatever landing the visitor is
 * on. A variant setting plain `headline` would therefore rewrite the H1 on
 * /install-quote and /starlink-installation as well, with commercial copy.
 *
 * So a page that wants its own headline test passes its own key (commercial
 * uses `headlineCommercial`) and the experiment sets that field instead. The
 * residential pair keeps reading `headline` and is unaffected.
 *
 * The real fix is page targeting on the experiment record itself. This is the
 * version that does not need a schema change.
 */
export function HeroHeadline(
  { headline, configKey = "headline" }: { headline?: string; configKey?: string } = {},
) {
  const config = useExperimentConfig();

  const assigned = config[configKey];
  if (typeof assigned === "string" && assigned.length > 0) {
    return <h1 className={CLASS}>{assigned}</h1>;
  }

  if (headline) {
    return <h1 className={CLASS}>{headline}</h1>;
  }

  return (
    <h1 className={CLASS}>
      <span className="md:hidden">Professional Starlink Installers</span>
      <span className="hidden md:inline">
        Get Fast, Reliable Internet <br className="hidden lg:block" />
        Without the Installation Headache
      </span>
    </h1>
  );
}
