import { whatsappUrl } from "@/lib/funnel/contact";
import { ProcessStepsSection, type ProcessStep } from "./process-steps-section";

/**
 * How it works, on the shared ProcessStepsSection, like the Hikvision page.
 *
 * Step 4 offers the phone fitted on the Starlink install day, which no
 * competitor sells (0 of 12) and every VoIP buyer in the chats was a
 * Starlink customer. It waits on Will's question 6, as does "arrives ready".
 * No "within 7 days" (his WordPress page says it) and no transfer time.
 */

const STEPS: ProcessStep[] = [
  { title: "Tell us what you need", detail: "Here or on WhatsApp." },
  { title: "Your price, the same day", detail: "For the phone and the line." },
  { title: "We set it up", detail: "And start moving your number." },
  { title: "Your phone arrives ready", detail: "Or our engineer fits it on your Starlink day." },
];

export function VoipHowItWorksSection() {
  return (
    <ProcessStepsSection
      eyebrow="How it works"
      heading={
        <>
          From your old line
          <br className="hidden md:block" /> to your new phone.
        </>
      }
      steps={STEPS}
      cta={{
        label: "Ask on WhatsApp",
        href: whatsappUrl("Hi, I'd like to keep my landline number with a new phone."),
      }}
    />
  );
}
