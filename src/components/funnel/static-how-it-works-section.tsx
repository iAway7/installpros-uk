import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { Button } from "@/components/system/button";

/**
 * How it works, for somebody who is not at the caravan.
 *
 * HowItWorksSection on the vehicle page opens with "Send a photo of the roof",
 * and on this segment that step is where the conversations die. Roughly fifty
 * of the 175 static threads end on a park name, a postcode or a photo request
 * with no price ever arriving, and the reason is in the transcripts: a static
 * caravan owner is usually at home when they enquire, not at the van.
 *
 *   "Ok. We've decided not to go to our caravan today and won't be going for
 *    2 weeks, do I need to send you a picture of the caravan next time I'm
 *    down ?"
 *   "Got no pictures in my foam as I am not at home at the moment"
 *   "Don't have photos, it's a caravan"
 *
 * So the order is reversed against the vehicle page. The park and the make of
 * the unit are enough for a price, and the photograph moves to the step where
 * it is actually possible. The analysis asks for exactly this: let them get a
 * ballpark without being at the caravan.
 *
 * PENDING: step two says the price comes back the same day. That is the
 * promise the vehicle page makes and it is the one thing here that is an
 * operational commitment rather than a description. Confirm it holds for this
 * segment, where the quote needs a park lookup rather than a roof photo.
 */

const WHATSAPP_URL =
  "https://wa.me/447446112343?text=" +
  encodeURIComponent(
    "Hi, I'd like a price for Starlink at my static caravan. Park name and postcode to follow.",
  );

type Step = { title: string; detail: string };

const STEPS: Step[] = [
  {
    title: "Tell us the park and the unit",
    // The two facts that are in the customer's head at home. 25 of 175 are
    // enquiring because they have just bought the van or are moving onto a
    // park, so they know the park before they know anything else.
    detail: "Park name, postcode, and what the unit is. No photos yet.",
  },
  {
    title: "Get a price back",
    detail: "One figure for the fitting, spread if you want it.",
  },
  {
    title: "Photos when you are next down",
    // The step that used to be first. It is not a blocker here, it is a
    // confirmation, so it sits after the number the customer came for.
    detail: "One outside, one of where the router goes. We confirm the mount.",
  },
  {
    title: "Fitted in a day, tested before we go",
    detail: "Account set up with you, and we show you the pause button.",
  },
];

export function StaticHowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 h2-section text-foreground">
            A price without a trip to the van.
          </h2>
          <p className="mt-5 text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            Most people ask from home, weeks before they are next down. That is enough.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t border-border pt-6">
              <span className="text-label font-semibold uppercase tracking-[0.14em] text-muted-foreground tabular-nums">
                Step {i + 1}
              </span>
              <h3 className="mt-3 text-lead font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-body-sm leading-[1.65] text-muted-foreground">{s.detail}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Button asChild size="lg">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="mr-2 h-5 w-5" />
              Send your park name
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
