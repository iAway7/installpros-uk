import { whatsappUrl } from "@/lib/funnel/contact";
import { ProcessStepsSection, type ProcessStep } from "./process-steps-section";

/**
 * How it works on the Hikvision page. A copy of
 * security-how-it-works-section.tsx (the live Ajax page) on the same shared
 * ProcessStepsSection.
 *
 * Photos on WhatsApp are the first step because they worked in the chats and
 * paid surveys lost leads ("Sorry we dont work with companies that charge for
 * quotes"). No competitor of the eleven reviewed offers a quote from photos.
 * Jordan's question 7 confirms it; 11 confirms the 7 days.
 */

const STEPS: ProcessStep[] = [
  { title: "Tell us what to cover", detail: "Send a few photos on WhatsApp: the front, the drive, the back." },
  { title: "Get your quote", detail: "The same day. One price for the cameras, the recorder and the fitting." },
  { title: "Professionally fitted", detail: "Usually within 7 days, by a DBS checked engineer." },
  { title: "Live on your phone", detail: "Every camera tested, the app on your phones, recordings checked." },
];

export function HikvisionHowItWorksSection() {
  return (
    <ProcessStepsSection
      eyebrow="How it works"
      heading={
        <>
          From photos to cameras,
          <br className="hidden md:block" /> usually within 7 days.
        </>
      }
      subline="Most homes quoted from photos, no visit needed. [Jordan Q7]"
      steps={STEPS}
      cta={{
        label: "Send photos on WhatsApp",
        href: whatsappUrl("Hi, I'd like a quote for Hikvision cameras. Here are photos of where I'd like them."),
      }}
    />
  );
}
