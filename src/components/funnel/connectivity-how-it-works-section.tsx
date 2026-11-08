import { whatsappUrl } from "@/lib/funnel/contact";
import { ProcessStepsSection, type ProcessStep } from "./process-steps-section";

/**
 * How it works, on the shared ProcessStepsSection, like the VoIP page.
 *
 * Step 2 is the check (fibre, mobile networks, the sky) that no competitor
 * shows; step 4 is the handover test of the backup, which nobody describes.
 * Both wait on Will's questions 3 and 5. No install time anywhere: fibre
 * dates are set by the provider, and nobody in the chats was promised one
 * for 4G/5G.
 */

const STEPS: ProcessStep[] = [
  { title: "Tell us what you have", detail: "Here or on WhatsApp." },
  { title: "We check your address", detail: "Fibre, mobile networks, the sky." },
  { title: "Your price, the same day", detail: "For the setup that works there." },
  { title: "We fit and test it", detail: "And show you the backup working." },
];

export function ConnectivityHowItWorksSection() {
  return (
    <ProcessStepsSection
      eyebrow="How it works"
      heading={
        <>
          From slow internet
          <br className="hidden md:block" /> to one that works.
        </>
      }
      steps={STEPS}
      cta={{
        label: "Ask on WhatsApp",
        href: whatsappUrl("Hi, my internet is poor and I'd like to know what would work at my address."),
      }}
    />
  );
}
