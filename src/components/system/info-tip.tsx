"use client";

import { useId, useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Small "what is this?" affordance for a field label: explains what the value
 * means and names the source it came from.
 *
 * Hover and keyboard focus open it; on touch, a tap toggles it (there is no
 * hover on a phone, and the lead panel is used on phones). Deliberately not a
 * Note — a Note is persistent and owns its row; this is an on-demand aside
 * that must not add height to a dense two-column grid.
 *
 * `align` decides which edge the bubble hangs from. The lead panel is narrow
 * (max-w-md) and its scroll container clips horizontally, so fields in the
 * right-hand column need align="end" or the bubble is cut off.
 */
export function InfoTip({
  text,
  source,
  align = "start",
  className,
}: {
  /** One sentence: what this value is, and why it matters. */
  text: string;
  /** Where the data came from — "Ofcom Connected Nations", "Propalt", … */
  source?: string;
  align?: "start" | "end";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className={cn("relative inline-flex align-middle", className)}>
      <button
        type="button"
        aria-label={source ? `About this field. Source: ${source}` : "About this field"}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        className="rounded-full text-muted-foreground/70 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Info className="h-3 w-3" aria-hidden />
      </button>

      {open && (
        <span
          role="tooltip"
          id={id}
          className={cn(
            "absolute bottom-full z-50 mb-1.5 w-52 rounded-lg border border-border bg-card p-2.5 text-left text-label font-normal normal-case tracking-normal text-card-foreground shadow-popover",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          <span className="block leading-snug">{text}</span>
          {source && (
            <span className="mt-1.5 block border-t border-border pt-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Source: {source}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
