"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up from 0 to `to` once the element scrolls into view. Respects
 *  prefers-reduced-motion (renders the final value immediately). */
export function CountUp({
  to,
  suffix = "",
  duration = 1600,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Start at the FINAL value so server-render, no-JS and pre-hydration paints
  // all show the real number. The count-up is a progressive enhancement: if
  // anything goes wrong, the worst case is "no animation", never "0+".
  const [value, setValue] = useState(to);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // already showing `to`

    const run = () => {
      if (done.current) return;
      done.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setValue(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    // Already on screen at mount? Leave the final value in place — there was no
    // chance to see an animation anyway, and rewinding to 0 would flash.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      done.current = true;
      return;
    }

    setValue(0); // below the fold: safe to rewind and animate on scroll-in

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    // Belt and braces: if the observer never fires (odd viewports, zero-height
    // element, threshold never met), snap to the final value rather than
    // stranding the user on "0+".
    const failsafe = window.setTimeout(() => {
      if (!done.current) {
        done.current = true;
        setValue(to);
      }
      io.disconnect();
    }, 4000);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [to, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
