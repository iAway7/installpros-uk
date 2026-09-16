import { NextResponse } from "next/server";

/**
 * A small fixed-window rate limiter, held in memory.
 *
 * What it is for: the public routes spend real money or write real rows on
 * every call, and until now nothing stopped anyone calling them in a loop.
 * The Google Places quotas (console, Places API (New) > Quotas) are what put an
 * absolute ceiling on the bill; this covers what those quotas cannot see, which
 * is our own database and storage, and slows everything else down enough that a
 * casual script is not worth the attacker's time.
 *
 * What it is NOT: a defence against a distributed attack. The counter lives in
 * one server instance's memory, and Vercel runs several, so the effective limit
 * is roughly the configured number multiplied by however many instances happen
 * to be warm. That is a deliberate trade for having no account, no dependency
 * and no env var to forget. Everything goes through `rateLimit()`, so replacing
 * the Map with Upstash Redis later is a change to this file alone.
 */

interface Window {
  count: number;
  /** Epoch ms at which this window expires and the count resets. */
  resetAt: number;
}

const windows = new Map<string, Window>();

/**
 * Stop the Map growing without bound on a long-lived instance.
 *
 * forEach rather than for-of: the tsconfig target predates Map iteration, and
 * deleting the current key inside forEach is well defined for a Map.
 */
function prune(now: number): void {
  windows.forEach((w, key) => {
    if (w.resetAt <= now) windows.delete(key);
  });
}

/**
 * Best guess at the caller's address.
 *
 * On Vercel both headers are set by the platform's proxy, which is what makes
 * them usable here: a value the client sends is replaced rather than trusted.
 * `x-real-ip` is the single client address, so it is preferred; the first entry
 * of `x-forwarded-for` is the same thing when the header carries a chain.
 *
 * Falling back to a shared "unknown" bucket is deliberate. If neither header is
 * present we would otherwise give every anonymous caller its own generous
 * allowance, which is the opposite of what a limiter is for.
 */
function callerKey(req: Request): string {
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = req.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || "unknown";
}

export interface RateLimitRule {
  /** Names the bucket, so two routes with the same caller count separately. */
  name: string;
  limit: number;
  windowMs: number;
}

export const MINUTE = 60_000;
export const HOUR = 60 * MINUTE;

/**
 * Count one request against every rule given. Returns a 429 to return straight
 * back to the caller when any rule is exceeded, or null to carry on.
 *
 * Rules are checked before any of them is incremented, so a request refused by
 * the second rule does not silently consume the first one's allowance.
 */
export function rateLimit(req: Request, rules: RateLimitRule[]): NextResponse | null {
  const now = Date.now();
  if (windows.size > 5000) prune(now);

  const caller = callerKey(req);
  const keys = rules.map((rule) => `${rule.name}:${caller}`);

  for (let i = 0; i < rules.length; i++) {
    const existing = windows.get(keys[i]);
    if (existing && existing.resetAt > now && existing.count >= rules[i].limit) {
      const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
      return NextResponse.json(
        { error: "rate_limited" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }
  }

  for (let i = 0; i < rules.length; i++) {
    const existing = windows.get(keys[i]);
    if (!existing || existing.resetAt <= now) {
      windows.set(keys[i], { count: 1, resetAt: now + rules[i].windowMs });
    } else {
      existing.count++;
    }
  }

  return null;
}

/**
 * The ceilings, in one place so they can be read as a set.
 *
 * Every number is far above what a real visitor reaches and far below what a
 * script does, which is the gap a limiter lives in. The anchor is a measured
 * one: typing "12 De La Bere Cl, Evesham" at a human pace produces six
 * autocomplete calls, one if typed fast, because the field debounces at 250ms.
 * So sixty a minute is roughly ten times a normal typist and three times
 * someone fumbling and retyping, while still catching a loop immediately.
 *
 * Erring high is on purpose: turning away a real customer costs more than
 * letting a scraper have sixty calls before the door shuts. It also leaves room
 * for several people behind one office or mobile network address, which is the
 * main weakness of counting by IP.
 */
export const LIMITS = {
  /** Billed Google Places request per call. */
  addressAutocomplete: [{ name: "addr-auto", limit: 60, windowMs: MINUTE }],
  /** Billed Google Places request per call, but only one per selection. */
  addressDetails: [{ name: "addr-detail", limit: 20, windowMs: MINUTE }],
  /** Propalt credits, though the postcode cache absorbs repeats. */
  coverage: [{ name: "coverage", limit: 20, windowMs: MINUTE }],
  /** A row plus a webhook firing at Will's CRM. Two windows: bursts and grind. */
  lead: [
    { name: "lead-min", limit: 5, windowMs: MINUTE },
    { name: "lead-hour", limit: 20, windowMs: HOUR },
  ],
  /** Up to 10MB into storage, and the route is unauthenticated by design. */
  propertyPhotos: [{ name: "photos", limit: 20, windowMs: HOUR }],
  /** Cheap, but an open counter is an invitation to poison the A/B results. */
  experimentTrack: [{ name: "exp-track", limit: 120, windowMs: MINUTE }],
} satisfies Record<string, RateLimitRule[]>;
