import type { ReactNode } from "react";

const FEATURES: { t: string; d: string; i: ReactNode }[] = [
  {
    t: "Professional Installation",
    d: "Certified, insured engineers on every single job.",
    i: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
    ),
  },
  {
    t: "Optimal Signal Placement",
    d: "Obstruction scanning finds the perfect line of sight before we drill.",
    i: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="8" /><path d="M12 2v3" /><path d="M12 19v3" /><path d="M2 12h3" /><path d="M19 12h3" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /></svg>
    ),
  },
  {
    t: "Cable Management",
    d: "Discreet, weatherproofed routing that respects your home.",
    i: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 15.5c2.5 0 2.5-6 5-6s2.5 6 5 6 2.5-6 5-6 2.5 6 5 6" /><path d="M2 8.5h4" /><path d="M18 8.5h4" /></svg>
    ),
  },
  {
    t: "Roof Mounting",
    d: "All-metal mounts, fitted to any roof — metal, slate, tile or flat.",
    i: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v10h13V10" /><circle cx="12" cy="14.5" r="2.2" /><path d="M12 16.7V20" /></svg>
    ),
  },
  {
    t: "Mesh WiFi Setup",
    d: "Strong signal in every room, barn and outbuilding.",
    i: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="19.5" r="1" fill="currentColor" /></svg>
    ),
  },
  {
    t: "Business Installations",
    d: "Offices, farms, marinas and sites — connectivity that scales.",
    i: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" /><path d="M16 9h3a1 1 0 0 1 1 1v11" /><path d="M2 21h20" /><path d="M8 7h2" /><path d="M8 11h2" /><path d="M8 15h2" /></svg>
    ),
  },
  {
    t: "Post-install Support",
    d: "Real engineers on the phone, long after we've packed up.",
    i: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 14a8 8 0 0 1 16 0" /><rect x="3" y="14" width="4.5" height="6.5" rx="1.8" /><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.8" /></svg>
    ),
  },
];

/** "Engineered installs, not odd jobs." — the eight capability cards, ported
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
          <p className="max-w-[420px] text-base text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            One certified team handles everything — from the first signal scan to the final speed test.
          </p>
        </div>

        <div
          className="mt-12 grid gap-3.5 md:mt-[70px]"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(258px, 1fr))" }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.t}
              className="rounded-xl border border-border bg-secondary/40 p-6 transition-all duration-450 ease-ds hover:-translate-y-[5px] hover:border-brand-soft/35"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-[13px] border border-brand-soft/25 bg-primary/10 text-brand-icon"
              >
                {f.i}
              </div>
              <h3 className="mt-5 text-[17px] font-semibold text-foreground">{f.t}</h3>
              <p className="mt-2.5 text-[14px] text-muted-foreground" style={{ lineHeight: "1.4" }}>
                {f.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
