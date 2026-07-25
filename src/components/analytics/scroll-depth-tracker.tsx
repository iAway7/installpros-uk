"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics/track";
import { EVENTS } from "@/lib/analytics/events";

const THRESHOLDS = [25, 50, 75, 90, 100] as const;

/** Fires scroll_depth once per threshold per page. Throttled via rAF. */
export function ScrollDepthTracker() {
  const fired = useRef<Set<number>>(new Set());
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - doc.clientHeight;
        const percent = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 100;
        for (const t of THRESHOLDS) {
          if (percent >= t && !fired.current.has(t)) {
            fired.current.add(t);
            track(EVENTS.SCROLL_DEPTH, { percent: t });
          }
        }
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
