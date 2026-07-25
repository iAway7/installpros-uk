"use client";

import { track, EVENTS } from "@/lib/analytics";
import type { VariantConfig } from "./types";

export interface StoredAssignment {
  experimentId: string;
  experimentKey: string;
  variantId: string;
  variantKey: string;
  config: VariantConfig;
}

const LS_KEY = "ip_assignments";

declare global {
  interface Window {
    __ipExperiment?: { variant_id: string; experiment_id: string };
    __ipAssignments?: StoredAssignment[];
  }
}

export function loadAssignments(): StoredAssignment[] {
  if (typeof window === "undefined") return [];
  if (window.__ipAssignments) return window.__ipAssignments;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as StoredAssignment[]) : [];
  } catch {
    return [];
  }
}

export function saveAssignments(a: StoredAssignment[]): void {
  if (typeof window === "undefined") return;
  window.__ipAssignments = a;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(a));
  } catch {
    /* storage blocked */
  }
  // The analytics context reads this single primary assignment.
  if (a[0]) window.__ipExperiment = { experiment_id: a[0].experimentId, variant_id: a[0].variantId };
}

/** Merge every assigned variant's config (later experiments win on key clash). */
export function mergedConfig(): VariantConfig {
  return loadAssignments().reduce<VariantConfig>((acc, x) => ({ ...acc, ...x.config }), {});
}

/**
 * Fire experiment_converted + record a conversion for every assigned experiment.
 * Idempotent per session so one lead never double-counts.
 */
export function recordExperimentConversions(): void {
  const assignments = loadAssignments();
  if (assignments.length === 0) return;
  try {
    if (sessionStorage.getItem("ip_exp_converted") === "1") return;
    sessionStorage.setItem("ip_exp_converted", "1");
  } catch {
    /* ignore */
  }
  for (const a of assignments) {
    track(EVENTS.EXPERIMENT_CONVERTED, { flag_key: a.experimentKey });
    void fetch("/api/experiments/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId: a.variantId, kind: "conversion" }),
      keepalive: true,
    }).catch(() => {});
  }
}
