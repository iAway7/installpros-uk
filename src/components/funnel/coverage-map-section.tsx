import { UkCoverageMap } from "./uk-coverage-map";

const STATS = [
  { value: "4", label: "Nations covered" },
  { value: "175+", label: "Towns & cities served" },
  { value: "7 days", label: "Typical lead time" },
  { value: "100%", label: "Fixed-price quotes" },
];

/**
 * "One team. The whole map." coverage section — real UK map with live-install
 * pulses on the right, headline + stat grid on the left. Used on
 * /starlink-installation in place of the generic availability section.
 */
export function CoverageMapSection() {
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
              The whole map.
            </h2>
            <p className="mt-6 max-w-md text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
              From the Highlands to Cornwall, our engineers cover all four nations — no postcode too remote.
            </p>

            {/* 2×2 stat grid with hairline dividers */}
            <div className="mt-10 grid max-w-lg grid-cols-2 border-t border-border">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`py-6 ${i % 2 === 1 ? "border-l border-border pl-6" : "pr-6"} ${i >= 2 ? "border-t border-border" : ""}`}
                >
                  <div className="text-[34px] font-normal leading-[1.1] tracking-[-0.03em] text-foreground">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[13px] text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — real UK map */}
          <div className="animate-fade-in-up animate-delay-100">
            <div className="mx-auto w-full max-w-[520px]">
              <UkCoverageMap baseColor="hsl(var(--foreground))" />
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Areas we cover · tap a location
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
