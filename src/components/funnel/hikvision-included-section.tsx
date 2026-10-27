import type { ReactNode } from "react";
import { ArrowRight, BadgeCheck, CalendarClock, Cable, ShieldCheck } from "lucide-react";
import { Gap } from "./hikvision-gap";

/**
 * What the fitting includes. A copy of security-compare-section.tsx (four
 * benefit cards in one row from 1280px, two by two below), which renders the
 * live Ajax page.
 *
 * Why: price ends more lost camera quotes than anything else, the labour line
 * is the part people resent ("Labour cist is way too high"), and £1,000 is
 * the budget they bring. The page shows no prices, so this is where it shows
 * what the fitting buys instead.
 */

type Row = { icon: ReactNode; label: string; text: ReactNode };

const ICON = "h-4 w-4 shrink-0";

const ROWS: Row[] = [
  {
    icon: <CalendarClock className={ICON} />,
    label: "Fitted fast",
    text: <Gap q="Q11">Usually within 7 days of your go&#8209;ahead.</Gap>,
  },
  {
    icon: <Cable className={ICON} />,
    label: "Cables neat",
    text: <Gap q="Q10">Run through the loft or clipped tidily, sealed at every camera.</Gap>,
  },
  {
    icon: <BadgeCheck className={ICON} />,
    label: "Tested before we leave",
    text: "Every camera aimed, recording checked and played back.",
  },
  {
    icon: <ShieldCheck className={ICON} />,
    label: "Warranty included",
    text: <Gap q="Q5">The maker&apos;s warranty on the kit, plus [X] years on our fitting.</Gap>,
  },
];

export function HikvisionIncludedSection() {
  return (
    <section id="installation" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Supplied and fitted</p>
          <h2 className="mt-4 h2-section text-foreground">What the fitting includes.</h2>
        </div>

        <ul className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-3 sm:auto-rows-fr sm:grid-cols-2 sm:gap-4 md:mt-16 xl:grid-cols-4">
          {ROWS.map((r) => (
            <li key={r.label} className="flex flex-col rounded-2xl bg-background p-5 sm:rounded-3xl sm:p-6">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-brand-icon [&>svg]:h-5 [&>svg]:w-5"
              >
                {r.icon}
              </span>
              <div className="mt-4 min-w-0">
                <h3 className="text-balance text-base font-bold leading-tight text-foreground sm:text-lg">{r.label}</h3>
                <p className="mt-1 text-pretty text-body-sm text-muted-foreground sm:mt-1.5" style={{ lineHeight: "1.5" }}>
                  {r.text}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center md:mt-12">
          <a
            href="#quote"
            className="focus-ring-solid flex h-control-lg w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover sm:w-auto"
          >
            Get my free quote
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
