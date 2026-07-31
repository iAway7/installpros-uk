"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * GDPR consent checkbox shown on the final step of each lead form. Must be
 * ticked before the quote can be submitted — it is never pre-checked.
 *
 * Selection uses the neutral --selection token, never brand red: red is
 * reserved for the primary button. When `error` is set (the user tried to
 * submit without consenting) the box turns --error and the message is wired to
 * the input via aria-describedby.
 */
export function ConsentCheckbox({
  checked,
  onChange,
  tone = "light",
  error = false,
  id = "gdpr-consent",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  /** "light" = on light card (dark text); "dark" = on dark hero (light text). */
  tone?: "light" | "dark";
  /** Shows the error treatment after a blocked submit. */
  error?: boolean;
  id?: string;
}) {
  const dark = tone === "dark";
  const textClass = dark ? "text-white/80" : "text-muted-foreground";
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 text-left">
        <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-label="Accept terms and GDPR consent"
            aria-invalid={error || undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 bg-white transition-colors",
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
          By providing your details, you have consented to being contacted by Install Pros in accordance with GDPR. Read
          our{" "}
          <a
            href="https://installpros.co.uk/terms-and-conditions/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "font-medium underline underline-offset-2 transition-colors",
              // On the dark hero the brand red only hits 3.4:1 — use white
              // there and keep the red for light surfaces.
              dark ? "text-white hover:text-white/80" : "text-primary hover:text-brand-hover",
            )}
          >
            terms and conditions
          </a>
          .
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
