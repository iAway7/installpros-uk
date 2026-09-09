import type { ReactNode } from "react";

export interface Feature {
  t: string;
  d: string;
  i: ReactNode;
}

/* Icons are named and shared so a segment variant can reuse them without
   duplicating the markup. */

const IconWrench = (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
);

const IconWifi = (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="19.5" r="1" fill="currentColor" /></svg>
);

const IconCable = (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 15.5c2.5 0 2.5-6 5-6s2.5 6 5 6 2.5-6 5-6 2.5 6 5 6" /><path d="M2 8.5h4" /><path d="M18 8.5h4" /></svg>
);

const IconHeadset = (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 14a8 8 0 0 1 16 0" /><rect x="3" y="14" width="4.5" height="6.5" rx="1.8" /><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.8" /></svg>
);

const FEATURES: Feature[] = [
  {
    t: "Professional Installation",
    d: "Certified, insured engineers who scan for obstructions and mount where the signal is strongest.",
    i: IconWrench,
  },
  {
    t: "Whole-Property WiFi",
    d: "Mesh and access points configured until every room, barn and outbuilding has signal.",
    i: IconWifi,
  },
  {
    t: "Cable Management",
    d: "Discreet, weatherproofed routing that respects your property.",
    i: IconCable,
  },
  {
    t: "Post-install Support",
    d: "Real engineers on the phone, long after we’ve packed up.",
    i: IconHeadset,
  },
];

/**
 * Commercial variant. Two rules hold this set together.
 *
 * Order: support leads rather than closes. A business is buying cover against
 * downtime, so the card answering "what happens when it breaks" outranks the
 * one about how neatly the cable was run.
 *
 * Titles: two-word Title Case noun phrases, the same shape the residential set
 * above already uses. The first draft ran to six words with a comma in the
 * middle, every title wrapped to two lines, and the row read as four short
 * paragraphs instead of four claims. The commercial argument belongs in the
 * body copy; the title is a label you scan.
 */
const IconShield = (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3 5 6v5.5c0 4.3 2.9 8.2 7 9.5 4.1-1.3 7-5.2 7-9.5V6l-7-3z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const COMMERCIAL_FEATURES: Feature[] = [
  {
    // This card used to say "24/7 Support · Ring at any hour and a person picks
    // up". Asked outright whether that was genuinely staffed, Will did not say
    // yes: he said to position the work as a managed service. So the card says
    // what he actually stands behind. If 24/7 cover is real and staffed, this
    // is the place to put it back.
    t: "Managed Service",
    d: "We do not fit it and disappear. We specify, install and then manage the connection as a service.",
    i: IconHeadset,
  },
  {
    // Will: failover is "the primary use case", Starlink with 5G backup, and it
    // can run alongside an existing leased line rather than replacing it.
    t: "Built-In Failover",
    d: "Starlink with 5G backup, working alongside the line you already have. The site stays up when one link does not.",
    i: IconWifi,
  },
  {
    // Replaces "Certified, insured engineers". Will confirmed we hold none of
    // CHAS, SafeContractor, ISO 9001, ISO 14001, ISO 45001, IPAF, PASMA or
    // NICEIC yet, so an accreditation claim would have been false. The cover is
    // real, it is unusually high, and for a facilities team it does much of the
    // same job.
    t: "£10m Cover",
    d: "Public liability, professional indemnity, employers' liability and cyber, all at ten million.",
    i: IconShield,
  },
  {
    // Same words as the systems section further down, on purpose: Will picked
    // "full site coverage" there, and a page that makes the same promise twice
    // in two different phrasings reads as two half-claims rather than one point
    // made twice. Title Case because that is this card set's convention.
    //
    // The two are not redundant. This one is the promise and lists the kinds of
    // building; the systems row is the mechanism, the point to point link and
    // what it costs against a second subscription.
    t: "Full Site Coverage",
    d: "Offices, warehouses, yards and outbuildings. Not just the room the dish lands in.",
    i: IconCable,
  },
];

/** "Engineered installs, not odd jobs." — the four capability cards, ported
 *  from the /starlink-installations landing. */
export function WhyInstallProsSection(
  { features = FEATURES, heading, intro }: {
    features?: Feature[];
    /** Single-line override. The default keeps its hand-placed line break. */
    heading?: string;
    intro?: string;
  } = {},
) {
  return (
    <section id="why" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-7">
          <div>
            <p className="eyebrow">Why InstallPros</p>
            <h2
              className="mt-4 max-w-[640px] h2-section text-foreground"
            >
              {heading ?? (
                <>
                  Engineered installs,
                  <br />
                  not odd jobs.
                </>
              )}
            </h2>
          </div>
          <p className="max-w-[420px] text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            {intro ?? "One certified team handles everything, from the first signal scan to the final speed test."}
          </p>
        </div>

        <div
          className="mt-12 grid gap-3.5 md:mt-18"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(258px, 1fr))" }}
        >
          {features.map((f) => (
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
