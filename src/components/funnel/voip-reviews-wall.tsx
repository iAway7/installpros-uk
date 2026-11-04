import type { Review } from "@/lib/reviews/google-reviews";
import { getVoipReviews, GOOGLE_URL, TRUSTPILOT_URL } from "@/lib/reviews/voip-reviews";
import { avatarTone, TrustpilotStarMark } from "./trustpilot-marks";
import { GoogleG } from "./voip-reviews-paired";
import { VoipReviewsWallFold } from "./voip-reviews-wall-fold";

/**
 * Review layout B for the digital landline page (Gus, 4 November, after a
 * reference screenshot): both ratings as small pills, one headline with the
 * two platforms' review counts added up, and the reviews of both mixed in a
 * masonry wall of white cards on light grey, cut with a fade. Replaces
 * TrustpilotSection + CustomerStoriesSection on this page only.
 *
 * Each card names its platform and date where the reference has a job title,
 * and its name links to the review at the source when there is a link. Long
 * reviews are cut at CLAMP characters so one doesn't take a whole column.
 */

const CLAMP = 320;
const MAX_CARDS = 12;

type Card = Review & { platform: "Google" | "Trustpilot" };

/** Alternate the two platforms so the wall reads as one mixed set. */
function mix(tp: Review[], g: Review[]): Card[] {
  const out: Card[] = [];
  for (let i = 0; out.length < MAX_CARDS && (i < tp.length || i < g.length); i++) {
    if (i < tp.length) out.push({ ...tp[i], platform: "Trustpilot" });
    if (i < g.length && out.length < MAX_CARDS) out.push({ ...g[i], platform: "Google" });
  }
  return out;
}

export async function VoipReviewsWall() {
  const { trustpilot, google } = await getVoipReviews();
  const total = (trustpilot.count ?? 0) + (google.count ?? 0);
  // Rounded down to the ten with a plus, as in "4,000+": the exact total moves
  // with every new review.
  const shown = `${(Math.floor(total / 10) * 10).toLocaleString("en-GB")}+`;
  const cards = mix(trustpilot.reviews, google.reviews);

  return (
    <section id="trustpilot" className="w-full scroll-mt-28 bg-[#f4f4f5] py-16 md:py-24">
      <div className="container mx-auto">
        <div data-reveal className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <a
              href={GOOGLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-body-sm text-foreground/80 transition-opacity duration-quick hover:opacity-80"
            >
              <GoogleG size={16} />
              <span>{google.score.toFixed(1)}</span>
              <span className="sr-only">on Google</span>
            </a>
            <a
              href={TRUSTPILOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-body-sm text-foreground/80 transition-opacity duration-quick hover:opacity-80"
            >
              <TrustpilotStarMark size={16} />
              <span>{trustpilot.score.toFixed(1)}</span>
              <span className="sr-only">on Trustpilot</span>
            </a>
          </div>
          <h2 className="mt-6 text-balance text-[34px] font-medium leading-[1.1] tracking-[-0.02em] text-foreground md:mt-8 md:text-[52px]">
            Trusted by {shown} customers
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-6xl md:mt-14">
          <VoipReviewsWallFold>
            <ul className="columns-1 gap-4 md:columns-2 lg:columns-3">
              {cards.map((r, i) => {
                const tone = r.photo ? null : avatarTone(r.name);
                const text = r.q.length > CLAMP ? `${r.q.slice(0, CLAMP).trimEnd()}…` : r.q;
                return (
                  <li
                    key={`${r.platform}-${r.name}-${i}`}
                    className="mb-4 break-inside-avoid rounded-[28px] bg-white p-7 md:p-8"
                  >
                    <div className="flex items-center gap-4">
                      {r.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.photo}
                          alt=""
                          width={56}
                          height={56}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="h-14 w-14 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lead font-medium"
                          style={tone ? { backgroundColor: tone.bg, color: tone.fg } : undefined}
                        >
                          {r.initial}
                        </div>
                      )}
                      <div className="min-w-0">
                        {r.link ? (
                          <a
                            href={r.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate text-[20px] font-medium leading-tight text-foreground underline-offset-4 hover:underline"
                          >
                            {r.name}
                          </a>
                        ) : (
                          <div className="truncate text-[20px] font-medium leading-tight text-foreground">{r.name}</div>
                        )}
                        <div className="mt-1 text-body-sm text-muted-foreground">
                          {r.when ? `${r.when} on ` : "Review on "}
                          <span className="font-semibold text-foreground">{r.platform}</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-5 text-pretty text-body text-foreground/70" style={{ lineHeight: "1.6" }}>
                      {text}
                    </p>
                  </li>
                );
              })}
            </ul>
          </VoipReviewsWallFold>
        </div>
      </div>
    </section>
  );
}
