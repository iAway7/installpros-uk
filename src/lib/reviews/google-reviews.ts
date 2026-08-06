import { getBusinessProfileReviews } from "./business-profile";
import { sizedAvatar } from "./avatar";

export interface Review {
  q: string;
  name: string;
  initial: string;
  rating: number;
  photo?: string;
  when?: string;
}

export interface ReviewsData {
  rating: number | null; // aggregate, from Google
  count: number | null; // total review count, from Google
  reviews: Review[]; // filtered to >= MIN_RATING
  live: boolean; // true if these came from Google (not fallback)
}

const MIN_RATING = 4; // never surface anything below 4 stars

/**
 * Fetch the business's Google reviews via Places API (New), server-side and
 * cached for 6h (≈120 calls/month → well within the free tier). Filters out
 * anything below 4★. Fails soft: returns an empty list so the section can fall
 * back to curated reviews. Requires GOOGLE_PLACE_ID + a Places API key.
 */
export async function getGoogleReviews(): Promise<ReviewsData> {
  const empty: ReviewsData = { rating: null, count: null, reviews: [], live: false };

  // Preferred source: Business Profile API (ALL reviews, newest-first). Falls
  // through to the Places API when it isn't configured or returns nothing.
  const bp = await getBusinessProfileReviews();
  if (bp && bp.reviews.length) {
    return { rating: bp.rating, count: bp.count, reviews: bp.reviews, live: true };
  }

  const key = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return empty;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews.rating,reviews.text,reviews.originalText,reviews.publishTime,reviews.relativePublishTimeDescription,reviews.authorAttribution",
        "Accept-Language": "en-GB",
      },
      next: { revalidate: 21600 }, // 6 hours
    });
    if (!res.ok) return empty;

    const json = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      reviews?: Array<{
        rating?: number;
        text?: { text?: string };
        originalText?: { text?: string };
        publishTime?: string;
        relativePublishTimeDescription?: string;
        authorAttribution?: { displayName?: string; photoUri?: string };
      }>;
    };

    const reviews: Review[] = (json.reviews ?? [])
      .filter((r) => (r.rating ?? 0) >= MIN_RATING)
      // Newest first (publishTime is ISO 8601; falls back to 0 if missing).
      .sort((a, b) => new Date(b.publishTime ?? 0).getTime() - new Date(a.publishTime ?? 0).getTime())
      .map((r) => {
        const name = r.authorAttribution?.displayName?.trim() || "Google user";
        return {
          q: r.text?.text ?? r.originalText?.text ?? "",
          name,
          initial: name.charAt(0).toUpperCase(),
          rating: Math.round(r.rating ?? 5),
          photo: sizedAvatar(r.authorAttribution?.photoUri),
          when: r.relativePublishTimeDescription,
        };
      })
      .filter((r) => r.q.length > 0);

    return {
      rating: json.rating ?? null,
      count: json.userRatingCount ?? null,
      reviews,
      live: reviews.length > 0,
    };
  } catch {
    return empty;
  }
}
