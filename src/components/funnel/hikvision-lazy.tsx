"use client";

import dynamic from "next/dynamic";

/**
 * The Hikvision page's closing form in a chunk of its own, as on the Ajax page
 * (security-lazy.tsx has the reasons). The server still renders its HTML; only
 * its code leaves the chunk the hero waits for. The "Already have cameras?"
 * section embeds it too, through this same chunk.
 */
export const LazyHikvisionQuoteForm = dynamic(() => import("./hikvision-quote-form").then((m) => m.HikvisionQuoteForm));

// The camera planners, below the first screen: each in its own chunk,
// server-rendered as usual so the plan is on the page before any script runs.
// Step by step on the aerial photo (28 October).
export const LazyCoveragePlanner = dynamic(() => import("./hikvision-coverage-planner").then((m) => m.HikvisionCoveragePlanner));

// Photo tiles (28 October), below it.
export const LazyTilesPlanner = dynamic(() => import("./hikvision-tiles-planner").then((m) => m.HikvisionTilesPlanner));
