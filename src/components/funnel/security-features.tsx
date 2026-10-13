import { Eye, Headset, PackageCheck, Smartphone } from "lucide-react";
import type { Feature } from "./why-installpros-section";

/**
 * "Why InstallPros" cards for the Ajax landing, fed to the shared
 * WhyInstallProsSection unchanged.
 *
 * In their own file rather than next to COMMERCIAL_FEATURES and the rest in
 * why-installpros-section.tsx, because that file renders on /install-quote and
 * is not edited for another page.
 *
 * Each card is a line from the old Ajax page, said plainly:
 *   Supplied and Fitted   "Complete Installation: supply, positioning, mounting"
 *   Discreet Placement    "Discreet Installs", cameras thieves will not notice
 *   Set Up and Tested     "configuration and test", plus the app
 *   Support After         "24/7 Support"
 *
 * PENDING: the old page says 24/7. Nobody has confirmed what that means for
 * alarms (a person answering at 3am, or the app), so the card promises the
 * team on the phone after the install and stops there.
 */

const ICON = "h-[21px] w-[21px]";

export const SECURITY_FEATURES: Feature[] = [
  {
    t: "Supplied and Fitted",
    d: "We source the Ajax kit and fit it, so one company answers for the parts and the work.",
    i: <PackageCheck className={ICON} strokeWidth={1.5} aria-hidden="true" />,
  },
  {
    t: "Discreet Placement",
    d: "Detectors and cameras sited to cover the way in, not where they are easiest to fix.",
    i: <Eye className={ICON} strokeWidth={1.5} aria-hidden="true" />,
  },
  {
    t: "Set Up and Tested",
    d: "Every detector tested, the app on your phone and your users added before we leave.",
    i: <Smartphone className={ICON} strokeWidth={1.5} aria-hidden="true" />,
  },
  {
    t: "Support After",
    d: "Real engineers on the phone long after the install, from the same team that fitted it.",
    i: <Headset className={ICON} strokeWidth={1.5} aria-hidden="true" />,
  },
];
