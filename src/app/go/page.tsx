"use client";

import { useEffect, useState } from "react";
import { track, EVENTS } from "@/lib/analytics";
import { assignVariant, getAnonId } from "@/lib/experiments/assign";
import { loadAssignments, saveAssignments, type StoredAssignment } from "@/lib/experiments/client";
import { isPageSplit } from "@/lib/experiments/pages";
import type { Experiment } from "@/lib/experiments/types";

const DEFAULT_PATH = "/install-quote";

/**
 * Split-URL entry point. Point ads / campaigns at `/go`: each visitor is given a
 * sticky variant of the active page-split experiment and redirected to that
 * variant's page. The assignment is stored so the eventual lead is attributed
 * back to the right variant. Non-split (on-page) experiments are ignored here.
 */
export default function GoPage() {
  const [msg, setMsg] = useState("Taking you to the best version…");

  useEffect(() => {
    let done = false;
    const go = (path: string) => {
      if (done) return;
      done = true;
      window.location.replace(path);
    };
    // Safety net: never leave the visitor stranded on /go.
    const fallback = setTimeout(() => go(DEFAULT_PATH), 2500);

    (async () => {
      try {
        const res = await fetch("/api/experiments/active", { cache: "no-store" });
        const json = (await res.json()) as { experiments: Experiment[] };
        const split = (json.experiments ?? []).find(isPageSplit);
        if (!split) return go(DEFAULT_PATH);

        const variant = assignVariant(split, getAnonId());
        const path = (variant?.config?.path as string | undefined) ?? DEFAULT_PATH;

        // Persist the assignment (merge, don't clobber any on-page assignment).
        if (variant) {
          const mine: StoredAssignment = {
            experimentId: split.id,
            experimentKey: split.key,
            variantId: variant.id,
            variantKey: variant.key,
            config: variant.config ?? {},
          };
          const others = loadAssignments().filter((a) => a.experimentId !== split.id);
          saveAssignments([mine, ...others]);

          // Record exposure once per session for this experiment.
          const flag = `ip_exp_seen_${split.id}`;
          let firstView = true;
          try {
            firstView = sessionStorage.getItem(flag) !== "1";
            sessionStorage.setItem(flag, "1");
          } catch {
            /* ignore */
          }
          if (firstView) {
            track(EVENTS.EXPERIMENT_VIEWED, { flag_key: split.key });
            void fetch("/api/experiments/track", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ variantId: variant.id, kind: "exposure" }),
              keepalive: true,
            }).catch(() => {});
          }
        }

        clearTimeout(fallback);
        setMsg("Redirecting…");
        go(path);
      } catch {
        clearTimeout(fallback);
        go(DEFAULT_PATH);
      }
    })();

    return () => clearTimeout(fallback);
  }, []);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 text-center">
      <p className="text-sm text-muted-foreground">{msg}</p>
    </main>
  );
}
