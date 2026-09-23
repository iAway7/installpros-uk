"use client";

/**
 * The rail of finished installs under the annotated photograph.
 *
 * Same mechanics as ReviewsCarousel, deliberately: native scroll-snap so a
 * thumb swipes it, side arrows from sm up, arrows and dots on a phone, and no
 * autoplay anywhere. A gallery that moves on its own while someone is reading
 * a caption is the hero-carousel mistake in a smaller frame.
 *
 * ── THE SLIDES ARE MOSTLY EMPTY ON PURPOSE ──────────────────────────────────
 * The first two are real photographs and lead the rail for that reason. The
 * rest are marked "Photo pending" and
 * carry the shot they are waiting for, because this section's whole job is
 * proof: a stock photo of someone else's roof in a rail titled "others we have
 * fitted" is the exact lie it exists to kill, and it is the kind of thing that
 * survives a launch by accident.
 *
 * So the placeholders double as the brief. The four are the segment the corpus
 * actually shows (32 vehicles in four weeks: motorhomes first, then campers and
 * vans, four cars and a taxi) crossed with what Will has said the team has
 * already done, "a number of Klassen Mercedes Benz and Private hire vehicles".
 *
 * PENDING CARDS DO NOT SHIP. Before this page goes live, every slide still
 * carrying `pending` comes out, down to a minimum of three. A dashed hole in a
 * rail titled "Others we have fitted" reads as having fitted nothing, which is
 * worse than a shorter rail.
 *
 * When a real photograph arrives, drop it in `src`/`srcSet`, write a real
 * `alt`, and delete the `pending` line. Nothing else changes.
 * ────────────────────────────────────────────────────────────────────────────
 *
 * ── WRITING A CAPTION ───────────────────────────────────────────────────────
 * The caption says what the photograph cannot. Never describe what is visible.
 * The formula, in order: what the mount grips, what it cleared or avoided, then
 * the number. One sentence or two.
 *
 * It is set by what the enquiries actually ask. Across 48 vehicle enquiries:
 * how it fixes to the roof (10), how much height it adds and what is already up
 * there (12), what it looks like against the paint (3). Permanent versus
 * removable is asked more often still (14), and it is not in here on purpose,
 * because PermanentOrRemovable answers it in full further down the same page
 * and a rail that repeats it spends its captions twice. If an install is
 * removable, that goes in `detail`, never in the badge.
 *
 * Nobody, out of 48, asked about speed. No speed claim goes near these
 * captions.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GAP = 14; // px, matches gap-3.5

type Shot = {
  /** Present once there is a real photograph. */
  src?: string;
  srcSet?: string;
  alt?: string;
  vehicle: string;
  /** The mount, and nothing else. Three values, no free text: the page states
   *  elsewhere that we do not fit suction mounts, so a badge reading "Suction"
   *  would contradict the section it sits in, and these three are what the
   *  photographs actually show. We do drill where a hole is the right answer,
   *  so add "Drill" when a drilled install turns up in this rail. Roof mounts
   *  only; a slide that is not one, such as the router, leaves it off. */
  fixing?: "Magnets" | "Clamp" | "Bonded plate";
  detail: string;
  /** The shot we are waiting on. Present means the card renders as a hole. */
  pending?: string;
  /** For a slide that HAS its photograph but is missing a fact. It renders
   *  nothing; it is here so the question travels with the slide instead of
   *  living in somebody's head. Clear it when the answer lands. */
  confirm?: string;
};

/* THE NUMBER THAT IS MISSING. Twelve of the 48 enquiries ask about height and
   roof clearance and not one caption below answers it, because nobody has
   measured the added height on a fitted vehicle. Do not estimate it from a
   photograph. Once it is measured, it goes into captions 1 and 4 as a plain
   clause, "Adds N cm above the roof line", and it is the single highest value
   thing missing from this rail. */
const SHOTS: Shot[] = [
  {
    src: "/funnel/install-motorhome-roof.webp",
    srcSet:
      "/funnel/install-motorhome-roof-960.webp 960w, /funnel/install-motorhome-roof-1280.webp 1280w, /funnel/install-motorhome-roof.webp 1920w",
    alt: "A Starlink Mini fitted flat to the roof of a coachbuilt motorhome, between a solar panel and a rooflight",
    vehicle: "Coachbuilt motorhome",
    fixing: "Bonded plate",
    detail:
      "Bonded to the GRP roof between the solar panel and the rooflight. Nothing drilled, nothing overhanging the edge.",
  },
  {
    src: "/funnel/install-roof-profile.webp",
    srcSet:
      "/funnel/install-roof-profile-960.webp 960w, /funnel/install-roof-profile-1280.webp 1280w, /funnel/install-roof-profile.webp 1920w",
    alt: "A low-profile Starlink Mini enclosure fitted flat to a dark vehicle roof, beside the roof bars and a roof box, outside the workshop",
    // No `fixing` badge: the enclosure is closed in this frame, so no magnet,
    // clamp or plate is visible and a badge would be asserting something the
    // photograph does not show.
    vehicle: "Fitted between the rails",
    // Shot side on, which no other photograph we have is. 12 of the 48 vehicle
    // enquiries ask how much height it adds and this is the frame that can
    // answer it: the roof bar beside it gives the scale. The number goes in
    // this caption the day it is measured.
    detail: "Sits this proud of the roof, alongside the bars and the box that were already there.",
    confirm:
      "Which vehicle is it, what is holding it on under the enclosure, and how many centimetres does it stand above the roof line?",
  },
  {
    vehicle: "Mercedes V-Class",
    fixing: "Magnets",
    detail:
      "Black mount on black paint, magnets on the steel roof. Cable in through the boot seal, no hole anywhere.",
    pending:
      "Roof three-quarter from a step, mount and dish both in frame. Measure the height above the roof line.",
  },
  {
    vehicle: "Pop-top campervan",
    fixing: "Clamp",
    detail:
      "Clamped to the seam so the roof still lifts. No rails needed, nothing to move before you pitch.",
    pending: "Roof with the top down, showing the clamp on the seam.",
  },
  {
    vehicle: "Panel van",
    fixing: "Magnets",
    detail:
      "Magnets on the steel roof, fused feed off the leisure battery. Works with the engine off.",
    pending:
      "Roof from above, plus a detail of the magnetic base. Measure the height above the roof line.",
  },
  {
    vehicle: "Inside",
    detail: "Router out of the way on a fused feed, cable run hidden the whole way.",
    pending: "The router where it ends up, with the cable run visible.",
  },
];

