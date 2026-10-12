"use client";

import { Fragment } from "react";
import { useExperimentConfig } from "@/components/experiments/experiment-provider";

// Hero H1: 40px → 64px, weight 600, line-height 104%, letter-spacing -3%.
// All of that now lives in the .h1-hero token class (globals.css), so there is
// no inline fontWeight fighting the `.theme-editorial h1 { 700 }` rule.
const CLASS = "h1-hero animate-slide-up animate-delay-100 mb-4 text-white md:mb-6";

/**
 * Renders a headline with its line breaks where the author put them.
 *
 * A newline in the string becomes a <br> that only applies from md up, so
 * desktop breaks where the copy says and a phone still wraps to fit. The
 * component's own default headline has done this since the start with a
 * hardcoded <br className="hidden lg:block" />; this is the same thing for a
 * headline that arrives as a prop.
 *
 * The space before the break is what stops "internet" and "costing" running
 * together on a phone, where the <br> is display:none. At md it sits at the
 * end of a line and collapses.
 */
function withBreaks(text: string) {
  const parts = text.split("\n");
  if (parts.length === 1) return text;
  return parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 && (
        <>
          {" "}
          <br className="hidden md:block" />
        </>
      )}
      {part}
    </Fragment>
  ));
}

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
    return <h1 className={CLASS}>{withBreaks(assigned)}</h1>;
  }

  if (headline) {
    return <h1 className={CLASS}>{withBreaks(headline)}</h1>;
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
