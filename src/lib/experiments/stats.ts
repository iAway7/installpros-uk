import type { Experiment, Variant, VariantResult } from "./types";

/** Standard normal CDF via the Abramowitz & Stegun 7.1.26 erf approximation. */
function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return p;
}

export function conversionRate(conversions: number, visitors: number): number {
  return visitors > 0 ? conversions / visitors : 0;
}

/**
 * Two-proportion z-test. Returns the two-sided p-value that the two conversion
 * rates differ. Guards against tiny/zero samples.
 */
export function twoProportionPValue(cA: number, nA: number, cB: number, nB: number): number | null {
  if (nA < 1 || nB < 1) return null;
  const pA = cA / nA;
  const pB = cB / nB;
  const pPool = (cA + cB) / (nA + nB);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / nA + 1 / nB));
  if (se === 0) return null;
  const z = (pB - pA) / se;
  return 2 * (1 - normalCdf(Math.abs(z)));
}

export interface ResultRow {
  variant_id: string;
  visitors: number;
  conversions: number;
}

/**
 * Estimated sample size PER VARIANT needed to detect the observed absolute
 * difference `d` (proportion) at 95% confidence with 80% power. Standard
 * two-proportion formula. Returns null when it can't be estimated (no effect
 * yet, or degenerate inputs).
 */
export function requiredSamplePerArm(pA: number, pB: number): number | null {
  const d = Math.abs(pB - pA);
  if (d <= 0) return null;
  const zAlpha = 1.959964; // two-sided 95%
  const zBeta = 0.841621; // 80% power
  const pBar = (pA + pB) / 2;
  const n =
    Math.pow(zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) + zBeta * Math.sqrt(pA * (1 - pA) + pB * (1 - pB)), 2) /
    (d * d);
  if (!isFinite(n) || n <= 0) return null;
  return Math.ceil(n);
}

/**
 * Combine an experiment's variants with their aggregated results, computing
 * conversion rate, uplift vs control, statistical confidence and the winner.
 * Winner = a variant that beats control with ≥95% confidence and the highest rate.
 */
export function computeResults(experiment: Experiment, rows: ResultRow[]): VariantResult[] {
  const byVariant = new Map<string, { visitors: number; conversions: number }>();
  for (const r of rows) {
    const cur = byVariant.get(r.variant_id) ?? { visitors: 0, conversions: 0 };
    cur.visitors += r.visitors;
    cur.conversions += r.conversions;
    byVariant.set(r.variant_id, cur);
  }

  const control: Variant | undefined =
    experiment.variants.find((v) => v.is_control) ?? experiment.variants[0];
  const controlAgg = control ? byVariant.get(control.id) ?? { visitors: 0, conversions: 0 } : null;
  const controlRate = controlAgg ? conversionRate(controlAgg.conversions, controlAgg.visitors) : 0;

  const results: VariantResult[] = experiment.variants.map((variant) => {
    const agg = byVariant.get(variant.id) ?? { visitors: 0, conversions: 0 };
    const rate = conversionRate(agg.conversions, agg.visitors);
    const isControl = control?.id === variant.id;

    let upliftPct: number | null = null;
    let confidencePct: number | null = null;
    let isSignificant = false;
    let diffPct: number | null = null;
    let ciLowPct: number | null = null;
    let ciHighPct: number | null = null;
    let visitorsNeeded: number | null = null;

    if (!isControl && controlAgg) {
      upliftPct = controlRate > 0 ? ((rate - controlRate) / controlRate) * 100 : rate > 0 ? 100 : 0;
      const p = twoProportionPValue(controlAgg.conversions, controlAgg.visitors, agg.conversions, agg.visitors);
      if (p !== null) {
        confidencePct = Math.max(0, Math.min(100, (1 - p) * 100));
        isSignificant = p < 0.05 && agg.visitors >= 30 && controlAgg.visitors >= 30;
      }

      // Absolute difference (percentage points) with an unpooled 95% CI.
      const nA = controlAgg.visitors;
      const nB = agg.visitors;
      const diff = rate - controlRate;
      diffPct = diff * 100;
      if (nA > 0 && nB > 0) {
        const seDiff = Math.sqrt((controlRate * (1 - controlRate)) / nA + (rate * (1 - rate)) / nB);
        const margin = 1.959964 * seDiff;
        ciLowPct = (diff - margin) * 100;
        ciHighPct = (diff + margin) * 100;
      }

      // How many more visitors (per arm) until this effect would be significant.
      if (isSignificant) {
        visitorsNeeded = 0;
      } else {
        const req = requiredSamplePerArm(controlRate, rate);
        visitorsNeeded = req == null ? null : Math.max(0, req - Math.min(nA, nB));
      }
    }

    return {
      variant,
      visitors: agg.visitors,
      conversions: agg.conversions,
      rate,
      upliftPct,
      confidencePct,
      isSignificant,
      isWinner: false,
      diffPct,
      ciLowPct,
      ciHighPct,
      visitorsNeeded,
    };
  });

  // Winner: significant, beats control, highest rate among such variants.
  const contenders = results.filter((r) => r.isSignificant && r.rate > controlRate);
  if (contenders.length > 0) {
    contenders.sort((a, b) => b.rate - a.rate)[0].isWinner = true;
  }

  return results;
}
