"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Small "what is this?" affordance for a field label: explains what the value
 * means and names the source it came from.
 *
 * Hover and keyboard focus open it; on touch, a tap toggles it (there is no
 * hover on a phone, and the dashboard is used on phones). Deliberately not a
 * Note — a Note is persistent and owns its row; this is an on-demand aside
 * that must not add height to a dense layout.
 *
 * The bubble is positioned `fixed`, measured from the button at open time,
 * rather than absolutely inside its own parent. That is not over-engineering:
 * an absolutely positioned bubble is invisible anywhere its parent scrolls or
 * clips, and every table on the dashboard sits in an `overflow-x-auto` wrapper
 * — which, per spec, also clips vertically. Measuring lets it escape the
 * wrapper, flip below the trigger when it is near the top of the window, and
 * stay inside the viewport on a narrow screen.
 */

/** Matches the rendered width below. Needed in JS to clamp against the viewport. */
const WIDTH = 208;
const GAP = 8;
/** Below this distance from the top of the window there is no room above. */
const FLIP_THRESHOLD = 150;

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
  /** Which edge of the trigger the bubble hangs from before clamping. */
  align?: "start" | "end";
  className?: string;
}) {
  const [pos, setPos] = useState<{ top: number; left: number; below: boolean } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  const open = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const below = r.top < FLIP_THRESHOLD;
    const preferred = align === "end" ? r.right - WIDTH : r.left;
    const left = Math.min(Math.max(GAP, preferred), window.innerWidth - WIDTH - GAP);
    setPos({ top: below ? r.bottom + GAP : r.top - GAP, left, below });
  }, [align]);

  const close = useCallback(() => setPos(null), []);

  // Measured coordinates go stale the moment anything moves, and a bubble
  // floating away from its icon looks broken. Cheaper to dismiss it.
  useEffect(() => {
    if (!pos) return;
    const dismiss = () => setPos(null);
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => {
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, [pos]);

  return (
    <span className={cn("relative inline-flex align-middle", className)}>
      <button
        ref={btnRef}
        type="button"
        aria-label={source ? `About this field. Source: ${source}` : "About this field"}
        aria-expanded={pos !== null}
        aria-describedby={pos ? id : undefined}
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        onClick={(e) => {
          e.preventDefault();
          if (pos) close();
          else open();
        }}
        className="rounded-full text-muted-foreground/70 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Info className="h-3 w-3" aria-hidden />
      </button>

      {pos && (
        <span
          role="tooltip"
          id={id}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            width: WIDTH,
            // `top` is the bubble's bottom edge when it sits above the trigger.
            transform: pos.below ? undefined : "translateY(-100%)",
          }}
          className="z-50 rounded-lg border border-border bg-card p-2.5 text-left text-label font-normal normal-case tracking-normal text-card-foreground shadow-popover"
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
