"use client";

import { Cctv, Headset, Network } from "lucide-react";

/**
 * First step of the managed service forms: one tap, before the postcode. A
 * copy of voip-need-step.tsx.
 *
 * Why "What do you need?" (managed-research, 3 November 2026; cut from "What
 * does your connection need to run?" on 4 November, Gus: too long): people
 * ask for a "static IP" when what they need is a job done, and many of those
 * jobs work without one. Monitored CCTV or an alarm (7
 * threads), an office VPN or remote access (4), or simply someone to call
 * when it drops (5, the top complaint). No competitor form asks it. The
 * answer tells the team whether to check the camera recorder or the VPN
 * first.
 *
 * Stored as leads.need (migration 0026). The words Will's Zap gets are
 * NEED_LABEL in lib/webhooks/formats/zapier.ts, which keep the longer
 * wording so the team knows what was picked.
 */
export type ManagedNeed = "cctv" | "vpn" | "support";

const OPTIONS: { value: ManagedNeed; label: string; icon: React.ReactNode }[] = [
  { value: "cctv", label: "CCTV or alarms", icon: <Cctv className="h-5 w-5" /> },
  { value: "vpn", label: "Office VPN", icon: <Network className="h-5 w-5" /> },
  { value: "support", label: "Support", icon: <Headset className="h-5 w-5" /> },
];

export function ManagedNeedStep({
  name,
  onChoose,
  className = "",
}: {
  /** Radio group name; must differ between the two forms on the page. */
  name: string;
  onChoose: (need: ManagedNeed) => void;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h2 id={`${name}-label`} className="h2-form text-white">
          What do you need?
        </h2>
      </div>
      <div role="group" aria-labelledby={`${name}-label`} className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-3 sm:gap-3">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChoose(o.value)}
            className="focus-ring-solid flex min-h-[56px] items-center gap-3 rounded-lg border-[length:var(--border-control)] border-white/80 bg-white px-4 py-3 text-left text-body-sm font-semibold leading-tight text-foreground transition-all duration-quick ease-ds hover:border-white hover:bg-secondary min-[400px]:min-h-[92px] min-[400px]:flex-col min-[400px]:justify-center min-[400px]:gap-1.5 min-[400px]:px-2 min-[400px]:text-center sm:text-body"
          >
            <span aria-hidden="true" className="text-brand-icon">{o.icon}</span>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