export function InstallGallery() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const step = () => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    return card ? card.offsetWidth + GAP : (el?.clientWidth ?? 1) / 3;
  };
  const scrollByCard = (dir: 1 | -1) =>
    track.current?.scrollBy({ left: dir * step(), behavior: "smooth" });
  const scrollToIndex = (i: number) => {
    const clamped = Math.max(0, Math.min(SHOTS.length - 1, i));
    track.current?.scrollTo({ left: clamped * step(), behavior: "smooth" });
  };
  const onScroll = () => {
    const el = track.current;
    if (el) setActive(Math.round(el.scrollLeft / step()));
  };

  return (
    <div className="mt-14 md:mt-16">
      <h3 className="text-lead font-semibold text-foreground">Others we have fitted.</h3>

      <div className="relative mt-5">
        <div
          ref={track}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory items-stretch gap-3.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SHOTS.map((s) => (
            <figure
              key={s.vehicle}
              data-card
              // Never a whole number of cards per view. 90 / 66 / 40 all leave
              // part of the next one showing, which is the only thing that
              // tells a reader the rail scrolls: two cards sitting flush in a
              // 1280 window look like a finished row of two.
              className="m-0 shrink-0 basis-[90%] snap-start sm:basis-[66%] lg:basis-[40%]"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-secondary">
                {s.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.src}
                    srcSet={s.srcSet}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 86vw"
                    alt={s.alt ?? ""}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/40 px-6 text-center">
                    <span className="text-caption font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Photo pending
                    </span>
                    <span className="text-body-sm leading-[1.5] text-muted-foreground">{s.pending}</span>
                  </div>
                )}
              </div>
              <figcaption className="mt-3">
                {/* Beside the vehicle name, not over the photograph. These
                    plates run from white GRP in sunlight to black paint in a
                    workshop, and an overlay would need a scrim on top of the
                    one thing the page is selling. flex-wrap so the pill drops
                    to its own line at 320px instead of pushing the card. */}
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-body-sm font-semibold text-foreground">{s.vehicle}</span>
                  {s.fixing && (
                    /* `relative` is load-bearing. `sr-only` is position:absolute,
                       and with no positioned ancestor its containing block was
                       the rail wrapper, outside the scroll container. An
                       absolutely positioned box whose containing block sits
                       outside a scroller is not clipped by it, so the hidden
                       label on card four sat at x 800 and stretched the document
                       565px at 320px wide. Pinning it to the pill puts it back
                       inside the clip. */
                    <span className="relative inline-flex rounded-full border border-border px-2 py-0.5 text-caption text-muted-foreground">
                      <span className="sr-only">Fixing: </span>
                      {s.fixing}
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-body-sm leading-[1.6] text-muted-foreground">{s.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Desktop side arrows, same geometry as the reviews rail apart from the
            vertical anchor. The reviews one centres on the card because a card
            of text has no focal point; here the photograph is about the top three
            quarters of the card and the caption the rest, so 38% lands within a
            few pixels of the middle of the image at every width where the
            arrows are visible. Change the card
            width and this number moves with it. */}
        <button
          type="button"
          aria-label="Previous installs"
          onClick={() => scrollByCard(-1)}
          className="absolute -left-3 top-[38%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-raised transition duration-quick ease-ds hover:bg-secondary sm:flex md:-left-5"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next installs"
          onClick={() => scrollByCard(1)}
          className="absolute -right-3 top-[38%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-raised transition duration-quick ease-ds hover:bg-secondary sm:flex md:-right-5"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Phone controls: one card at a time, arrows and dots. Five slides, so
          the dot row is well inside the width where dots still work. */}
      <div className="mt-4 flex items-center justify-center gap-3 sm:hidden">
        <button
          type="button"
          aria-label="Previous install"
          onClick={() => scrollToIndex(active - 1)}
          disabled={active === 0}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm transition disabled:opacity-40"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center">
          {SHOTS.map((s, i) => (
            <button
              key={s.vehicle}
              type="button"
              aria-label={`Go to ${s.vehicle}`}
              aria-current={i === active}
              onClick={() => scrollToIndex(i)}
              className="flex h-8 w-8 items-center justify-center"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-quick ${
                  i === active ? "w-5 bg-foreground" : "w-2 bg-muted-foreground/40"
                }`}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Next install"
          onClick={() => scrollToIndex(active + 1)}
          disabled={active === SHOTS.length - 1}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm transition disabled:opacity-40"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
