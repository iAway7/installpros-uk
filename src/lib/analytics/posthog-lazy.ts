"use client";

import type { PostHog } from "posthog-js";

/**
 * Lazy loader for posthog-js.
 *
 * Why this exists: `import posthog from "posthog-js"` at module scope pulled
 * 214 KB (uncompressed) into the entry chunk of EVERY route, because the
 * provider wraps the whole app in the root layout. The browser had to download,
 * parse and evaluate all of it before React could hydrate — which is most of
 * the "Script Evaluation 1294 ms" in PageSpeed.
 *
 * Crucially this is not a behaviour trade-off: `posthog.init()` already ran
 * inside a `useEffect`, i.e. after hydration. Moving to a dynamic import keeps
 * the exact same init timing (one extra chunk round trip) and simply stops the
 * bytes from blocking first paint. Session recording still starts at the same
 * point in the session.
 */

let instance: PostHog | null = null;
let loading: Promise<PostHog | null> | null = null;

/** Calls made before the chunk lands, replayed in order once it does. */
const queue: Array<(ph: PostHog) => void> = [];

/**
 * Fetch + initialise PostHog. Idempotent: repeated calls share one promise, so
 * the chunk is requested once no matter how many components ask for it.
 */
export function loadPostHog(): Promise<PostHog | null> {
  if (loading) return loading;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (typeof window === "undefined" || !key) return Promise.resolve(null);

  loading = import("posthog-js")
    .then(({ default: posthog }) => {
      if (!posthog.__loaded) {
        posthog.init(key, {
          api_host: "/ingest", // proxied via next.config rewrites (first-party)
          ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
          person_profiles: "identified_only",
          capture_pageview: false, // we fire our own standardized page_view
          capture_pageleave: true,
          autocapture: true,
          // surveys.js is 33 KB of extension for a feature we do not use, and
          // on a slow connection it competes with the LCP image. Off.
          //
          // Dead-click capture stays ON deliberately. It costs 8 KB, which is
          // nothing next to the hero, and it is the one signal that tells us
          // where people tap and get no response — exactly what we need while
          // the funnel is being optimised and two landing pages are being
          // compared. Session replay shows the same thing one user at a time;
          // this aggregates it.
          disable_surveys: true,
          session_recording: { maskAllInputs: true, maskTextSelector: "[data-ph-mask]" },
          persistence: "localStorage+cookie",
          loaded: (ph) => {
            if (process.env.NODE_ENV === "development") ph.debug();
          },
        });
      }

      instance = posthog;
      // splice(0) empties the queue as it reads it, so a callback that itself
      // calls withPostHog() re-queues onto a fresh array instead of looping.
      for (const fn of queue.splice(0)) {
        try {
          fn(posthog);
        } catch {
          /* one bad callback must not drop the rest */
        }
      }
      return posthog;
    })
    .catch(() => {
      // Chunk failed to load (offline, blocker, CDN hiccup). Everything still
      // reaches GA4; we just drop the PostHog copy, same as the old
      // `if (posthog.__loaded)` guard did before init finished.
      return null;
    });

  return loading;
}

/**
 * Run something against PostHog now, or as soon as it is available.
 *
 * Prefer this over touching the instance directly: it means an event fired in
 * the first few hundred ms — before the chunk resolves — is replayed rather
 * than silently dropped, which is what the old `posthog.__loaded` check did.
 */
export function withPostHog(fn: (ph: PostHog) => void): void {
  if (instance) {
    try {
      fn(instance);
    } catch {
      /* noop */
    }
    return;
  }

  queue.push(fn);
  void loadPostHog();
}
