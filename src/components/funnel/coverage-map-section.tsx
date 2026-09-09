import { UkCoverageMap } from "./uk-coverage-map";

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
 * than a constant. Residential keeps 3 days. Commercial says 7, which is the
 * "fitted in under a week" Will has used himself and sits better beside the
 * FAQ's "within days of the survey" than 3 did.
 *
 * The three-versus-seven contradiction this page used to have was the reason
 * the commercial copy stopped stating a number at all. It is stated again here
 * because a stat grid with a blank in it is worse than a number, but it now
 * comes from one place instead of two.
 */
const DEFAULT_LEAD_TIME = "3 days";

/**
 * "One team. Full coverage." coverage section — real UK map with live-install
 * pulses on the right, headline + stat grid on the left. Used on
 * /starlink-installation in place of the generic availability section.
 */
export function CoverageMapSection(
  { leadTime = DEFAULT_LEAD_TIME }: { leadTime?: string } = {},
) {
  const stats = [
    ...STATS.slice(0, 2),
    { value: leadTime, label: "Typical lead time" },
    ...STATS.slice(2),
  ];
  return (
    <section id="coverage" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
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
