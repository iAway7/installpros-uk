import type { ReactNode } from "react";

const FEATURES: { t: string; d: string; i: ReactNode }[] = [
  {
    t: "Professional Installation",
    d: "Certified, insured engineers who scan for obstructions and mount where the signal is strongest.",
    i: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
    ),
  },
  {
    t: "Whole-Property WiFi",
    d: "Mesh and access points configured until every room, barn and outbuilding has signal.",
    i: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="19.5" r="1" fill="currentColor" /></svg>
    ),
  },
  {
    t: "Cable Management",
    d: "Discreet, weatherproofed routing that respects your property.",
    i: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 15.5c2.5 0 2.5-6 5-6s2.5 6 5 6 2.5-6 5-6 2.5 6 5 6" /><path d="M2 8.5h4" /><path d="M18 8.5h4" /></svg>
    ),
  },
  {
    t: "Post-install Support",
    d: "Real engineers on the phone, long after we’ve packed up.",
    i: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 14a8 8 0 0 1 16 0" /><rect x="3" y="14" width="4.5" height="6.5" rx="1.8" /><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.8" /></svg>
    ),
  },
];

/** "Engineered installs, not odd jobs." — the four capability cards, ported
 *  from the /starlink-installations landing. */
export function WhyInstallProsSection() {
  return (
    <section id="why" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-7">
          <div>
            <p className="eyebrow">Why InstallPros</p>
            <h2
              className="mt-4 max-w-[640px] h2-section text-foreground"
            >
              Engineered installs,
              <br />
              not odd jobs.
            </h2>
          </div>
          <p className="max-w-[420px] text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            One certified team handles everything, from the first signal scan to the final speed test.
          </p>
        </div>

        <div
          className="mt-12 grid gap-3.5 md:mt-[70px]"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(258px, 1fr))" }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.t}
              className="rounded-xl border border-border bg-secondary/40 p-6 transition-all duration-card ease-ds hover:-translate-y-[5px] hover:border-brand-soft/35"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-brand-soft/25 bg-primary/10 text-brand-icon"
              >
                {f.i}
              </div>
              <h3 className="mt-5 text-lead font-semibold text-foreground">{f.t}</h3>
              <p className="mt-2.5 text-body-sm text-muted-foreground" style={{ lineHeight: "1.4" }}>
                {f.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
