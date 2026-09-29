import { UkCoverageMap } from "./uk-coverage-map";

/**
 * The coverage section, for the vehicle landings only.
 *
 * A copy of CoverageMapSection, and deliberately so. That one is rendered by
 * /install-quote, which is the only page live in Google Ads and the page the
 * CRO case for Will is measured on. Editing it to carry the partner network
 * would change the live page invisibly: nothing in the diff would say
 * install-quote. The user's rule as of 2026-09-29 is to duplicate rather than
 * add props or variants, so this file exists to be edited freely.
 *
 * UkCoverageMap is NOT duplicated, because nothing here changes it. If the
 * geometry or the pins ever need to differ, copy that too rather than editing
 * it in place.
 *
 * Right now this is byte-identical in behaviour to its parent. That is the
 * point: the isolation lands first, the content change follows once Will
 * confirms what of the partner network is publishable.
 *
 * ── WHAT THIS IS FOR, AND THE TRAP IN IT ────────────────────────────────────
 * Will sent the InstallPros Partner Network map on 2026-09-29 ("This is
 * currently where we have approved workshops"). It is a Leaflet app holding
 * 36 partners, each typed Fixed, Mobile, or Fixed & Mobile.
 *
 * DO NOT PLOT THOSE 36 AS PINS. This map carried twenty-three town dots once
 * and Will himself killed them, because Surrey, one of the biggest markets,
 * looked uncovered when no dot happened to land in it. Thirty-six workshop
 * pins recreates that hole exactly, and worse, it invites a reader to check
 * their own town and leave when it is missing. One pin per region says the
 * true thing and cannot develop a new gap.
 *
 * The partner data belongs in the STATS instead, where a count strengthens the
 * coverage claim without drawing a map of where we are not. The Fixed versus
 * Mobile split is the genuinely useful part on this page, because it is the
 * same argument VehicleFitSection already makes in words: bring it to us, or
 * we come to you.
 *
 * PENDING, BEFORE ANY OF IT SHIPS:
 * 1. Whether the partner count is publishable at all. It is Will's
 *    subcontractor network, and a competitor reads 36 as a shopping list.
 * 2. Whether 36 is current, and the Fixed / Mobile / both split within it.
 * 3. Never the company names or contacts. A count and a type, nothing else.
 */

const STATS = [
  { value: "4", label: "Nations covered" },
  // 225 is the count of Will's major-towns list (27 Aug 2026). That list is a
  // COVERAGE list, not our install record, which is why the label says covered
  // and not served: we can stand behind travelling to all of them, we cannot
  // claim to have worked in all of them.
  //
  // The list itself is not on the page, so nothing here shows the reader where
  // 225 comes from. That is a known gap, not an oversight.
  { value: "225+", label: "Towns & cities covered" },
  { value: "100%", label: "Fixed-price quotes" },
];

/**
 * Lead time is the one stat that differs by segment, so it is a prop rather
 * than a constant. Residential keeps 3 days.
 */
const DEFAULT_LEAD_TIME = "3 days";

export function VehicleCoverageMapSection(
  { leadTime = DEFAULT_LEAD_TIME }: { leadTime?: string } = {},
) {
  const stats = [
    ...STATS.slice(0, 2),
    { value: leadTime, label: "Typical lead time" },
    ...STATS.slice(2),
  ];
  return (
    <section id="coverage" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Left — copy + stats */}
          <div className="animate-fade-in-up">
            <p className="eyebrow">Coverage</p>
            <h2
              className="mt-4 h2-section text-foreground"
            >
              One team.
              <br />
              Full coverage.
            </h2>
            <p className="mt-6 max-w-md text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
              From the Highlands to Cornwall, our engineers cover all four nations. No postcode too remote.
            </p>

            {/* 2×2 stat grid with hairline dividers */}
            <div className="mt-10 grid max-w-lg grid-cols-2 border-t border-border">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`py-6 ${i % 2 === 1 ? "border-l border-border pl-6" : "pr-6"} ${i >= 2 ? "border-t border-border" : ""}`}
                >
                  <div className="text-[34px] font-normal leading-[1.1] tracking-[-0.03em] text-foreground">
                    {s.value}
                  </div>
                  <div className="mt-1 text-caption text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — real UK map */}
          <div className="animate-fade-in-up animate-delay-100">
            <div className="relative mx-auto w-full max-w-[520px]">
              {/* LIVE badge — real-time feel over the pulsing install pins */}
              <div className="pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-background/70 px-2.5 py-1 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
                <span className="text-micro font-semibold uppercase tracking-[0.16em] text-foreground">Live</span>
              </div>
              <UkCoverageMap baseColor="hsl(var(--foreground))" />
              <p className="mt-4 text-center text-label text-muted-foreground">
                Areas we cover · tap a region
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
