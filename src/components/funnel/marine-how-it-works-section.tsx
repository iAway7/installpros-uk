import { Anchor, Camera, CircleCheck, Receipt } from "lucide-react";
import { ProcessStepsSection, type ProcessStep } from "./process-steps-section";

/**
 * How it works, for somebody who may be hours from their boat.
 *
 * The photograph comes first here, the opposite of the statics page, because
 * for a boat it replaces the visit rather than delaying the price. The one
 * ready buyer the marine corpus lost (superchat-analysis/marine-questions-for-
 * will, finding 07) was a Fairline at Swanwick: mounting already solved, boat
 * spec known, a competitor on hold, and two and a half hours from his own
 * boat. He asked three times and the quote did not come fast enough.
 *
 *   "I just need a quote asap so I can make a decision for the original guys
 *    currently on hold"
 *   "What time is required, I'm a 2.5hr drive from the boat"
 *
 * A liveaboard is standing on the boat when they write; a coastal cruiser is
 * not. Two photos cover both, and a price the same day is what the lost
 * customer needed.
 *
 * Step three names the marina, the barrier and the gate code, because the
 * customer who bought at Tattenhall volunteered his barrier code unprompted so
 * the engineer could get in. It is an obstacle they are already worrying
 * about on our behalf.
 *
 * The layout is ProcessStepsSection, shared with the other segment landings;
 * this file is the data and the reasoning behind it. No `image` on any step:
 * there is not one photograph of a fitted boat, and the slot takes real ones
 * only.
 *
 * PENDING: the same-day price is an operational commitment, copied from the
 * vehicle and statics pages. Confirm it holds when the quote needs a boat
 * type rather than a roof photo.
 */

const WHATSAPP_URL =
  "https://wa.me/447446112343?text=" +
  encodeURIComponent(
    "Hi, I'd like a price for Starlink on my boat. Photos and the marina to follow.",
  );

const STEPS: ProcessStep[] = [
  {
    title: "Send two photos",
    detail: "One of the roof or the arch where it would sit, one of where the router goes. Say whether the boat moves.",
    icon: <Camera className="h-5 w-5" />,
  },
  {
    title: "Get a price back",
    detail: "The fitting, spread if you want it, and which Starlink plan fits. No survey visit first.",
    icon: <Receipt className="h-5 w-5" />,
  },
  {
    title: "Tell us how to reach the boat",
    detail: "Marina, berth, barrier code or pontoon key. We arrange a day the boat is there.",
    icon: <Anchor className="h-5 w-5" />,
  },
  {
    title: "Fitted at the berth, tested before we go",
    detail: "Mount, power, cable and router in one visit. Account set up with you, pause button shown.",
    icon: <CircleCheck className="h-5 w-5" />,
  },
];

export function MarineHowItWorksSection() {
  return (
    <ProcessStepsSection
      eyebrow="How it works"
      heading="A price before anyone drives to the marina."
      subline="You may be hours from the boat. Two photos are enough to price it."
      steps={STEPS}
      cta={{ label: "Send photos of your boat", href: WHATSAPP_URL }}
    />
  );
}
