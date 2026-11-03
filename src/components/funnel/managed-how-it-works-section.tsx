import { whatsappUrl } from "@/lib/funnel/contact";
import { ProcessStepsSection, type ProcessStep } from "./process-steps-section";

/**
 * How it works, on the shared ProcessStepsSection, like the VoIP page. The
 * check comes before the kit, as everywhere on this page.
 */

const STEPS: ProcessStep[] = [
  { title: "Tell us what you run", detail: "Here or on WhatsApp." },
  { title: "We check what you need", detail: "Fixed IP or not, backup or not." },
  { title: "We fit it", detail: "The dish, our router, and the backup if you need it." },
  { title: "One number to call", detail: "For anything, after that." },
];

export function ManagedHowItWorksSection() {
  return (
    <ProcessStepsSection
      eyebrow="How it works"
      heading={
        <>
          From what you run
          <br className="hidden md:block" /> to a connection that runs it.
        </>
      }
      steps={STEPS}
      cta={{
        label: "Ask on WhatsApp",
        href: whatsappUrl("Hi, I'd like to talk about managed Starlink for my business."),
      }}
    />
  );
}
