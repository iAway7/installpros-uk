"use client";

import { Building2, HeartHandshake, User } from "lucide-react";

/**
 * First step of the digital landline forms: one tap, before the postcode. A
 * copy of hikvision-need-step.tsx, which the live Hikvision page renders.
 *
 * Why "Who's the phone for?" (voip-research, 2 November 2026): the buyer is
 * often not the user. Sons and daughters buy for parents aged 76 to 90, and
 * 10 of the 28 VoIP buyers were businesses, who ask about transfers and
 * several lines instead. No competitor page asks it. A link under the
 * buttons for managed service went on 3 November: Will wants managed service
 * on a page of its own.
 *
 * Stored as leads.need (migration 0025 allows self, relative and business,
 * and managed for that future page). The words Will's Zap gets are NEED_LABEL in
 * lib/webhooks/formats/zapier.ts.
 */
export type VoipNeed = "self" | "relative" | "business";

const OPTIONS: { value: VoipNeed; label: string; icon: React.ReactNode }[] = [
  { value: "self", label: "Me", icon: <User className="h-5 w-5" /> },
  { value: "relative", label: "A parent or relative", icon: <HeartHandshake className="h-5 w-5" /> },
  { value: "business", label: "My business", icon: <Building2 className="h-5 w-5" /> },
];

export function VoipNeedStep({
  name,
  onChoose,
  className = "",
}: {
  /** Radio group name; must differ between the two forms on the page. */
  name: string;
  onChoose: (need: VoipNeed) => void;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h2 id={`${name}-label`} className="h2-form text-white">
          Who&apos;s the phone for?
        </h2>
      </div>
      <div role="group" aria-labelledby={`${name}-label`} className="grid grid-cols-3 gap-2 sm:gap-3">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChoose(o.value)}
            className="focus-ring-solid flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-lg border-[length:var(--border-control)] border-white/80 bg-white px-2 py-3 text-center text-body-sm font-semibold leading-tight text-foreground transition-all duration-quick ease-ds hover:border-white hover:bg-secondary min-[350px]:text-body sm:min-h-20"
          >
            <span aria-hidden="true" className="text-brand-icon">{o.icon}</span>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
