"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics/track";
import { EVENTS } from "@/lib/analytics/events";

/**
 * Initialises PostHog once on the client and fires a standardized page_view
 * on every route change. Session recording is enabled (Phase 4 requirement).
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || posthog.__loaded) return;

    posthog.init(key, {
      api_host: "/ingest", // proxied via next.config rewrites (first-party)
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: false, // we fire our own standardized page_view
      capture_pageleave: true,
      autocapture: true,
      session_recording: { maskAllInputs: true, maskTextSelector: "[data-ph-mask]" },
      persistence: "localStorage+cookie",
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") ph.debug();
      },
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

/** Fires a standardized page_view on first paint and every client navigation. */
export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Our standardized event (mirrored to GA4 + PostHog)…
    track(EVENTS.PAGE_VIEW);
    // …plus PostHog's native $pageview, which powers PostHog Web Analytics and
    // clears the onboarding check. Manual capture is the App Router pattern.
    try {
      if (posthog.__loaded) {
        posthog.capture("$pageview", {
          $current_url: typeof window !== "undefined" ? window.location.href : undefined,
        });
      }
    } catch {
      /* posthog not ready */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}
