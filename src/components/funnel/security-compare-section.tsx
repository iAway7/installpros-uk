import { Check, Minus } from "lucide-react";

/**
 * Smart against standard, and the money.
 *
 * Will's second and third questions, 13 October 2026: "Support costs: our big
 * win for residential is no monthly costs which justify our larger upfront",
 * and "How it differs from standard alarm companies such as ADT (smart alarm
 * vs standard alarm benefits)". One table answers both, because the monthly
 * fee is the first row of the difference.
 *
 * NO COMPANY IS NAMED. Will names ADT; the page does not. A comparison that
 * names a rival has to be verifiable line by line under UK advertising rules,
 * and "standard alarm" covers two different things anyway: one that only
 * rings, and one watched by a call centre on a contract. The intro says so,
 * and every cell on the right is hedged ("usually", "often") because
 * traditional alarms vary and some now have apps.
 *
 * PENDING: the competitor research in ajax-research/competitors.md checks
 * these lines against what ADT, Verisure and the rest actually sell. Adjust
 * the right-hand column to it before paid traffic.
 */

type Row = { label: string; ours: string; theirs: string };

const ROWS: Row[] = [
  { label: "Monthly cost", ours: "None. You pay once, upfront", theirs: "A monthly contract, if you want it watched" },
  { label: "When it goes off", ours: "An alert on every phone you choose", theirs: "A siren, or a call centre on a contract" },
  { label: "False alarms", ours: "A photo from the detector, in seconds", theirs: "Usually no way to check from away" },
  { label: "Arming", ours: "App, keypad or key fob, from anywhere", theirs: "Usually a keypad by the door" },
  { label: "Family and visitors", ours: "Their own access, temporary for visitors", theirs: "Usually one shared code" },
  { label: "Fitting", ours: "Wireless, fitted in a day", theirs: "Often wired, a cable to each sensor" },
];

export function SecurityCompareSection() {
  return (
    <section id="compare" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Smart vs standard</p>
          <h2 className="mt-4 h2-section text-foreground">
            Pay once.
            <br className="hidden sm:block" /> No monthly contract.
          </h2>
          <p className="mt-5 text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            A standard alarm either just rings, or is watched by a call centre for a monthly fee. An Ajax system tells
            you directly, and it is yours from the day it is fitted.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-border bg-background md:mt-16">
          {/* Column heads. On phones the row label sits above its two cells,
              so the heads only need the two value columns; from md the label
              gets a column of its own. */}
          <div className="grid grid-cols-2 md:grid-cols-[0.9fr_1.2fr_1.2fr]">
            <div className="hidden md:block" />
            <div className="bg-primary/[0.05] px-4 py-4 md:px-6">
              <p className="text-body-sm font-semibold text-foreground md:text-body">Ajax, fitted by us</p>
            </div>
            <div className="px-4 py-4 md:px-6">
              <p className="text-body-sm font-semibold text-muted-foreground md:text-body">A standard alarm</p>
            </div>
          </div>

          <dl>
            {ROWS.map((r) => (
              <div key={r.label} className="grid grid-cols-2 border-t border-border md:grid-cols-[0.9fr_1.2fr_1.2fr]">
                <dt className="col-span-2 px-4 pt-4 text-label font-semibold uppercase tracking-[0.12em] text-muted-foreground md:col-span-1 md:flex md:items-center md:px-6 md:py-5 md:text-body-sm md:normal-case md:tracking-normal md:text-foreground">
                  {r.label}
                </dt>
                <dd className="flex items-start gap-2 bg-primary/[0.05] px-4 pb-4 pt-2 text-body-sm font-medium text-foreground md:px-6 md:py-5">
                  <Check aria-hidden="true" className="mt-[3px] h-4 w-4 shrink-0 text-success" />
                  {r.ours}
                </dd>
                <dd className="flex items-start gap-2 px-4 pb-4 pt-2 text-body-sm text-muted-foreground md:px-6 md:py-5">
                  <Minus aria-hidden="true" className="mt-[3px] h-4 w-4 shrink-0 text-muted-foreground/60" />
                  {r.theirs}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mx-auto mt-5 max-w-4xl text-caption text-muted-foreground">
          Standard alarms vary, and some now offer an app or photo checks as part of a contract.
        </p>
      </div>
    </section>
  );
}
