import { getTrustpilotReviews, reviewDate } from "./trustpilot";
import { getGoogleReviews, type Review } from "./google-reviews";
import seed from "@/data/trustpilot-seed.json";

/**
 * Both platforms' reviews and totals in one call, for the digital landline
 * page's reviews (voip-reviews-paired.tsx, Gus, 4 November).
 *
 * The fallbacks are copies of the ones in trustpilot-section.tsx and
 * customer-stories-section.tsx, on purpose: those sections serve every other
 * page and stay as they are.
 */

interface SeedEntry {
  stars: number;
  text: string;
  consumer_name: string;
  created_at: string;
  is_verified: boolean;
  link?: string;
  _todo?: string;
}

export const TRUSTPILOT_URL = "https://uk.trustpilot.com/review/installpros.co.uk";
export const GOOGLE_URL = "https://maps.app.goo.gl/UvqYwqVrAV6R9T5m6";

// Same figures and reviews as trustpilot-section.tsx shows before its table
// has data.
const TP_FALLBACK_SCORE = 4.8;
const TP_FALLBACK_COUNT = 323;
const TP_FALLBACK: Review[] = (seed as SeedEntry[])
  .filter((e) => !e._todo)
  .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
  .map((e) => ({
    q: e.text,
    name: e.consumer_name,
    initial: e.consumer_name.charAt(0).toUpperCase(),
    rating: e.stars,
    when: reviewDate(e.created_at),
    verified: e.is_verified,
    link: e.link,
  }));

// Same as CURATED in customer-stories-section.tsx.
const GOOGLE_CURATED: Review[] = [
  { q: "I was so impressed with the service, knowledge and competence of Summer. She was like a complete breath of fresh air.", name: "Mike H N Fisher", initial: "M", rating: 5 },
  { q: "Great service. Super fast and incredibly helpful, very good prices too.", name: "Andreas Kolezi", initial: "A", rating: 5 },
  { q: "I'd like to highly commend Ben at InstallPros. My broadband speed was very low. He was able to identify and fix it quickly.", name: "Mohsin Zahid", initial: "M", rating: 5 },
];

export interface PlatformReviews {
  score: number;
  /** Null when the platform gave no total (Google's feed can fail soft). */
  count: number | null;
  reviews: Review[];
}

export async function getVoipReviews(): Promise<{ trustpilot: PlatformReviews; google: PlatformReviews }> {
  const [tp, g] = await Promise.all([getTrustpilotReviews(), getGoogleReviews()]);

  const tpReviews: Review[] = tp.reviews.length
    ? tp.reviews.map(({ createdAt, ...r }) => ({ ...r, when: reviewDate(createdAt) }))
    : TP_FALLBACK;

  let gReviews = g.reviews;
  if (gReviews.length < 3) {
    const seen = new Set(gReviews.map((r) => r.name.toLowerCase()));
    gReviews = gReviews.concat(GOOGLE_CURATED.filter((c) => !seen.has(c.name.toLowerCase())));
  }

  return {
    trustpilot: { score: tp.score ?? TP_FALLBACK_SCORE, count: tp.count ?? TP_FALLBACK_COUNT, reviews: tpReviews },
    google: { score: g.rating ?? 5, count: g.count, reviews: gReviews.slice(0, 6) },
  };
}
