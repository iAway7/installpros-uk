import { Headset, PlusCircle, Smartphone, Wrench } from "lucide-react";
import type { Feature } from "./why-installpros-section";

/**
 * "Why InstallPros" cards for the Ajax landing, fed to the shared
 * WhyInstallProsSection unchanged.
 *
 * In their own file rather than next to COMMERCIAL_FEATURES and the rest in
 * why-installpros-section.tsx, because that file renders on /install-quote and
 * is not edited for another page.
 *
 * Will's fourth question, 13 October 2026: "Services we provide after
 * installation to warrant our upfront cost". With no monthly fee, the upfront
 * price has to be seen to buy something beyond the box, so the four cards are
 * the visit and what comes after it. "Fitted in a Day" is Will's process
 * ("install is complete within a day").
 *
 * PENDING: Will has not listed the after-install services. These four are
 * what the rest of his answer implies. A warranty length, remote support or a
 * yearly check, if they exist, belong here and would be stronger than any of
 * them.
 */

const ICON = "h-[21px] w-[21px]";

export const SECURITY_FEATURES: Feature[] = [
  {
    t: "Fitted in a Day",
    d: "One visit, no survey before it. Every device placed, paired and tested before we leave.",
    i: <Wrench className={ICON} strokeWidth={1.5} aria-hidden="true" />,
  },
  {
    t: "Set Up for Everyone",
    d: "The app on each phone, every user added, and arming shown until it is second nature.",
    i: <Smartphone className={ICON} strokeWidth={1.5} aria-hidden="true" />,
  },
  {
    t: "Support After",
    d: "Real engineers on the phone after the install, from the same team that fitted it.",
    i: <Headset className={ICON} strokeWidth={1.5} aria-hidden="true" />,
  },
  {
    t: "Add to It Later",
    d: "Another detector or a camera is a short visit, not a rewire.",
    i: <PlusCircle className={ICON} strokeWidth={1.5} aria-hidden="true" />,
  },
];
