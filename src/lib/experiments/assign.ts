import type { Experiment, Variant } from "./types";

/** Deterministic string → [0,1) hash (cyrb53-based). Stable across sessions. */
function hashUnit(str: string): number {
  let h1 = 0xdeadbeef ^ str.length;
  let h2 = 0x41c6ce57 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const val = 4294967296 * (2097151 & h2) + (h1 >>> 0);
  return (val % 1000000) / 1000000;
}

const ANON_KEY = "ip_anon_id";

/** Stable anonymous id for consistent bucketing across visits. */
export function getAnonId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

/**
 * Assign a visitor to a variant using their anon id + experiment key, honouring
 * each variant's traffic allocation. Deterministic, so the same visitor always
 * lands in the same variant.
 */
export function assignVariant(experiment: Experiment, anonId: string): Variant | null {
  const variants = experiment.variants;
  if (variants.length === 0) return null;

  const total = variants.reduce((s, v) => s + (v.allocation > 0 ? v.allocation : 0), 0);
  if (total <= 0) return variants[0];

  const bucket = hashUnit(`${anonId}:${experiment.key}`) * total;
  let acc = 0;
  for (const v of variants) {
    acc += Math.max(0, v.allocation);
    if (bucket < acc) return v;
  }
  return variants[variants.length - 1];
}
