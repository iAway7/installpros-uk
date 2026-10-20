import { whatsappUrl } from "@/lib/funnel/contact";
import { ProcessStepsSection, type ProcessStep } from "./process-steps-section";

/**
 * How it works, for the Ajax landing. The layout is ProcessStepsSection, shared
 * with the other segment landings (never /install-quote); this file is the data.
 *
 * The four steps are Will's process, 13 October 2026: "usually no survey is
 * required for this product/service and install is complete within a day,
 * lead time is the same as other install services, 7 days". No survey and
 * one day are the two things a homeowner weighing up an alarm would not
 * assume, so each gets a step of its own. Jordan added two on 15 October:
 * the price comes the same day, always, and the engineers are DBS checked.
 * Jordan again, 20 October: most homes are surveyed by video call but some
 * need a visit, and some jobs run over a day, so no "no survey" and no "one
 * day" anywhere.
 *
 * Step one asks about pets because pet-friendly detectors are a selling point,
 * and they only work if the engineer knows before the visit.
 *
 * No `image` on any step: there is no photograph of an Ajax install yet, and
 * the slot takes real ones only.
 */

const STEPS: ProcessStep[] = [
  { title: "Tell us about your home", detail: "The doors, windows and floors, and any pets. A call is enough." },
  { title: "Get your quote", detail: "The same day, after a video survey for most homes. One upfront price for the kit and the fitting." },
  { title: "Professionally fitted", detail: "Usually within 7 days, by a DBS checked engineer. Wireless, so no rewiring." },
  { title: "Armed from your phone", detail: "Every device tested, the app set up, your family added." },
];

export function SecurityHowItWorksSection() {
  return (
    <ProcessStepsSection
      eyebrow="How it works"
      heading={
        <>
          From quote to install,
          <br className="hidden md:block" /> usually within 7 days.
        </>
      }
      // 17 of the 53 who said why they were buying were moving in or
      // renovating, the biggest trigger in the chats ("Alarm is the first
      // thing to go in"), so the line speaks to them.
      subline="Most homes surveyed by video call. Moving house? Book it now for the week you get the keys."
      steps={STEPS}
      cta={{
        label: "Ask us on WhatsApp",
        href: whatsappUrl("Hi, I'd like a quote for an Ajax alarm."),
      }}
    />
  );
}
