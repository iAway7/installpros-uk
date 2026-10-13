import { whatsappUrl } from "@/lib/funnel/contact";
import { ProcessStepsSection, type ProcessStep } from "./process-steps-section";

/**
 * How it works, for the Ajax landing. The layout is ProcessStepsSection, shared
 * with the other segment landings (never /install-quote); this file is the data.
 *
 * The four steps are the old Ajax page's own process, "we quote, supply and
 * install, usually within 7 days", split where the visitor does something
 * different. Seven days is the same lead time the vehicle, statics and boats
 * pages give, and Will's for this product.
 *
 * Step one asks about pets because the old FAQ makes pet-friendly detectors a
 * selling point, and it only works if the engineer knows before the visit.
 *
 * No `image` on any step: there is no photograph of an Ajax install yet, and
 * the slot takes real ones only.
 */

const STEPS: ProcessStep[] = [
  { title: "Tell us the property", detail: "Flat, house or business, the doors and floors, and any pets." },
  { title: "Get your quote", detail: "The kit and the fitting, before anything is ordered." },
  { title: "We supply and fit", detail: "Usually within 7 days. Wireless, so no rewiring." },
  { title: "Armed from your phone", detail: "Every detector tested, the app set up, your users added." },
];

export function SecurityHowItWorksSection() {
  return (
    <ProcessStepsSection
      eyebrow="How it works"
      heading={
        <>
          From quote to armed,
          <br className="hidden md:block" /> usually within 7 days.
        </>
      }
      subline="Tell us about the property and we do the rest."
      steps={STEPS}
      cta={{
        label: "Ask us on WhatsApp",
        href: whatsappUrl("Hi, I'd like a quote for an Ajax alarm."),
      }}
    />
  );
}
