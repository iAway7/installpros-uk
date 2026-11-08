"use client";

import { Snail, SignalMedium, WifiOff, Unplug } from "lucide-react";

/**
 * First step of the 4G/5G and fibre forms: one tap, before the postcode. A
 * copy of voip-need-step.tsx, with four answers in a 2 by 2 grid.
 *
 * Why "What's your internet now?" (4g-5g-fibre-research, section 1): nobody
 * in the chats asks InstallPros to install 4G/5G or fibre; about 380 describe
 * the connection they want to leave. The answers are theirs, in order of how
 * often they come up: slow copper or part-fibre (about 260), a 4G/5G box or
 * SIM router (about 150), nothing yet (new builds, just moved in), and a line
 * that drops, which is where the 8 who wanted a backup started. Only one of
 * 15 competitors asks anything like it.
 *
 * Stored as leads.need (migration 0027). The words Will's Zap gets are
 * NEED_LABEL in lib/webhooks/formats/zapier.ts.
 */
export type ConnectivityNeed = "slow_line" | "mobile" | "no_line" | "fibre_drops";

const ICON = "h-5 w-5";

const OPTIONS: { value: ConnectivityNeed; label: string; icon: React.ReactNode }[] = [
  { value: "slow_line", label: "Slow broadband", icon: <Snail className={ICON} /> },
  { value: "mobile", label: "4G or 5G", icon: <SignalMedium className={ICON} /> },
  { value: "no_line", label: "Nothing yet", icon: <WifiOff className={ICON} /> },
  { value: "fibre_drops", label: "Fibre that drops", icon: <Unplug className={ICON} /> },
];

export function ConnectivityNeedStep({
  name,
  onChoose,
  className = "",
}: {
  /** Radio group name; must differ between the two forms on the page. */
  name: string;
  onChoose: (need: ConnectivityNeed) => void;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h2 id={`${name}-label`} className="h2-form text-white">
          What&apos;s your internet now?
        </h2>
      </div>
      <div role="group" aria-labelledby={`${name}-label`} className="grid grid-cols-2 gap-2 sm:gap-3">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChoose(o.value)}
            className="focus-ring-solid flex min-h-[64px] items-center justify-center gap-2.5 rounded-lg border-[length:var(--border-control)] border-white/80 bg-white px-3 py-3 text-center text-body-sm font-semibold leading-tight text-foreground transition-all duration-quick ease-ds hover:border-white hover:bg-secondary min-[350px]:text-body sm:min-h-[72px]"
          >
            <span aria-hidden="true" className="shrink-0 text-brand-icon">{o.icon}</span>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
