import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CirclePlus,
  ListChecks,
  MapPin,
  PhoneCall,
  Settings2,
  ShieldCheck,
} from "lucide-react";

/**
 * What the installation pays for: everything the fitting includes, as eight
 * cards.
 *
 * It answers the objection the chats raise most against an installed alarm:
 * 7 of 125 security buyers objected to the installation line (a median 38%
 * of the quote) and 10 raised a DIY kit (ajax-research/superchat-security-
 * insights.md). So the section spells out what the labour buys.
 *
 * Until 20 October it was a table against "A kit you fit yourself". Jordan's
 * feedback that day rewrote the rows as what we do rather than how we
 * compare, and asked whether the DIY column was needed; Gus took it out.
 * A table of one column is a list, so the rows became cards (Gus, same day):
 * four across on desktop, two on tablets, and on phones one per row with
 * the icon beside the text so the section stays short.
 * Row wording is Jordan's where he gave it; "Lead time" replaces "One visit,
 * usually a few hours", since some jobs run over a day. The warranty row is
 * his answer of 15 October. No price: the quotes rarely list the same
 * devices, so a figure would mislead.
 */

type Row = { icon: ReactNode; label: string; text: string };

const ICON = "h-4 w-4 shrink-0";

const ROWS: Row[] = [
  { icon: <CalendarClock className={ICON} />, label: "Lead time", text: "Usually fitted within 7 days of your go\u2011ahead" },
  { icon: <ListChecks className={ICON} />, label: "Choosing the kit", text: "We help you design the right system to protect your family home" },
  { icon: <MapPin className={ICON} />, label: "Placing it", text: "We protect all of your exposed entry and exit points" },
  { icon: <Settings2 className={ICON} />, label: "Setting it up", text: "App, users and arming modes done before we leave" },
  { icon: <BadgeCheck className={ICON} />, label: "Testing", text: "Every device tested, and a full system handover" },
  { icon: <PhoneCall className={ICON} />, label: "If something goes wrong", text: "A dedicated account manager for tech support" },
  { icon: <ShieldCheck className={ICON} />, label: "Warranty", text: "The manufacturer's on the kit, plus 2 or 5 years on the fitting" },
  { icon: <CirclePlus className={ICON} />, label: "Adding to it later", text: "A short visit, no rewiring" },
];

export function SecurityCompareSection() {
  return (
    <section id="installation" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Complete peace of mind</p>
          <h2 className="mt-4 h2-section text-foreground">
            What the installation
            <br className="hidden sm:block" /> pays for.
          </h2>
        </div>

        <ul className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-3 sm:auto-rows-fr sm:grid-cols-2 sm:gap-4 md:mt-16 lg:grid-cols-4">
          {ROWS.map((r) => (
            <li key={r.label} className="flex gap-4 rounded-2xl bg-background px-4 py-4 sm:flex-col sm:gap-0 sm:rounded-3xl sm:p-6">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-brand-icon [&>svg]:h-5 [&>svg]:w-5"
              >
                {r.icon}
              </span>
              <div className="min-w-0 sm:mt-5">
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
