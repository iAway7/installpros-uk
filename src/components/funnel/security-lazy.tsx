"use client";

import dynamic from "next/dynamic";

/**
 * The Ajax page's heavier islands below the first screen, each in a chunk of
 * its own (Lighthouse, 19 October 2026: 300ms of blocking time on desktop).
 *
 * The server still renders their HTML, so nothing moves or pops in. What
 * changes is the browser's side: their code is no longer in the page chunk
 * the hero waits for, and each one hydrates on its own once it arrives,
 * instead of inside the first long task with the hero.
 *
 * The sections import these instead of the components themselves. Anything
 * shared with them (SECURITY_REPAIR_EVENT, for one) lives elsewhere, so the
 * page chunk does not pull them back in.
 */

// The hero's decoration, the one island on the first screen: Motion's only
// user up there, so the hero's own chunk no longer carries it (22 October).
export const LazyHeroDecor = dynamic(() => import("./security-hero-decor").then((m) => m.SecurityHeroDecor));

export const LazyLayersScene = dynamic(() => import("./security-layers-scene").then((m) => m.SecurityLayersScene));

export const LazyPhoneMock = dynamic(() => import("./security-phone-mock").then((m) => m.SecurityPhoneMock));

export const LazyQuoteForm = dynamic(() => import("./security-quote-form").then((m) => m.SecurityQuoteForm));
