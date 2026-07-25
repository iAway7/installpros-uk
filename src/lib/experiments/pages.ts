import type { Experiment } from "./types";

/**
 * Pages that can be pitted against each other in a split-URL test. Add a row
 * here when you build a new landing variant you want to be selectable in the
 * experiment builder. `slug` must be a real route under the app.
 */
export interface TestablePage {
  slug: string;
  label: string;
  description: string;
}

export const TESTABLE_PAGES: TestablePage[] = [
  {
    slug: "/install-quote",
    label: "Install Quote",
    description: "Original funnel — postcode hero, full nav-free header.",
  },
  {
    slug: "/starlink-installation",
    label: "Starlink Installation",
    description: "Variant funnel — address autocomplete hero, slim header.",
  },
];

export function findPage(slug: string): TestablePage | undefined {
  return TESTABLE_PAGES.find((p) => p.slug === slug);
}

/**
 * A "page split" (split-URL) experiment routes whole-page traffic: at least one
 * variant carries a `path`. These are driven by the /go entry, NOT applied to
 * direct page visits, so the on-page ExperimentProvider skips them.
 */
export function isPageSplit(exp: Pick<Experiment, "variants">): boolean {
  return exp.variants.some((v) => typeof v.config?.path === "string" && v.config.path.length > 0);
}
