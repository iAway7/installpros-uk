"use client";

import { withPostHog } from "./posthog-lazy";
import { buildEventContext } from "./context";
import {
  type AnalyticsEvent,
  type EventName,
  type EventProperties,
  CONVERSION_EVENTS,
} from "./events";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * The ONE function the whole app uses to record an event.
 * Fan-out: GA4 (via GTM dataLayer) + PostHog, with identical payloads.
 *
 * Usage:  track(EVENTS.CTA_CLICKED, { cta_id: "hero_quote", cta_location: "hero" })
 */
export function track(event: EventName, properties: EventProperties = {}): void {
  if (typeof window === "undefined") return;

  const payload: AnalyticsEvent = {
    event,
    ts: new Date().toISOString(),
    ...buildEventContext(),
    ...properties,
  };

  // 1) GA4 / GTM — push to dataLayer; GTM forwards to GA4 as a custom event.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ...payload });

  // 2) PostHog — capture with the same name + props. Queued if the chunk has
  //    not landed yet, so early clicks reach PostHog instead of being dropped
  //    the way the old `if (posthog.__loaded)` guard silently did.
  withPostHog((ph) => ph.capture(event, payload));

  // 3) Conversions get a normalized alias so Smart Bidding / PostHog goals
  //    can key off a single, unambiguous signal (fixes the audit double-count).
  if (CONVERSION_EVENTS.includes(event)) {
    // Spread first so the normalized alias wins over payload.event.
    window.dataLayer.push({ ...payload, event: "conversion", conversion_event: event });
  }

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, payload);
  }
}

/** Identify a known lead in PostHog (called after lead_created). */
export function identifyLead(leadId: string, traits: Record<string, unknown> = {}): void {
  withPostHog((ph) => ph.identify(leadId, traits));
}
