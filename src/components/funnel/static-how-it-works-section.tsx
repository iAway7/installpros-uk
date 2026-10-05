import { Camera, CircleCheck, MapPin, Receipt } from "lucide-react";
import { ProcessStepsSection, type ProcessStep } from "./process-steps-section";

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
 * The layout is ProcessStepsSection, shared with the other segment landings;
 * this file is the data and the reasoning behind it. No `image` on any step:
 * there is not one photograph of a fitted static yet, and the slot takes real
 * ones only.
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

const STEPS: ProcessStep[] = [
  {
    title: "Tell us the park and the unit",
    // The two facts that are in the customer's head at home. 25 of 175 are
    // enquiring because they have just bought the van or are moving onto a
    // park, so they know the park before they know anything else.
    detail: "Park name, postcode, and what the unit is. No photos yet.",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    title: "Get a price back",
    detail: "One figure for the fitting, spread if you want it.",
    icon: <Receipt className="h-5 w-5" />,
  },
  {
    title: "Photos when you are next down",
    // The step that used to be first. It is not a blocker here, it is a
    // confirmation, so it sits after the number the customer came for.
    detail: "One outside, one of where the router goes. We confirm the mount.",
    icon: <Camera className="h-5 w-5" />,
  },
  {
    title: "Fitted in a day, tested before we go",
    detail: "Account set up with you, and we show you the pause button.",
    icon: <CircleCheck className="h-5 w-5" />,
  },
];

export function StaticHowItWorksSection() {
  return (
    <ProcessStepsSection
      eyebrow="How it works"
      heading="A price without a trip to the van."
      subline="Most people ask from home, weeks before they are next down. That is enough."
      steps={STEPS}
      cta={{ label: "Send your park name", href: WHATSAPP_URL }}
    />
  );
}
