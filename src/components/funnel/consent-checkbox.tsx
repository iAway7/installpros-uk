"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Square opt-in checkbox for the lead forms. Now used for the OPTIONAL
 * marketing opt-in (never required — GDPR consent must be freely given). Pass a
 * custom `label` for the wording; falls back to the legacy contact text.
 *
 * Selection uses the neutral --selection token, never brand red: red is
 * reserved for the primary button.
 */
export function ConsentCheckbox({
  checked,
  onChange,
  tone = "light",
  error = false,
  id = "gdpr-consent",
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  /** "light" = on light card (dark text); "dark" = on dark hero (light text). */
  tone?: "light" | "dark";
  /** Shows the error treatment after a blocked submit. */
  error?: boolean;
  id?: string;
  /** Custom label content. Defaults to the legacy contact-consent copy. */
  label?: ReactNode;
}) {
  const dark = tone === "dark";
  const textClass = dark ? "text-white/80" : "text-muted-foreground";
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 text-left">
        {/* Two steps, and both are needed.
            1. Wrapper height = the first line box (14px x leading-relaxed
               1.625 = 22.75px), so `items-center` centres the box on line one
               regardless of how many lines the label wraps to.
            2. A 2px optical nudge down. This typeface has a tall ascender and a
               short descender, so glyphs sit low inside the line box and a
               mathematically centred square reads as floating high. Optical
               centring beats metric centring for small squares next to text. */}
        <span className="relative inline-flex h-[22.75px] w-5 shrink-0 translate-y-[2px] items-center justify-center">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-invalid={error || undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              // NOTE: not `rounded-md`. --radius is 0.75rem, so `md` resolves to
              // 10px — exactly half of this 20px box, which renders a circle and
              // reads as a radio button. Consent needs a square box.
              "peer h-5 w-5 cursor-pointer appearance-none rounded-[5px] border-2 bg-white transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[hsl(var(--selection)/0.4)]",
              dark
                ? "border-white/50 bg-transparent checked:border-white checked:bg-white"
                : "border-field hover:border-field-hover checked:border-selection checked:bg-selection",
              // Error wins over the resting border until the box is ticked.
              error && !checked && "border-error",
            )}
          />
          <Check
            className={cn(
              "pointer-events-none absolute h-3.5 w-3.5 opacity-0 transition-opacity peer-checked:opacity-100",
              dark ? "text-selection" : "text-white",
            )}
            strokeWidth={3.5}
          />
        </span>
        <span className={cn("text-sm leading-relaxed", textClass)}>
          {label ?? (
            <>
              I agree to be contacted by Install Pros about my quote. Read our{" "}
              <a
                href="https://installpros.co.uk/terms-and-conditions/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "font-medium underline underline-offset-2 transition-colors",
                  dark ? "text-white hover:text-white/80" : "text-primary hover:text-brand-hover",
                )}
              >
                terms and conditions
              </a>
              .
            </>
          )}
        </span>
      </label>
      {error && !checked && (
        <p id={errorId} className={cn("mt-2 text-sm", dark ? "text-white" : "text-error")}>
          Please accept the terms to continue.
        </p>
      )}
    </div>
  );
}
