"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * An on/off setting that takes effect immediately — no Save button.
 *
 * Radix's Switch API (checked, onCheckedChange) without the package: the
 * dashboard already had two of these hand-rolled on a native button with
 * role="switch", which is all Radix renders too, so a dependency would have
 * bought nothing. What the two copies had wrong is what this fixes:
 *
 *  · Settings' toggle had no accessible name, only a title — a screen reader
 *    heard "switch, on" and nothing about what. `aria-label` (or a <label>
 *    pointing at the id) is required here.
 *  · Webhooks' switch put its state in its name ("Active" / "Paused"), so the
 *    name changed on every press. The name says what; aria-checked says state.
 *  · Both were green when on. Checked states use --selection, never a status
 *    colour or brand red, like every other selected control in the system.
 *
 * Off is field-hover, not a pale grey: the track is the control's boundary and
 * needs 3:1 against the page (WCAG 1.4.11). The thumb's position carries the
 * state; the colour only reinforces it.
 */
export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "role" | "type"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, disabled, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-quick",
        "focus-ring-solid disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-selection" : "bg-field-hover",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none block size-5 rounded-full bg-background shadow-raised transition-transform duration-quick ease-ds",
          checked ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  ),
);
Switch.displayName = "Switch";
