import { Camera, CarFront, MapPin, Receipt } from "lucide-react";
import { ProcessStepsSection, type ProcessStep } from "./process-steps-section";

/**
 * PRE-FILLED for the same reason as the site approval pack on the commercial
 * page: the team lives in WhatsApp, and a message that already says what it is
 * about gets a quote back instead of a "what vehicle is it?" round trip. The
 * photo follows in the same thread, which is exactly how the won vehicle
 * conversations in the chat log went.
 */
const PHOTO_QUOTE_URL =
  "https://wa.me/447446112343?text=" +
  encodeURIComponent("Hi, I'd like a quote for Starlink on my vehicle. Photos of the roof and inside to follow.");

/**
 * Deliberately no town and no call-out figure here or anywhere on the page.
 *
 * The chat log has one vehicle sale lost to exactly that: an ad named a town,
 * the customer was two hundred miles away, and the conversation ended. Will's
 * own line in the chat is that a vehicle is done at the workshop or the team
 * comes to it, and the travel charge depends on where the vehicle is. So step
 * three states the two options and puts the decision, and any charge, in the
 * quote, where it is specific to the customer rather than a number that is
 * wrong for half of them.
 */
const STEPS: ProcessStep[] = [
  {
    title: "Send photos of the roof and inside",
    // Rails, seams and skylights decide the mount, so the roof shot answers
    // most of it. The inside was added on Will's ask (2026-09-29): "We need a
    // photo of the roof and the interior of the vehicle too. If it's a camper
    // van, a photo of the electrics/batteries etc is a huge bonus." The cable
    // run and where the router lands are quoted off that, and a campervan's
    // 12 V setup decides the power side.
    //
    // KNOWN TENSION, LEFT IN DELIBERATELY: this step is already where the
    // segment stalls. Fifteen of the thirty-six vehicle conversations were
    // open waiting on a photo, and this asks for more of them. Will needs
    // them to quote without a second round trip, and a quote that has to be
    // revised later costs more than a slower first message. If the step keeps
    // losing people, shrink what is REQUIRED here rather than dropping the
    // ask: roof and inside, with the campervan electrics as the bonus it is.
    //
    // "Batteries" is not in the copy because Will's own phrasing was
    // "electrics/batteries etc" and the electrics carry it.
    detail: "From a step or above, with the make and model. On a campervan, the electrics too.",
    icon: <Camera className="h-5 w-5" />,
    // This is the step the `image` slot was made for. When Will's "router
    // where it ends up" photograph arrives (asked 2026-09-29, still wanted in
    // install-gallery.tsx), it goes here and the tile gives way to it.
  },
  {
    title: "Get a fixed quote back",
    detail: "One price for the Mini, the mount and the fitting.",
    icon: <Receipt className="h-5 w-5" />,
  },
  {
    title: "Bring it in, or we come out",
    // Travel charge and which option applies are settled in the quote and in
    // the FAQ, not here. See the comment above.
    detail: "Most vehicles come to us; where that is not practical, we come out.",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    title: "Drive away connected",
    // From the campervan page on installpros.co.uk: two to five hours.
    detail: "Two to five hours, tested before you leave.",
    icon: <CarFront className="h-5 w-5" />,
  },
];

/**
 * How it works, in four steps.
 *
 * Replaces a two-column "where we fit it" section that did two jobs at once
 * (where the work happens, and what to send for a quote) and looked like it:
 * a three-line H2 to say "here or there", a card that ended two thirds of the
 * way down, and the third text list in a row on a page with no photographs.
 *
 * The vehicle conversations in the chat log are not lost on price, they are
 * lost on process: fifteen of thirty-six still open, waiting on a photo, a
 * mounting proposal or the vehicle itself. Four steps answer the process
 * question in one glance, fold the "where" into step three, and end on the
 * one action this segment converts on, which is sending a photo.
 *
 * The layout is ProcessStepsSection, shared with the statics and boats
 * landings, so the three say it the same way. Before that it was a vertical
 * stepper, and before that a row of four under hairlines; both are gone and
 * the reasons are in process-steps-section.tsx.
 */
export function HowItWorksSection() {
  return (
    <ProcessStepsSection
      eyebrow="How it works"
      heading="Quoted from photos. Fitted in a day."
      steps={STEPS}
      cta={{ label: "Send us your photos", href: PHOTO_QUOTE_URL }}
    />
  );
}
