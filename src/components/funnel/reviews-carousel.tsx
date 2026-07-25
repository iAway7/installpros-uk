"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReviewCard } from "./review-card";
import type { Review } from "@/lib/reviews/google-reviews";

const GAP = 14; // px, matches gap-3.5

/** Horizontal review slider: 3 cards on desktop (2 on tablet, 1 on mobile),
 *  arrows advance one card at a time. Native scroll-snap = swipe on touch. */
export function ReviewsCarousel({
  reviews,
  source = "google",
}: {
  reviews: Review[];
  source?: "google" | "trustpilot";
}) {
  const track = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + GAP : el.clientWidth / 3;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const scrollable = reviews.length > 1;

  return (
    <div className="relative">
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((r, i) => (
          <div
            key={`${r.name}-${i}`}
            data-card
            className="shrink-0 basis-full snap-start sm:basis-[calc(50%-7px)] lg:basis-[calc(33.333%-10px)]"
          >
            <ReviewCard r={r} source={source} />
          </div>
        ))}
      </div>

      {scrollable && (
        <>
          <button
            type="button"
            aria-label="Previous reviews"
            onClick={() => scrollByCard(-1)}
            className="absolute -left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-md transition hover:bg-secondary md:-left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next reviews"
            onClick={() => scrollByCard(1)}
            className="absolute -right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-md transition hover:bg-secondary md:-right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}
