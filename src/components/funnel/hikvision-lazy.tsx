"use client";

import dynamic from "next/dynamic";

/**
 * The Hikvision page's closing form in a chunk of its own, as on the Ajax page
 * (security-lazy.tsx has the reasons). The server still renders its HTML; only
 * its code leaves the chunk the hero waits for. HIKVISION_INTENT_EVENT lives
 * in hikvision-need-step.tsx so the sections that fire it do not pull the
 * form back in.
 */
export const LazyHikvisionQuoteForm = dynamic(() => import("./hikvision-quote-form").then((m) => m.HikvisionQuoteForm));

// The camera planner, below the first screen: its own chunk, server-rendered
// as usual so the plan is on the page before any script runs.
export const LazyCameraPlanner = dynamic(() => import("./hikvision-camera-planner").then((m) => m.HikvisionCameraPlanner));

// Its step-by-step copy below it (Gus, 28 October), worked on while the
// original stays.
export const LazyCoveragePlanner = dynamic(() => import("./hikvision-coverage-planner").then((m) => m.HikvisionCoveragePlanner));
