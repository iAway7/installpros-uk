"use client";

import { Cctv, Plus, Wrench } from "lucide-react";

/**
 * First step of the Hikvision funnels: one tap, before the postcode. A copy of
 * security-need-step.tsx, which the live Ajax page renders.
 *
 * Why three intents instead of Ajax's alarm / cameras / both
 * (hikvision-research/, 27 October 2026): everyone on this page wants
 * cameras, so that question answers itself. What splits them is whether they
 * already own a system. 81 chats wanted to buy cameras and 57 already had a
 * system (41 wanting it fixed or taken over, 16 adding cameras), most of
 * them Hikvision, and 12 of the 41 never got a reply.
 *
 * The answer is stored as leads.intent (migration 0022 already allows new,
 * add and repair) with no need. PENDING WILL: his Zap writes need and intent
 * into the Superchat list field "Security request", which has no "New system"
 * or "Add to what I have" option yet. Option A (this) asks him to add the
 * two; option B sends need "cameras" for the first two chips instead.
 */
export type HikvisionIntent = "new" | "add" | "repair";

export const HIKVISION_INTENT_LABEL: Record<HikvisionIntent, string> = {
  new: "New cameras",
  add: "Add to mine",
  repair: "Fix my system",
};

const OPTIONS: { value: HikvisionIntent; icon: React.ReactNode }[] = [
  { value: "new", icon: <Cctv className="h-5 w-5" /> },
  { value: "add", icon: <Plus className="h-5 w-5" /> },
  { value: "repair", icon: <Wrench className="h-5 w-5" /> },
];

/** Fired by the "Already have cameras?" section to open the closing form on
 *  the chip it names. Here rather than in hikvision-quote-form.tsx so the
 *  section does not pull the whole form into the page chunk. */
export const HIKVISION_INTENT_EVENT = "hikvision:intent";

export function HikvisionNeedStep({
  tone,
  name,
  onChoose,
  className = "",
}: {
  /** "dark" for the hero, "light" for the closing form. */
  tone: "dark" | "light";
  /** Radio group name; must differ between the two forms on the page. */
  name: string;
  onChoose: (intent: HikvisionIntent) => void;
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
            className={`focus-ring-solid flex h-[76px] flex-col items-center justify-center gap-1.5 rounded-lg border-[length:var(--border-control)] px-1 text-center text-body-sm font-semibold leading-tight min-[350px]:text-body transition-all duration-quick ease-ds sm:h-20 ${
              tone === "dark"
                ? "border-white/80 bg-white text-foreground hover:border-white hover:bg-secondary"
                : "border-field bg-background text-foreground hover:border-selection-border hover:bg-card"
            }`}
          >
            <span aria-hidden="true" className="text-brand-icon">{o.icon}</span>
            {HIKVISION_INTENT_LABEL[o.value]}
          </button>
        ))}
      </div>
    </div>
  );
}
