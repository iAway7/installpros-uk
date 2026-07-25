import type { ReactNode } from "react";
import { CountUp } from "./count-up";

const NUMBER_STYLE = {
  fontSize: "clamp(44px, 4.2vw, 60px)",
  fontWeight: 200,
  letterSpacing: "-0.04em",
  lineHeight: 1,
} as const;

const STATS: { value: ReactNode; label: string }[] = [
  { value: <CountUp to={9163} suffix="+" />, label: "Installations completed across the UK" },
  {
    value: (
      <>
        5.0<span style={{ color: "var(--gold, #fbbc04)", fontSize: "0.55em", verticalAlign: "0.28em" }}>★</span>
      </>
    ),
    label: "Google rating — every review counted",
  },
  { value: "175+", label: "Towns and cities served, and counting" },
  {
    value: (
      <>
        1–3<span className="text-muted-foreground" style={{ fontSize: "0.45em", fontWeight: 400 }}>&nbsp;hrs</span>
      </>
    ),
    label: "Average time on site, start to speed test",
  },
];

/** "The numbers do the talking." — the track-record stat row, ported from the
 *  /starlink-installations landing. */
export function TrackRecordSection() {
  return (
    <section id="track-record" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-primary">Track Record</p>
        <h2
          className="mt-4 text-[2.5rem] font-bold text-foreground md:text-[3.25rem]"
          style={{ fontWeight: 600, lineHeight: "1.06em", letterSpacing: "-0.035em" }}
        >
          The numbers
          <br />
          do the talking.
        </h2>

        <div
          className="mt-14 grid gap-10 md:mt-[70px]"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="border-t border-border pt-7">
              <div className="text-foreground" style={NUMBER_STYLE}>
                {s.value}
              </div>
              <div className="mt-3.5 text-[15px] text-muted-foreground" style={{ lineHeight: "1.55" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
