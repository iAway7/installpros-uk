/**
 * What it costs, for boats.
 *
 * Second section on the page, straight after the mooring split, because the
 * two questions a boat owner asks first are how much to install and how much
 * a month, and in the twelve marine conversations (1 July to 21 September
 * 2026, superchat-analysis/marine-questions-for-will) the answer landed badly
 * more often than well: of the four who got a price, two walked on it and a
 * third went ahead only on finance.
 *
 *   "Hello Nathan we have had a discussion and unfortunately it is a lot more
 *    expensive than we thought"
 *   "Hi we are very interested just the initial outlay. We are saving up for."
 *   "Hi we just wanted to look at our options on the financing if that is
 *    possible?"
 *
 * The one who walked warmly ("your service has been excellent, will for sure
 * recommend your company") separates the price objection from a service one.
 * The houseboat that took finance is the counter-example: cash flow, not
 * price, and solved by spreading it. So the structure of the statics section
 * carries over: two payments, the fitting spreadable, the plan pausable.
 *
 * NO FIGURES, same decision as the cars and statics pages. The report asks
 * for an indicative price or a range, and that is the strongest ask in it
 * that this page does not meet. The number depends on the boat (a narrowboat
 * roof and a yacht's radar arch are different jobs) and no figure has been
 * agreed with Will for the segment. When one is, it goes in the first card.
 *
 * PENDING: the payment terms. Half now and half after fitting, or three
 * payments with no interest, comes from the vehicle analysis and was copied
 * to statics unconfirmed. Same caveat here.
 */

type Fact = { title: string; detail: string };

const FACTS: Fact[] = [
  {
    title: "Pause it for the months it sits",
    // Wroxham and the 98 per cent boat: out a few days at a time, laid up
    // part of the year.
    detail: "Starlink bills every thirty days and pauses from the app. Winter on the hard costs nothing.",
  },
  {
    title: "Spread the fitting",
    // The houseboat at Cuxton took finance and left a review naming the
    // engineer. Cash flow, not price.
    detail: "In full, half and half, or three payments with no interest. Ask when you ask for the price.",
  },
  {
    title: "Two payments, not one",
    detail: "Us once for the fitting, Starlink monthly for the plan. Free installation usually means self-install.",
  },
  {
    title: "Priced from photos, not a visit",
    // The Fairline at Swanwick: 2.5 hours from his own boat, a competitor on
    // hold, lost on the speed of the quote.
    detail: "Two photos of the boat and where the router goes. No survey fee, nothing added on the day.",
  },
];

export function MarineCostSection() {
  return (
    <section id="what-it-costs" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">What it costs</p>
          <h2 className="mt-4 h2-section text-foreground">Paid once, then paused when the boat is.</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-6 md:p-8">
            <p className="text-label font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              The fitting, once
            </p>
            <p className="mt-3 stat-xl text-foreground">Paid to us</p>
            <p className="mt-2 text-lead font-semibold text-foreground">Spread it if you want</p>
            <p className="mt-3 text-body-sm leading-[1.65] text-muted-foreground">
              Kit, mount, cabling, power and setup, at the berth. In full, half and half, or three
              payments with no interest.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-6 md:p-8">
            <p className="text-label font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              The plan, monthly
            </p>
            <p className="mt-3 stat-xl text-foreground">Paid to Starlink</p>
            <p className="mt-2 text-lead font-semibold text-foreground">Pause it any month</p>
            <p className="mt-3 text-body-sm leading-[1.65] text-muted-foreground">
              Residential if the boat stays put, Roam if it cruises. Your own account, billed every
              thirty days. We set it up with you and show you the pause button.
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
