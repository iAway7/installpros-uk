"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { track, EVENTS } from "@/lib/analytics";
import { assignVariant, getAnonId } from "@/lib/experiments/assign";
import { saveAssignments, loadAssignments, type StoredAssignment } from "@/lib/experiments/client";
import { isPageSplit } from "@/lib/experiments/pages";
import type { Experiment, VariantConfig } from "@/lib/experiments/types";

interface Ctx {
  config: VariantConfig;
  ready: boolean;
}
const ExperimentCtx = createContext<Ctx>({ config: {}, ready: false });

export function useExperimentConfig(): VariantConfig {
  return useContext(ExperimentCtx).config;
}

/**
 * Fetches running experiments, assigns the visitor a variant (sticky), records
 * exposure once per session, and exposes the merged variant config. Fails open:
 * if there are no experiments (or no backend), children just render defaults.
 */
export function ExperimentProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<VariantConfig>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Reuse an existing assignment immediately (avoids a flash on repeat visits).
    const existing = loadAssignments();
    if (existing.length) setConfig(existing.reduce((a, x) => ({ ...a, ...x.config }), {}));

    (async () => {
      try {
        const res = await fetch("/api/experiments/active", { cache: "no-store" });
        const json = (await res.json()) as { experiments: Experiment[] };
        if (cancelled) return;

        const anonId = getAnonId();
        const assignments: StoredAssignment[] = [];
        for (const exp of json.experiments ?? []) {
          // Split-URL tests are driven by the /go entry, not applied on-page.
          if (isPageSplit(exp)) continue;
          const variant = assignVariant(exp, anonId);
          if (!variant) continue;
          assignments.push({
            experimentId: exp.id,
            experimentKey: exp.key,
            variantId: variant.id,
            variantKey: variant.key,
            config: variant.config ?? {},
          });
        }

        if (assignments.length) {
          // Keep any split-URL assignment made by /go so lead attribution survives.
          const existingSplit = loadAssignments().filter((a) => typeof a.config?.path === "string");
          saveAssignments([...assignments, ...existingSplit]);
          setConfig(assignments.reduce((a, x) => ({ ...a, ...x.config }), {}));
          recordExposures(assignments);
        }
      } catch {
        /* fail open */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return <ExperimentCtx.Provider value={{ config, ready }}>{children}</ExperimentCtx.Provider>;
}

/** experiment_viewed + exposure count, once per session per experiment. */
function recordExposures(assignments: StoredAssignment[]) {
  for (const a of assignments) {
    const flag = `ip_exp_seen_${a.experimentId}`;
    try {
      if (sessionStorage.getItem(flag) === "1") continue;
      sessionStorage.setItem(flag, "1");
    } catch {
      /* ignore */
    }
    track(EVENTS.EXPERIMENT_VIEWED, { flag_key: a.experimentKey });
    void fetch("/api/experiments/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId: a.variantId, kind: "exposure" }),
    }).catch(() => {});
  }
}
