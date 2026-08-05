import type { Review } from "@/lib/reviews/google-reviews";
import { ReviewsCarousel } from "./reviews-carousel";

/** Trustpilot green star. */
function TrustpilotStar({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#00B67A" aria-hidden="true">
      <path d="M12 1.5l3.09 6.83 7.41.66-5.62 4.93 1.68 7.26L12 17.35l-6.56 3.83 1.68-7.26L1.5 8.99l7.41-.66L12 1.5z" />
    </svg>
  );
}

const TRUSTPILOT_URL = "https://uk.trustpilot.com/review/installpros.co.uk";

/** Curated real Trustpilot reviews (Trustpilot has no free reviews API, so
 *  these are hand-picked from our profile). Rendered in our own card design —
 *  matches the Google section, no iframe, no internal scroll. */
const TRUSTPILOT: Review[] = [
  { q: "Perfect communication and delivered exactly as promised. Even though I changed the date last minute, it was rescheduled and delivered as promised.", name: "Andy", initial: "A", rating: 5 },
  { q: "Install Pros have been fantastic from start to finish, and I have now used them for more than one installation.", name: "CP Venue Consulting", initial: "C", rating: 5 },
  { q: "Great communication and fully explained everything, and got the install done quickly for us. Would definitely recommend.", name: "Ricky Johnson", initial: "R", rating: 5 },
  { q: "Very timely response. Consistent support. Reliable company.", name: "Marc", initial: "M", rating: 5 },
];

/**
 * Trustpilot proof, sitting under the Google reviews. Same card + carousel as
 * the Google section (no TrustBox iframe), with a light Trustpilot rating
 * header instead of a big section heading.
 */
export function TrustpilotSection() {
  return (
    <section id="trustpilot" className="w-full bg-background pb-16 md:pb-24">
      <div className="container mx-auto max-w-6xl px-6">
        <a
          href={TRUSTPILOT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center transition-opacity hover:opacity-80"
        >
          <TrustpilotStar size={22} />
          <span className="text-[17px] font-semibold text-foreground">Excellent</span>
          <span className="text-[15px] text-muted-foreground">
            Rated <b className="text-foreground">4.8 / 5</b> from 303 reviews on Trustpilot
          </span>
        </a>

        <ReviewsCarousel reviews={TRUSTPILOT} source="trustpilot" />
      </div>
    </section>
  );
}
