export type ExperimentStatus = "draft" | "running" | "paused" | "complete";

/** Free-form per-variant overrides applied on the landing page. */
export interface VariantConfig {
  /** Split-URL tests: the full page path this variant routes to (e.g. "/starlink-installation"). */
  path?: string;
  /** On-page tests: swap the hero headline text. */
  headline?: string;
  ctaText?: string;
  [key: string]: unknown;
}

export interface Variant {
  id: string;
  experiment_id: string;
  key: string;
  name: string;
  is_control: boolean;
  allocation: number; // 0..1 traffic share
  config: VariantConfig;
}

export interface Experiment {
  id: string;
  key: string;
  name: string;
  hypothesis: string | null;
  status: ExperimentStatus;
  primary_metric: string;
  created_at?: string;
  started_at?: string | null;
  ended_at?: string | null;
  variants: Variant[];
}

/** A variant's computed performance, relative to the control. */
export interface VariantResult {
  variant: Variant;
  visitors: number;
  conversions: number;
  rate: number; // 0..1
  upliftPct: number | null; // relative uplift vs control; null for control
  confidencePct: number | null; // statistical confidence vs control
  isSignificant: boolean;
  isWinner: boolean;
  // Absolute difference vs control, in percentage points (rate − controlRate)×100.
  diffPct: number | null;
  // 95% confidence interval of that absolute difference, in percentage points.
  ciLowPct: number | null;
  ciHighPct: number | null;
  // Estimated ADDITIONAL visitors this variant still needs to reach 95%/80%-power
  // significance at the currently observed effect. 0 = already there; null = n/a.
  visitorsNeeded: number | null;
}
