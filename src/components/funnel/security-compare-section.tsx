import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  PhoneCall,
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
 * Until 20 October it was a table against "A kit you fit yourself". That day
 * Jordan rewrote the rows and asked whether the DIY column was needed; Gus
 * took it out, then asked for cards, then for fewer. Four stay, the ones
 * that carry weight: when it is fitted, how it is handed over, who answers
 * afterwards and the warranty (Jordan's answer of 15 October), titled as
 * benefits. "Choosing the kit" and "Placing it" went, being what any
 * installer would say; set-up is in How it works, adding to it later in the
 * FAQ. Two by two, icon on top in a rounded square. No "few hours": some
 * jobs run over a day. No price: the quotes rarely list the same devices,
 * so a figure would mislead.
 */

type Row = { icon: ReactNode; label: string; text: string };

const ICON = "h-4 w-4 shrink-0";

const ROWS: Row[] = [
  { icon: <CalendarClock className={ICON} />, label: "Fitted fast", text: "Usually within 7 days of your go\u2011ahead" },
  { icon: <BadgeCheck className={ICON} />, label: "Tested before we leave", text: "Every device checked, then a full system handover" },
  { icon: <PhoneCall className={ICON} />, label: "Your own account manager", text: "A dedicated contact for tech support once it is fitted" },
  // Jordan, 15 October: 2 or 5 years on the workmanship, the maker's on the kit.
  { icon: <ShieldCheck className={ICON} />, label: "Kit and fitting guaranteed", text: "2 years on our fitting, extendable to 5, plus Ajax's warranty on the kit" },
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

        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-3 sm:auto-rows-fr sm:grid-cols-2 sm:gap-4 md:mt-16">
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
