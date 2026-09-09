import type { ReactNode } from "react";
import { CountUp } from "./count-up";

const STATS: { value: ReactNode; label: string }[] = [
  { value: <CountUp to={3500} suffix="+" />, label: "Installations completed across the UK" },
  {
    value: (
      <>
        5.0<span className="text-gold" style={{ fontSize: "0.55em", verticalAlign: "0.28em" }}>★</span>
      </>
    ),
    label: "Google rating, every review counted",
  },
  // 225 is the count of Will's major-towns list (27 Aug 2026), the same figure
  // the coverage map uses. It was 175 here and 225 there, which is the kind of
  // mismatch a reader notices and nobody can explain.
  //
  // "Covered", not "served". That list is where we will travel, not where we
  // have worked, and this section is otherwise a record of things we have
  // actually done. Claiming 225 towns served would be the one number here we
  // could not stand behind.
  { value: "225+", label: "Towns and cities covered" },
  {
    value: (
      <>
        3<span className="text-muted-foreground" style={{ fontSize: "0.45em", fontWeight: 400 }}>&nbsp;hrs</span>
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
      <div className="container mx-auto max-w-6xl">
        <p className="eyebrow">Track Record</p>
        <h2
          className="mt-4 h2-section text-foreground"
        >
          The numbers
          <br />
          do the talking.
        </h2>

        <div
          className="mt-14 grid gap-10 md:mt-18"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="border-t border-border pt-7">
              <div className="stat-xl text-foreground">{s.value}</div>
              <div className="mt-3.5 text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
