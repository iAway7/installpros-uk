"use client";

import { useEffect } from "react";

/**
 * Entrance on scroll for blocks marked `data-reveal` (Gus, 4 November 2026),
 * on the digital landline and managed service pages. Stagger a row with an
 * inline `transitionDelay`.
 *
 * Sets html.reveal-ready, which is what hides the blocks (globals.css), so
 * without script nothing is ever invisible. Each block gets .is-revealed once
 * it scrolls into view and fades and rises in. The CSS only applies with
 * prefers-reduced-motion: no-preference.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const root = document.documentElement;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    // Blocks already on screen or above it (a reload mid-page) are shown
    // first, so they don't blink out and back in.
    for (const el of Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-revealed");
      else observer.observe(el);
    }
    root.classList.add("reveal-ready");

    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
