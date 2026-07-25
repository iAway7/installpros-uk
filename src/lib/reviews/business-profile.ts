import type { Review } from "./google-reviews";

/**
 * Google Business Profile API — returns ALL of the business's reviews, sorted
 * newest-first, using an owner OAuth refresh token. Unlike the Places API (max
 * 5 "most relevant"), this is the full, date-ordered feed — the legit way to
 * match what Trustindex shows, for free.
 *
 * Requires (all from the Google Business Profile setup, see docs/GBP-REVIEWS.md):
 *   GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_REFRESH_TOKEN, GBP_ACCOUNT_ID, GBP_LOCATION_ID
 *
 * Returns null when unconfigured or on any error, so callers fall back to the
 * Places API / curated reviews.
 */

const STAR: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
const MIN_RATING = 4;

function relativeTime(iso?: string): string | undefined {
  if (!iso) return undefined;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return undefined;
  const days = Math.max(0, Math.floor((Date.now() - then) / 86400000));
  if (days < 1) return "today";
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

async function accessToken(): Promise<string | null> {
  const client_id = process.env.GBP_CLIENT_ID;
  const client_secret = process.env.GBP_CLIENT_SECRET;
  const refresh_token = process.env.GBP_REFRESH_TOKEN;
  if (!client_id || !client_secret || !refresh_token) return null;
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id, client_secret, refresh_token, grant_type: "refresh_token" }),
      // Tokens live ~1h; cache under that so we don't mint one per render.
      next: { revalidate: 3000 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { access_token?: string };
    return json.access_token ?? null;
  } catch {
    return null;
  }
}

export interface BusinessProfileResult {
  reviews: Review[];
  rating: number | null; // average across fetched reviews
  count: number | null; // total review count reported by Google
}

export async function getBusinessProfileReviews(): Promise<BusinessProfileResult | null> {
  const account = process.env.GBP_ACCOUNT_ID;
  const location = process.env.GBP_LOCATION_ID;
  if (!account || !location) return null;

  const token = await accessToken();
  if (!token) return null;

  try {
    const url =
      `https://mybusiness.googleapis.com/v4/accounts/${account}/locations/${location}/reviews` +
      `?orderBy=${encodeURIComponent("updateTime desc")}&pageSize=50`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 21600 }, // 6h
    });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      averageRating?: number;
      totalReviewCount?: number;
      reviews?: Array<{
        starRating?: string;
        comment?: string;
        updateTime?: string;
        createTime?: string;
        reviewer?: { displayName?: string; profilePhotoUrl?: string };
      }>;
    };

    const reviews: Review[] = (json.reviews ?? [])
      .map((r) => ({ ...r, _n: STAR[r.starRating ?? ""] ?? 0 }))
      .filter((r) => r._n >= MIN_RATING && (r.comment ?? "").trim().length > 0)
      .map((r) => {
        const name = r.reviewer?.displayName?.trim() || "Google user";
        // Google prefixes some translated reviews with "(Translated by Google)…".
        const comment = (r.comment ?? "").replace(/\(Translated by Google\)\s*/i, "").split(/\n*\(Original\)/i)[0].trim();
        return {
          q: comment,
          name,
          initial: name.charAt(0).toUpperCase(),
          rating: r._n,
          photo: r.reviewer?.profilePhotoUrl,
          when: relativeTime(r.updateTime ?? r.createTime),
        };
      });

    return {
      reviews,
      rating: json.averageRating ?? null,
      count: json.totalReviewCount ?? null,
    };
  } catch {
    return null;
  }
}
