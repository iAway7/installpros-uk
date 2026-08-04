"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Truncates in the middle, keeping the head and the tail.
 *
 * For strings where both ends carry meaning — a file path, a preview URL, a
 * lead reference — end-truncation throws away the half that identifies the
 * thing. `apps/…/page.tsx` is useful; `apps/vercel-site/app/(dash…` is not.
 *
 * Measures with canvas against the element's own computed font, so it stays
 * correct at any size without hardcoding character widths.
 */
export function MiddleTruncate({
  value,
  separator = "…",
  className,
}: {
  value: string;
  separator?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const measure = () => {
      const style = window.getComputedStyle(el);
      ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const available = el.clientWidth;
      if (!available || ctx.measureText(value).width <= available) {
        setDisplay(value);
        return;
      }

      // Binary search the largest head+tail that still fits.
      let lo = 0;
      let hi = Math.floor(value.length / 2);
      let best = separator;
      while (lo <= hi) {
        const keep = Math.floor((lo + hi) / 2);
        const candidate = value.slice(0, keep) + separator + value.slice(value.length - keep);
        if (ctx.measureText(candidate).width <= available) {
          best = candidate;
          lo = keep + 1;
        } else {
          hi = keep - 1;
        }
      }
      setDisplay(best);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [value, separator]);

  return (
    <span
      ref={ref}
      // The full string is the accessible name — the ellipsis on its own gives
      // a screen reader nothing to announce.
      aria-label={value}
      title={value}
      className={cn("block w-full overflow-hidden whitespace-nowrap", className)}
    >
      <span aria-hidden>{display}</span>
    </span>
  );
}
