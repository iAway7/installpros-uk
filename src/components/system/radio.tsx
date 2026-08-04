"use client";

import { createContext, useContext, useId } from "react";
import { cn } from "@/lib/utils";

interface Ctx {
  name: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}
const RadioCtx = createContext<Ctx | null>(null);

/**
 * Single choice from a small set of plain-text options.
 *
 * Native inputs inside a fieldset, so arrow keys, the click region and the
 * group announcement are the browser's job rather than ours. Selection uses
 * --selection, never brand red.
 *
 * For options that need a description or an icon, use Choicebox instead.
 */
export function RadioGroup({
  label,
  showLabel = false,
  value,
  onChange,
  disabled = false,
  required = false,
  name,
  className,
  children,
}: {
  /** Names what is being chosen. Announced before every option. */
  label: string;
  showLabel?: boolean;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  /** Required belongs on the group — a single required radio is meaningless. */
  required?: boolean;
  name?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const auto = useId();
  return (
    <RadioCtx.Provider value={{ name: name ?? auto, value, onChange, disabled }}>
      <fieldset className={className} aria-required={required || undefined}>
        <legend className={cn("mb-3 text-[15px] font-semibold text-foreground", !showLabel && "sr-only")}>
          {label}
          {required && showLabel && <span className="ml-1 text-error">*</span>}
        </legend>
        <div className="flex flex-col gap-3">{children}</div>
      </fieldset>
    </RadioCtx.Provider>
  );
}

export function RadioGroupItem({
  value,
  disabled = false,
  children,
}: {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const ctx = useContext(RadioCtx);
  if (!ctx) throw new Error("RadioGroupItem must be used inside RadioGroup");
  const off = disabled || ctx.disabled;
  const checked = ctx.value === value;

  return (
    <label className={cn("group inline-flex cursor-pointer items-center gap-2.5", off && "cursor-not-allowed opacity-50")}>
      <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          type="radio"
          name={ctx.name}
          value={value}
          checked={checked}
          disabled={off}
          onChange={() => ctx.onChange(value)}
          className={cn(
            "peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 bg-white transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[hsl(var(--selection)/0.4)]",
            checked ? "border-selection" : "border-field group-hover:border-field-hover",
            off && "cursor-not-allowed",
          )}
        />
        {checked && <span aria-hidden className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-selection" />}
      </span>
      <span className="text-[15px] text-foreground">{children}</span>
    </label>
  );
}

/** Unlabelled radio for custom rows. Needs an aria-label naming the choice. */
export function Radio({
  checked,
  onChange,
  disabled,
  "aria-label": ariaLabel,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  "aria-label": string;
}) {
  return (
    <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
      <input
        type="radio"
        aria-label={ariaLabel}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className={cn(
          "peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 bg-white transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[hsl(var(--selection)/0.4)]",
          checked ? "border-selection" : "border-field hover:border-field-hover",
          disabled && "cursor-not-allowed opacity-50",
        )}
      />
      {checked && <span aria-hidden className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-selection" />}
    </span>
  );
}
