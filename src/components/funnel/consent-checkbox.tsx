"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * GDPR consent checkbox shown on the final step of each lead form. Must be
 * ticked before the quote can be submitted. Selection uses dark neutral
 * (#1A1512), never brand red — red is reserved for the primary button.
 */
export function ConsentCheckbox({
  checked,
  onChange,
  tone = "light",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  /** "light" = on light card (dark text); "dark" = on dark hero (light text). */
  tone?: "light" | "dark";
}) {
  const textClass = tone === "dark" ? "text-white/80" : "text-muted-foreground";
  const dark = tone === "dark";

  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-left">
      <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-label="Accept terms and GDPR consent"
          className={cn(
            "peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 bg-white transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#1A1512]/40",
            dark
              ? "border-white/50 bg-transparent checked:border-white checked:bg-white"
              : "border-neutral-300 hover:border-neutral-500 checked:border-[#1A1512] checked:bg-[#1A1512]",
          )}
        />
        <Check
          className={cn(
            "pointer-events-none absolute h-3.5 w-3.5 opacity-0 transition-opacity peer-checked:opacity-100",
            dark ? "text-[#1A1512]" : "text-white",
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
          className="font-medium text-primary underline underline-offset-2"
        >
          terms and conditions
        </a>
        .
      </span>
    </label>
  );
}
