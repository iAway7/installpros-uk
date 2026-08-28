import { unstable_cache } from "next/cache";
import { createPlainServiceClient, supabaseConfigured } from "@/lib/supabase/service";
import type { Review } from "./google-reviews";

/**
 * Trustpilot reviews, read from our own copy of their feed.
 *
 * We have no Trustpilot API key (the API is a paid add-on), so the data comes
 * from their webhooks into `trustpilot_reviews`: ~15 rows seeded by hand from
 * the business portal, then kept current by service-review-created / -updated /
 * -deleted. See docs/TRUSTPILOT-REVIEWS.md.
 *
 * Everything here runs server-side, so the browser never talks to Trustpilot:
 * no third-party script, no iframe, and the review text ends up in our HTML.
 */

/** Cache tag the webhook revalidates, so a new review shows up immediately. */
export const TRUSTPILOT_TAG = "trustpilot-reviews";

/** How many cards the carousel holds. Older rows stay in the table. */
const WINDOW = 15;
const MIN_RATING = 4;

export interface TrustpilotStats {
  /** Hand-seeded total, moved +1/-1 by the webhook. Trustpilot never sends it. */
  count: number;
  /** Hand-set TrustScore. Slow to move at our volume; re-check occasionally. */
  score: number | null;
}

/** A stored review, still carrying its raw timestamp. */
export type StoredReview = Omit<Review, "when"> & { createdAt: string };

export interface TrustpilotData {
  reviews: StoredReview[];
  count: number | null;
  score: number | null;
}

const EMPTY: TrustpilotData = { reviews: [], count: null, score: null };

interface Row {
  id: string;
  stars: number;
  text: string;
  consumer_name: string;
  is_verified: boolean;
  created_at: string;
  link: string | null;
}

/**
 * Date as Trustpilot renders it: relative for the first week ("2 days ago",
 * "3 days ago"), then the calendar date with the year ("Aug 14, 2026"). Their
 * own widget switches at about a week, and matching it means our cards and
 * their profile never disagree about when a review was left.
 *
 * Deliberately NOT called inside the cached query. Formatting there would bake
 * the string into the cache for an hour, so "2 days ago" would keep saying two
 * days into the third, and a change to this function would not show up until
 * the cache expired. The section formats at render time instead.
 */
export function reviewDate(iso: string): string | undefined {
  const then = new Date(iso);
  const ms = then.getTime();
  if (Number.isNaN(ms)) return undefined;

  const days = Math.max(0, Math.floor((Date.now() - ms) / 86400000));
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;

  // "Aug 14, 2026" — the format Trustpilot prints on the review itself. Always
  // with the year: a date without one quietly reads as recent.
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

async function query(): Promise<TrustpilotData> {
  if (!supabaseConfigured()) return EMPTY;

  try {
    const supabase = createPlainServiceClient();
    const { data, error } = await supabase
      .from("trustpilot_reviews")
      .select("id, stars, text, consumer_name, is_verified, created_at, link")
      .is("deleted_at", null)
      .gte("stars", MIN_RATING)
      .neq("text", "")
      .order("created_at", { ascending: false })
      // Tiebreaker: several reviews share a day, and without a second key
      // Postgres is free to return same-day rows in any order — the carousel
      // reshuffled itself between renders.
      .order("id", { ascending: false })
      .limit(WINDOW);

    if (error) throw error;

    const reviews: StoredReview[] = ((data ?? []) as Row[]).map((r) => {
      const name = r.consumer_name?.trim() || "Customer";
      return {
        q: r.text.trim(),
        name,
        initial: name.charAt(0).toUpperCase(),
        rating: r.stars,
        createdAt: r.created_at,
        // Trustpilot's own flag. Never inferred — a badge we invented would be
        // a claim their platform did not make.
        verified: r.is_verified,
        link: r.link ?? undefined,
      };
    });

    // Read the settings row with the same plain client: `getSetting` goes
    // through the ssr helper, which cannot run inside `unstable_cache`.
    const { data: settings } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "trustpilot_stats")
      .maybeSingle();
    const stats = (settings?.value as TrustpilotStats | undefined) ?? { count: 0, score: null };

    return {
      reviews,
      count: stats.count > 0 ? stats.count : null,
      score: stats.score ?? null,
    };
  } catch {
    return EMPTY;
  }
}

/** Cached read. Revalidated by time and, immediately, by the webhook's tag. */
export const getTrustpilotReviews = unstable_cache(query, ["trustpilot-reviews"], {
  tags: [TRUSTPILOT_TAG],
  revalidate: 3600,
});
