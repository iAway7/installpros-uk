"use client";

import { useEffect } from "react";

/**
 * Puts the Product density on <body> while a Product page is mounted.
 *
 * Radix portals (Select, the filters Popover) render their content straight
 * into <body>, outside the .theme-product wrapper, so they resolved every
 * token from :root — the funnel's defaults — and, once Product moved to Geist,
 * would have opened an Inter dropdown under a Geist trigger.
 *
 * Done here rather than in the root layout because the root layout is shared
 * with the live funnel: this runs only on /dashboard and the auth pages, and
 * the cleanup takes the classes off again on the way out.
 */
export function ProductBodyTheme({ className }: { className: string }) {
  useEffect(() => {
    const classes = ["theme-product", ...className.split(" ").filter(Boolean)];
    document.body.classList.add(...classes);
    return () => document.body.classList.remove(...classes);
  }, [className]);
  return null;
}
