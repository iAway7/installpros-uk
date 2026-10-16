"use client";

import { ArrowRight, Cctv, ShieldCheck, Siren } from "lucide-react";

/**
 * First step of the Ajax funnels: one tap, before the postcode.
 *
 * Why it exists (ajax-research/, 14 October 2026):
 *   - "Check Availability" is a Starlink question. The first step still has
 *     to be easy, and a tap is easier than typing a postcode.
 *   - The chats split three ways: 54 of 125 security buyers wanted cameras
 *     only, 35 an alarm only, 29 both. The answer is what the quote needs.
 *   - It replaces the team's opening question, "intruder alarm / cctv /
 *     hybrid?", which confused people ("Can you please explain what a hybrid
 *     set up is please.").
 *   - It measures demand from the page, which decides whether a fixed camera
 *     package is worth it.
 *
 * "What do you need?" rather than "What do you want to protect your home
 * with?": 17 characters, the length "Check Availability" had, so the step is
 * one heading line and one row of three options on a 375 phone, and the form
 * keeps its height. Choosing advances on its own; there is no Next button.
 *
 * Plain buttons rather than the design system's FormOption. FormOption is a
 * radio card with a tick circle, which says "pick one, then press Next"; here
 * the tap is the answer, and in the closing form's narrower card the circle
 * collided with the icon at 375. FormOption is shared with /install-quote, so
 * it is not the place to change that.
 *
 * Under the chips, when the form passes `onRepair`, one small line:
 * "Existing system not working?" (17 October). Someone whose system has
 * stopped working finds none of the three chips is theirs, and used to
 * answer wrong or leave. It is a button, not a link: the form skips this step
 * with the intent set to "repair" and no need, then runs as normal.
 */

export type SecurityNeed = "alarm" | "cameras" | "both";

export const SECURITY_NEED_LABEL: Record<SecurityNeed, string> = {
  alarm: "Alarm",
  cameras: "Cameras",
  both: "Both",
};

const OPTIONS: { value: SecurityNeed; icon: React.ReactNode }[] = [
  { value: "alarm", icon: <Siren className="h-5 w-5" /> },
  { value: "cameras", icon: <Cctv className="h-5 w-5" /> },
  { value: "both", icon: <ShieldCheck className="h-5 w-5" /> },
];

export function SecurityNeedStep({
  tone,
  name,
  onChoose,
  onRepair,
  className = "",
}: {
  /** "dark" for the hero, "light" for the closing form. */
  tone: "dark" | "light";
  /** Radio group name; must differ between the two forms on the page. */
  name: string;
  onChoose: (need: SecurityNeed) => void;
  /** Shows "Existing system not working?" under the chips. */
  onRepair?: () => void;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h2 id={`${name}-label`} className={`h2-form ${tone === "dark" ? "text-white" : "text-foreground"}`}>
          What do you need?
        </h2>
      </div>
      <div role="group" aria-labelledby={`${name}-label`} className="grid grid-cols-3 gap-2 sm:gap-3">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChoose(o.value)}
            className={`focus-ring-solid flex h-[76px] flex-col items-center justify-center gap-1.5 rounded-lg border-[length:var(--border-control)] text-body font-semibold transition-all duration-quick ease-ds sm:h-20 ${
              tone === "dark"
                ? "border-white/80 bg-white text-foreground hover:border-white hover:bg-secondary"
                : "border-field bg-background text-foreground hover:border-selection-border hover:bg-card"
            }`}
          >
            <span aria-hidden="true" className="text-brand-icon">{o.icon}</span>
            {SECURITY_NEED_LABEL[o.value]}
          </button>
        ))}
      </div>
      {onRepair && (
        <div className="text-center">
          <button
            type="button"
            onClick={onRepair}
            className={`focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-md px-2 text-body-sm font-medium underline-offset-4 transition-colors duration-quick ease-ds hover:underline ${
              tone === "dark" ? "text-white/65 hover:text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Existing system not working?
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
