"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics/track";
import { EVENTS } from "@/lib/analytics/events";
import { loadPostHog, withPostHog } from "@/lib/analytics/posthog-lazy";

/**
 * Kicks off the PostHog load once the app has hydrated. Config lives in
 * `posthog-lazy` so the 214 KB library stays out of the entry chunk — see the
 * note there for why. Init timing is unchanged: it was already in a useEffect.
 *
 * No React context provider anymore: nothing in the app used `usePostHog()`,
 * so `posthog-js/react` was pulling in a dependency purely to wrap children.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void loadPostHog();
  }, []);

  return <>{children}</>;
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
    // withPostHog queues this if the chunk is still in flight, so the very
    // first pageview of a session is no longer at risk of being dropped.
    withPostHog((ph) =>
      ph.capture("$pageview", {
        $current_url: typeof window !== "undefined" ? window.location.href : undefined,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}
