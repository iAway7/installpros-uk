/**
 * What it costs, for static caravans, park homes and lodges.
 *
 * This is the section this page exists for. From 175 static conversations
 * (1 July to 21 September 2026, superchat-analysis/statics-questions-for-will):
 * 61 walked away on price, 43 of them named the up-front installation figure,
 * and 7 objected to the monthly. Six to one. Several say it in one sentence:
 * "The monthly payment is no problem but the instalation is lol". They are not
 * a cheap segment. They will pay a monthly. What they will not do is hand over
 * four figures for a unit they visit at weekends.
 *
 * So the objection is a structure problem, not a price problem, and the fix is
 * structural: the fitting and the plan side by side, the fitting spreadable,
 * and the monthly pausable. Thirteen asked to spread the cost and most were
 * offered nothing back.
 *
 * Three more findings are answered here rather than in the FAQ, because each
 * one killed conversations before anyone reached a FAQ:
 *
 *  - The neighbour's price. Forty of the 175 came because a neighbour has one,
 *    14 quote a specific number the neighbour paid, and in two of those the
 *    neighbour is our own customer on the same park. Five never wrote again
 *    after making the comparison. Whatever is quoted at one pitch is the
 *    ceiling at the next within days, so the figure goes on the page.
 *  - The season. Twenty two are part-year, several parks close for winter, and
 *    only two knew to ask about pausing. One of them is already paying us.
 *  - The advert. Eighteen arrived having seen £40 a month with free
 *    installation somewhere and read our quote as a bait and switch.
 *
 * NO FIGURES ON THIS SECTION, and that is the point rather than a gap. The
 * analysis says the objection is structural, not a price problem: 43 of the 61
 * who walked named the installation fee while 7 named the monthly, and two of
 * the five conversations that converted were closed by framing the cost rather
 * than cutting it. So the section argues the structure. One payment to us that
 * can be spread, one to Starlink that can be stopped, and the number arrives in
 * the quote where it is specific to the unit and the park.
 *
 * PENDING: the payment terms. Half now and half after fitting, or three
 * payments with no interest, comes from the vehicle analysis rather than this
 * corpus. Confirm it applies here before this ships.
 */

type Fact = { title: string; detail: string };

const FACTS: Fact[] = [
  {
    title: "Pause it out of season",
    // 22 of 175 are part-year. Only 2 knew to ask.
    detail: "Starlink bills every thirty days and pauses from the app. Close the van up, turn it off.",
  },
  {
    title: "Same price as the next pitch",
    // 14 quote a neighbour's number, twice our own customer's.
    detail: "One figure for a static install. If a neighbour paid something else, ask and we show you why.",
  },
  {
    title: "Two payments, not one",
    // The bait-and-switch reading behind the 18 who saw an advert.
    detail: "Us once for the fitting, Starlink monthly for the plan. Free installation usually means self-install.",
  },
  {
    title: "No survey fee",
    detail: "Mount, cabling, power, router sited and tested. Nothing added on the day.",
  },
];

export function StaticCostSection() {
  return (
    <section id="what-it-costs" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">What it costs</p>
          <h2 className="mt-4 h2-section text-foreground">Paid once, then paused when you close up.</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-6 md:p-8">
            <p className="text-label font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              The fitting, once
            </p>
            <p className="mt-3 stat-xl text-foreground">Paid to us</p>
            <p className="mt-2 text-lead font-semibold text-foreground">Spread it if you want</p>
            <p className="mt-3 text-body-sm leading-[1.65] text-muted-foreground">
              Kit, mount, cabling, power and setup. In full, half and half, or three payments with
              no interest.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-6 md:p-8">
            <p className="text-label font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              The plan, monthly
            </p>
            <p className="mt-3 stat-xl text-foreground">Paid to Starlink</p>
            <p className="mt-2 text-lead font-semibold text-foreground">Pause it any month</p>
            <p className="mt-3 text-body-sm leading-[1.65] text-muted-foreground">
              A residential plan in your own account, billed every thirty days. We set it up with
              you and show you the pause button.
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
          {FACTS.map((f) => (
            <div key={f.title} className="border-t border-border pt-6">
              <h3 className="text-lead font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-body-sm leading-[1.65] text-muted-foreground">{f.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
