import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CircleCheck,
  CirclePlus,
  ListChecks,
  MapPin,
  PhoneCall,
  Settings2,
  ShieldCheck,
} from "lucide-react";

/**
 * What the installation pays for: everything the fitting includes, in one
 * dark card.
 *
 * It answers the objection the chats raise most against an installed alarm:
 * 7 of 125 security buyers objected to the installation line (a median 38%
 * of the quote) and 10 raised a DIY kit (ajax-research/superchat-security-
 * insights.md). So the section spells out what the labour buys.
 *
 * Until 20 October it was a table against "A kit you fit yourself". Jordan's
 * feedback that day rewrote the rows as what we do rather than how we
 * compare, and asked whether the DIY column was needed; Gus took it out. The
 * card also replaced the phone version Gus disliked (a list of grey boxes).
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

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl bg-foreground px-6 py-8 shadow-raised sm:px-8 md:mt-16 md:px-10 md:py-10">
          <p className="text-label font-semibold uppercase tracking-[0.14em] text-background/55">InstallPros</p>
          <p className="mt-1 text-lead font-semibold text-background">Fitted by us</p>

          <dl className="mt-6">
            {ROWS.map((r) => (
              <div
                key={r.label}
                className="border-t border-background/10 py-4 md:grid md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:gap-6 md:py-5"
              >
                <dt className="flex items-center gap-2 text-label font-semibold uppercase tracking-[0.12em] text-background/55 md:gap-3 md:text-body-sm md:normal-case md:tracking-normal md:text-background/70">
                  <span aria-hidden="true">{r.icon}</span>
                  {r.label}
                </dt>
                <dd className="mt-2 flex items-start gap-2.5 text-pretty text-body-sm font-medium text-background md:mt-0 md:gap-3">
                  <CircleCheck aria-hidden="true" className="mt-[2px] h-[18px] w-[18px] shrink-0 text-success-bright" />
                  {r.text}
                </dd>
              </div>
            ))}
          </dl>

          <a
            href="#quote"
            className="focus-ring-solid mt-6 flex h-control-lg w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover sm:w-auto sm:inline-flex md:mt-8"
          >
            Get my free quote
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
