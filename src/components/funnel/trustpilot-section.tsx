import { getTrustpilotReviews, reviewDate } from "@/lib/reviews/trustpilot";
import seed from "@/data/trustpilot-seed.json";
import type { Review } from "@/lib/reviews/google-reviews";
import { ReviewsCarousel } from "./reviews-carousel";
import { TrustpilotStarMark } from "./trustpilot-marks";

interface SeedEntry {
  stars: number;
  text: string;
  consumer_name: string;
  created_at: string;
  is_verified: boolean;
  link?: string;
  _todo?: string;
}

const TRUSTPILOT_URL = "https://uk.trustpilot.com/review/installpros.co.uk";

/** Read off the Trustpilot profile on 27 Aug 2026. Only used until
 *  `trustpilot_stats` is seeded; after that the database wins. */
const FALLBACK_SCORE = 4.8;
const FALLBACK_COUNT = 323;

/**
 * Shown until `trustpilot_reviews` is seeded and the webhook takes over.
 *
 * These are the same reviews the seed script loads (`src/data/trustpilot-seed.json`,
 * copied by hand from the Trustpilot profile), so what renders before and after
 * the migration is identical — including the real dates and each review's real
 * Verified flag. Entries still marked `_todo` are skipped: their text was
 * truncated in the source screenshots and half a sentence is worse than one
 * review fewer.
 */
const FALLBACK: Review[] = (seed as SeedEntry[])
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

/**
 * Trustpilot proof, in our own cards, matching the Google section above.
 *
 * Server-rendered from `trustpilot_reviews` (see lib/reviews/trustpilot.ts).
 * No TrustBox script, no iframe: the browser never contacts Trustpilot, the
 * review text is in our HTML, and the date and Verified seal on each card are
 * Trustpilot's real values rather than something we typed in.
 */
export async function TrustpilotSection() {
  const data = await getTrustpilotReviews();
  const reviews: Review[] = data.reviews.length
    ? data.reviews.map(({ createdAt, ...r }) => ({ ...r, when: reviewDate(createdAt) }))
    : FALLBACK;

  // Mirrors the Google block above it, word for word: "5.0 on Google" /
  // "From 185 reviews". Same shape, same rhythm, different platform.
  //
  // The numbers live in app_settings (`trustpilot_stats`) and the webhook keeps
  // the count moving. FALLBACK_* is what shows before that row exists — the real
  // figures read off the Trustpilot profile on the date below, not placeholders.
  const score = data.score ?? FALLBACK_SCORE;
  const count = data.count ?? FALLBACK_COUNT;

  const heading = `${score.toFixed(1)} on Trustpilot`;
  const subline = `From ${count.toLocaleString("en-GB")} reviews`;

  return (
    <section id="trustpilot" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        {/* The pair reads as one "Customer Stories" block. This section opens
            it, so it carries the heading; the Google one below is the same
            block continued and only carries its own rating link. */}
        <div className="flex flex-wrap items-end justify-between gap-7">
          <div>
            <p className="eyebrow">Customer Stories</p>
            <h2 className="mt-4 h2-section text-foreground">
              Five stars,
              <br />
              everywhere we go.
            </h2>
          </div>
          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 transition-opacity duration-quick ease-ds hover:opacity-80"
          >
            <TrustpilotStarMark size={26} />
            <div>
              <div className="text-body-sm font-semibold text-foreground">{heading}</div>
              <div className="text-caption text-muted-foreground">{subline}</div>
            </div>
          </a>
        </div>

        <div className="mt-12 md:mt-16">
          <ReviewsCarousel reviews={reviews} source="trustpilot" />
        </div>
      </div>
    </section>
  );
}
