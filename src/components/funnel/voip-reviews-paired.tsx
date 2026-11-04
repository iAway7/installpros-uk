import { getVoipReviews, GOOGLE_URL, TRUSTPILOT_URL } from "@/lib/reviews/voip-reviews";
import { ReviewsCarousel } from "./reviews-carousel";
import { TrustpilotStarMark } from "./trustpilot-marks";

/** Google's G, as in customer-stories-section.tsx. */
export function GoogleG({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/**
 * The reviews on the digital landline page (Gus, 4 November, picked over a
 * mixed grid): the Trustpilot and Google ratings side by side under the
 * heading, Google first, then the two sliders one straight after the other.
 * Replaces the pair
 * TrustpilotSection + CustomerStoriesSection on this page only, where the
 * Google rating sat alone between the sliders and pushed them apart.
 */
export async function VoipReviewsPaired() {
  const { trustpilot, google } = await getVoipReviews();

  return (
    <section id="trustpilot" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-7">
          <div data-reveal>
            <p className="eyebrow">Customer Stories</p>
            <h2 className="mt-4 h2-section text-foreground">
              Five stars,
              <br />
              everywhere we go.
            </h2>
          </div>
          <div data-reveal style={{ transitionDelay: "80ms" }} className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href={GOOGLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 transition-opacity duration-quick ease-ds hover:opacity-80"
            >
              <GoogleG size={22} />
              <div>
                <div className="text-body-sm font-semibold text-foreground">{google.score.toFixed(1)} on Google</div>
                <div className="text-caption text-muted-foreground">
                  {google.count ? `From ${google.count.toLocaleString("en-GB")} reviews` : "Every review, five stars"}
                </div>
              </div>
            </a>
            <a
              href={TRUSTPILOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 transition-opacity duration-quick ease-ds hover:opacity-80"
            >
              <TrustpilotStarMark size={26} />
              <div>
                <div className="text-body-sm font-semibold text-foreground">{trustpilot.score.toFixed(1)} on Trustpilot</div>
                <div className="text-caption text-muted-foreground">
                  From {(trustpilot.count ?? 0).toLocaleString("en-GB")} reviews
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Cards without their shadow on this page (Gus, 4 November). Done
            from here so the shared ReviewCard keeps it everywhere else. */}
        <div className="[&_[data-card]>div]:shadow-none">
          <div className="mt-12 md:mt-16">
            <ReviewsCarousel reviews={trustpilot.reviews} source="trustpilot" />
          </div>
          <div className="mt-6 md:mt-8">
            <ReviewsCarousel reviews={google.reviews} />
          </div>
        </div>
      </div>
    </section>
  );
}
