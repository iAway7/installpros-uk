import { Check, Minus } from "lucide-react";

/**
 * What the installation pays for: fitted by us against a kit you fit yourself.
 *
 * This replaced a smart-versus-standard table (against a monitored alarm
 * contract) on 14 October 2026, on the Superchat analysis of 125 security
 * purchase enquiries (ajax-research/superchat-security-insights.md):
 *
 *   - Nobody compared InstallPros with ADT or any monitored company. Will's
 *     question 3 appears in 0 purchase chats (his list comes from phone calls,
 *     which the data cannot see, so the question stays in the FAQ).
 *   - What buyers did compare with was doing it themselves: 10 raised a DIY
 *     kit, 7 asked to buy the kit and have it fitted or fit it themselves,
 *     and 7 objected to the installation line, a median 38% of the quote.
 *   - Will's question 4, what the upfront price buys after the install, is
 *     the same question asked the other way round.
 *
 * So the table answers the objection the chats actually raise: the right-hand
 * column is a kit bought online, not a rival company, which also keeps it
 * clear of the UK rules on naming competitors. Every left-hand row is
 * something the quotes or Will's process already include. No price: the kit
 * and our quote are rarely the same list of devices, so a figure would
 * compare unlike with unlike.
 */

type Row = { label: string; ours: string; theirs: string };

const ROWS: Row[] = [
  { label: "Choosing the kit", ours: "Specified for your doors, windows and rooms", theirs: "You work out what you need" },
  { label: "Placing it", ours: "Sited to cover the ways in, set for your pets", theirs: "You place and tune each device" },
  { label: "Setting it up", ours: "App, users and arming modes done before we leave", theirs: "You set up the app and pair every device" },
  { label: "Testing", ours: "Every device walk-tested on the day", theirs: "Up to you" },
  { label: "Your time", ours: "One visit, usually a few hours", theirs: "As long as it takes you" },
  { label: "If something goes wrong", ours: "The team that fitted it, on the phone", theirs: "The manufacturer's helpline" },
  { label: "Adding to it later", ours: "A short visit, no rewiring", theirs: "Another job for you" },
];

export function SecurityCompareSection() {
  return (
    <section id="installation" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Fitted, not flat-packed</p>
          <h2 className="mt-4 h2-section text-foreground">
            What the installation
            <br className="hidden sm:block" /> pays for.
          </h2>
          <p className="mt-5 text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            You can buy Ajax kit online and fit it yourself. What you pay us for is everything after the box, and
            someone to call when you need us.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-border bg-background md:mt-16">
          {/* Column heads. On phones the row label sits above its two cells,
              so the heads only need the two value columns; from md the label
              gets a column of its own. */}
          <div className="grid grid-cols-2 md:grid-cols-[0.9fr_1.2fr_1.2fr]">
            <div className="hidden md:block" />
            <div className="bg-primary/[0.05] px-4 py-4 md:px-6">
              <p className="text-body-sm font-semibold text-foreground md:text-body">Fitted by us</p>
            </div>
            <div className="px-4 py-4 md:px-6">
              <p className="text-body-sm font-semibold text-muted-foreground md:text-body">A kit you fit yourself</p>
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
      </div>
    </section>
  );
}
