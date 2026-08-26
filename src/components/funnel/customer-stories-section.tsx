import { getGoogleReviews, type Review } from "@/lib/reviews/google-reviews";
import { ReviewsCarousel } from "./reviews-carousel";

function GoogleG({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/** Hand-picked fallback reviews — shown when the live Google feed is empty or
 *  unavailable, and used to top up if fewer than 3 live reviews pass the ≥4★
 *  filter, so the section is never empty or thin. */
const CURATED: Review[] = [
  { q: "I was so impressed with the service, knowledge and competence of Summer. She was like a complete breath of fresh air.", name: "Mike H N Fisher", initial: "M", rating: 5 },
  { q: "Great service. Super fast and incredibly helpful, very good prices too.", name: "Andreas Kolezi", initial: "A", rating: 5 },
  { q: "I'd like to highly commend Ben at InstallPros. My broadband speed was very low. He was able to identify and fix it quickly.", name: "Mohsin Zahid", initial: "M", rating: 5 },
];

export async function CustomerStoriesSection() {
  const data = await getGoogleReviews();

  // Live reviews first; top up with curated (deduped) to guarantee ≥ 3.
  let reviews = data.reviews;
  if (reviews.length < 3) {
    const seen = new Set(reviews.map((r) => r.name.toLowerCase()));
    reviews = [...reviews, ...CURATED.filter((c) => !seen.has(c.name.toLowerCase()))];
  }
  reviews = reviews.slice(0, 6);

  const ratingLabel = (data.rating ?? 5).toFixed(1);
  const subline = data.count ? `From ${data.count.toLocaleString("en-GB")} reviews` : "Every review, five stars";

  return (
    <section id="stories" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-7">
          <div>
            <p className="eyebrow">Customer Stories</p>
            <h2
              className="mt-4 h2-section text-foreground"
            >
              Five stars,
              <br />
              everywhere we go.
            </h2>
          </div>
          <a
            href="https://maps.app.goo.gl/UvqYwqVrAV6R9T5m6"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 transition-opacity duration-quick ease-ds hover:opacity-80"
          >
            <GoogleG size={22} />
            <div>
              <div className="text-body-sm font-semibold text-foreground">{ratingLabel} on Google</div>
              <div className="text-caption text-muted-foreground">{subline}</div>
            </div>
          </a>
        </div>

        <div className="mt-12 md:mt-16">
          <ReviewsCarousel reviews={reviews} />
        </div>
      </div>
    </section>
  );
}
