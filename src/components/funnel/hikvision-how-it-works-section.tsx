import { whatsappUrl } from "@/lib/funnel/contact";
import { ProcessStepsSection, type ProcessStep } from "./process-steps-section";

/**
 * Quote, booking and the day, on the shared ProcessStepsSection. Started as
 * a copy of security-how-it-works-section.tsx (the live Ajax page); rewritten
 * 27 October from the chats (hikvision-research/conversaciones-decision.md,
 * sections 1 and 8).
 *
 *   - Photos first: staff asked for them in 40 camera threads and 27 more
 *     sent them unasked; paid surveys lost leads. Owners are asked for the
 *     recorder's label, which tells the model and the free channels.
 *   - 32 threads were about booking and the day: how soon, how long, being
 *     home, payment holding the date, a move or building work ("first fix
 *     stage", "House is currently with scaffold"). So steps 3 and 4.
 *   - No "within 7 days": it held in 1 of 6 paid camera jobs. The figure
 *     comes back only if Jordan confirms one (question 11).
 *   - Step 4 carries what the old "What the fitting includes" cards said:
 *     aimed with you, tested, the app on your phones.
 *
 * Steps 3 and 4 and the subline assume answers Jordan has not given yet
 * (hikvision-research/supuestos-para-jordan.md).
 */

const STEPS: ProcessStep[] = [
  {
    title: "Send a few photos",
    detail: "Front, drive, back and side, on WhatsApp.",
  },
  {
    title: "Your quote, the same day",
    detail: "One upfront price, positions marked.",
  },
  {
    title: "Book your date",
    detail: "Around a move or building work.",
  },
  {
    title: "The day itself",
    detail: "A few hours. The app on your phone before we leave.",
  },
];

export function HikvisionHowItWorksSection() {
  return (
    <ProcessStepsSection
      eyebrow="How it works"
      heading={
        <>
          From a few photos
          <br className="hidden md:block" /> to cameras on your phone.
        </>
      }
      subline="Most homes quoted from photos. No visit."
      steps={STEPS}
      cta={{
        label: "Send photos on WhatsApp",
        href: whatsappUrl("Hi, I'd like a quote for Hikvision cameras. Here are photos of where I'd like them."),
      }}
    />
  );
}
