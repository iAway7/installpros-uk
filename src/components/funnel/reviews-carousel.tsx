"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReviewCard } from "./review-card";
import type { Review } from "@/lib/reviews/google-reviews";

const GAP = 14; // px, matches gap-3.5

/** Horizontal review slider. Desktop: 3 cards (2 tablet) with side arrows.
 *  Mobile: 1 card at a time with arrows + dots below. Native scroll-snap =
 *  swipe on touch. */
export function ReviewsCarousel({
  reviews,
  source = "google",
}: {
  reviews: Review[];
  source?: "google" | "trustpilot";
}) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const step = () => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    return card ? card.offsetWidth + GAP : (el?.clientWidth ?? 1) / 3;
  };

  const scrollByCard = (dir: 1 | -1) => {
    track.current?.scrollBy({ left: dir * step(), behavior: "smooth" });
  };

  const scrollToIndex = (i: number) => {
    const clamped = Math.max(0, Math.min(reviews.length - 1, i));
    track.current?.scrollTo({ left: clamped * step(), behavior: "smooth" });
  };

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / step()));
  };

  const scrollable = reviews.length > 1;

  return (
    <div className="relative">
      <div
        ref={track}
        onScroll={onScroll}
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

      {/* Desktop side arrows */}
      {scrollable && (
        <>
          <button
            type="button"
            aria-label="Previous reviews"
            onClick={() => scrollByCard(-1)}
            className="absolute -left-3 top-1/2 hidden h-11 w-11 sm:flex -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-md transition duration-200 ease-ds hover:bg-secondary md:-left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next reviews"
            onClick={() => scrollByCard(1)}
            className="absolute -right-3 top-1/2 hidden h-11 w-11 sm:flex -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-md transition duration-200 ease-ds hover:bg-secondary md:-right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Mobile controls: arrows + dots below (one card at a time) */}
      {scrollable && (
        <div className="mt-4 flex items-center justify-center gap-3 sm:hidden">
          <button
            type="button"
            aria-label="Previous review"
            onClick={() => scrollToIndex(active - 1)}
            disabled={active === 0}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm transition disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* w-8 h-8 = 32px de area tactil por punto (Chrome exige 24px
              minimo); el punto visible sigue siendo de 8px. Sin gap: la caja
              de 32px ya deja aire suficiente y evita desbordar en 375px
              cuando hay muchas resenas. */}
          <div className="flex items-center">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to review ${i + 1}`}
                aria-current={i === active}
                onClick={() => scrollToIndex(i)}
                className="flex h-8 w-8 items-center justify-center"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-200 ${
                    i === active ? "w-5 bg-foreground" : "w-2 bg-muted-foreground/40"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next review"
            onClick={() => scrollToIndex(active + 1)}
            disabled={active === reviews.length - 1}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm transition disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
