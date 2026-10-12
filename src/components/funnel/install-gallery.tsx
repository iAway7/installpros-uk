"use client";

/**
 * The rail of finished installs under the annotated photograph.
 *
 * Same mechanics as ReviewsCarousel, deliberately: native scroll-snap so a
 * thumb swipes it, side arrows from sm up, arrows and dots on a phone, and no
 * autoplay anywhere. A gallery that moves on its own while someone is reading
 * a caption is the hero-carousel mistake in a smaller frame.
 *
 * ── EVERY SLIDE IS A REAL INSTALL, AND THAT IS THE RULE ─────────────────────
 * It launched with two photographs and four dashed holes carrying the shot
 * they were waiting for. Will sent the other two on 28 September and the holes
 * came out the same day. They do not come back: a rail titled "Others we have
 * fitted" with a placeholder in it says we have fitted nothing, and a stock
 * photograph of somebody else's roof is the exact lie this section exists to
 * kill. There is no `pending` field any more, so the rule is structural rather
 * than something to remember. Shots still wanted are briefed above SHOTS.
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
  src: string;
  srcSet: string;
  alt: string;
  vehicle: string;
  /** The mount, and nothing else. Three values, no free text: the page states
   *  elsewhere that we do not fit suction mounts, so a badge reading "Suction"
   *  would contradict the section it sits in, and these three are what the
   *  photographs actually show. We do drill where a hole is the right answer,
   *  so add "Drill" when a drilled install turns up in this rail. Roof mounts
   *  only; a slide that is not one, such as the router, leaves it off. */
  fixing?: "Magnets" | "Clamp" | "Bonded plate" | "Drilled" | "Sealed gland";
  /** POLICY SINCE 2026-10-12: every slide carries a badge and a caption, and
   *  where nobody has confirmed the fixing they are our best reading of the
   *  photograph, marked `assumed: true` and listed for Will to correct. The
   *  earlier rule, badge only when confirmed, left seven of eight slides bare
   *  and the user chose a page that says something over one that waits. A
   *  wrong badge is one word to fix once Will answers; keep the question in
   *  `confirm` until he does, then drop both. */
  assumed?: boolean;
  detail: string;
  /** For a slide that HAS its photograph but is missing a fact. It renders
   *  nothing; it is here so the question travels with the slide instead of
   *  living in somebody's head. Clear it when the answer lands. */
  confirm?: string;
};

/* THE NUMBER THAT IS MISSING. Twelve of the 48 enquiries ask about height and
   roof clearance and no caption below answers it, because nobody has measured
   the added height on a fitted vehicle. Do not estimate it from a photograph.
   Once it is measured it goes into the profile captions as a plain clause,
   "Adds N cm above the roof line", and it is the single highest value thing
   missing from this rail.

   STILL WANTED FROM WILL, in rough order of what they would unlock. These used
   to sit in the rail as "Photo pending" cards and came out when the fourth real
   photograph landed: a rail titled "Others we have fitted" with holes in it
   says we have fitted nothing, so the briefs live here instead.
     - The router where it ends up, with the cable run visible. Nothing on this
       page shows the inside of a vehicle.
     - A pop-top campervan, top down, showing the clamp on the seam. It is the
       one mount type with no photograph and the only one that has to survive a
       roof that lifts.
     - (ARRIVED 2026-10-12, two shots: install-mount-open and
       install-mount-profile.) The mount open, before the enclosure goes on.
       What the plate is held to the roof WITH is still not confirmed, so the
       badge stays off those two until Will names it. No slide carries a
       badge now: the one that did was the Google photograph, removed
       2026-10-12, and its "Bonded plate" was never confirmed either.

   HELD, NOT PUBLISHED, from the same 2026-10-12 batch:
     - An interior shot: a lit red button on an overhead panel, a small dark
       square beside it, the photographer's hand reflected in it. Nobody here
       can say what it shows, so no caption can be written for it, assumed or
       not. If it is the router's home or the power switch it is the interior
       photograph this page has wanted from the start; ask Will what it is.
   */
const SHOTS: Shot[] = [
  {
    src: "/funnel/install-street.webp",
    srcSet:
      "/funnel/install-street-960.webp 960w, /funnel/install-street-1280.webp 1280w, /funnel/install-street.webp 1600w",
    alt: "A low-profile Starlink Mini enclosure on the factory roof rails of a dark vehicle, parked at a house",
    // Cropped from the bottom of the frame rather than the middle: the original
    // has the customer's street sign legible in the top left corner.
    vehicle: "Fitted at the address",
    fixing: "Clamp",
    assumed: true,
    detail: "On the factory roof rails, black on black, at a house rather than a workshop.",
    confirm: "ASSUMED Clamp: on factory roof rails the usual fit is a clamp to the rail. " +
      "Which vehicle is this one, and what is under the enclosure?",
  },
  {
    src: "/funnel/install-cable-entry.webp",
    srcSet:
      "/funnel/install-cable-entry-960.webp 960w, /funnel/install-cable-entry-1280.webp 1280w, /funnel/install-cable-entry.webp 1600w",
    alt: "The cable leaving a Starlink enclosure, clipped flat across the roof and into a sealed gland screwed to the panel",
    // The one the rail was missing. VehicleFitSection promises "Hidden cable,
    // no leaks" and the annotated photograph above cannot show it: the cable
    // leaves the dish and disappears behind the trim. This frame is the entry
    // itself, gland and all, and it pairs with the FAQ line about a hole being
    // the right answer sometimes and being sealed when it is.
    vehicle: "Where the cable goes in",
    fixing: "Sealed gland",
    assumed: true,
    detail: "Through a sealed gland, with the cable clipped flat to the roof.",
    confirm: "ASSUMED Sealed gland: a gland is what the photograph shows; the badge names the entry, not a mount. " +
      "Which vehicle is this, and is this the standard gland on a metal roof?",
  },
  {
    src: "/funnel/install-roof-profile.webp",
    srcSet:
      "/funnel/install-roof-profile-960.webp 960w, /funnel/install-roof-profile-1280.webp 1280w, /funnel/install-roof-profile.webp 1920w",
    alt: "A low-profile Starlink Mini enclosure fitted flat to a dark vehicle roof, beside the roof bars and a roof box, outside the workshop",
    // No `fixing` badge: the enclosure is closed in this frame, so no magnet,
    // clamp or plate is visible and a badge would assert what the photograph
    // does not show. Same for the two above.
    vehicle: "Fitted between the rails",
    fixing: "Magnets",
    assumed: true,
    // Shot side on. 12 of the 48 vehicle enquiries ask how much height it adds
    // and this is the frame that can answer it: the roof bar gives the scale.
    detail: "Sits this proud of the roof, alongside the bars and the box that were already there.",
    confirm: "ASSUMED Magnets: a dark car roof between the rails is steel, and magnets are the standard Mini fit on steel. " +
      "Which vehicle is it, what is holding it on under the enclosure, and how many centimetres does it stand above the roof line?",
  },
  {
    src: "/funnel/install-mount-open.webp",
    srcSet: "/funnel/install-mount-open-960.webp 960w, /funnel/install-mount-open.webp 1200w",
    alt: "The mounting plate on a dark car roof with the enclosure off: a square plate with a bracket screwed at each corner, beside the factory roof rail",
    // The shot the rail was missing: every other photograph hides the fixing
    // under a closed enclosure. Cropped from y=352 of the original so the
    // legible plate of the car parked behind is outside the frame.
    vehicle: "The mount, before the enclosure",
    fixing: "Magnets",
    assumed: true,
    detail: "The plate the Mini sits on, before the enclosure goes over it. What holds the plate to the roof is under it, out of shot.",
    confirm: "ASSUMED Magnets: the black disc at the plate's edge reads as a magnetic base. " +
      "What is under the plate. The black disc at its edge looks like a magnetic base; confirm and the Magnets badge goes on this and the profile shot.",
  },
  {
    src: "/funnel/install-mount-profile.webp",
    srcSet: "/funnel/install-mount-profile-960.webp 960w, /funnel/install-mount-profile.webp 1200w",
    alt: "The mounting plate seen edge-on along a dark car roof, with the factory roof rail beside it for scale",
    // Same mount, seen along the roof line. Twelve of the 48 enquiries ask how
    // much height it adds; this is the first frame that can answer it, once
    // the number is in the caption.
    vehicle: "How much it adds",
    fixing: "Magnets",
    assumed: true,
    detail: "Seen along the roof line, with the factory rail for scale. This is the height before the enclosure goes on.",
    confirm: "ASSUMED Magnets: same mount as the top-down shot. " +
      "The height in centimetres: plate and brackets as shown, and the enclosure over them. It goes in this caption as a plain clause.",
  },
  {
    src: "/funnel/install-motorhome-white.webp",
    srcSet:
      "/funnel/install-motorhome-white-960.webp 960w, /funnel/install-motorhome-white-1280.webp 1280w, /funnel/install-motorhome-white.webp 1600w",
    alt: "A white low-profile Starlink Mini enclosure on the roof of a white coachbuilt motorhome, beside a vent dome",
    // Will's one instruction with this photograph: "Please blur the connection
    // at the front of this (the jigsaw piece)". Blurred at source, box
    // 820,975 to 950,1065 of the original, before the crop.
    vehicle: "Coachbuilt motorhome, white",
    fixing: "Bonded plate",
    assumed: true,
    detail: "Sited between the rooflight and the vent, clear of the solar panel behind. An enclosure the colour of the roof.",
    confirm: "ASSUMED Bonded plate: a GRP motorhome roof gives magnets nothing to hold; the page's own rule is a bonded plate there. " +
      "Which motorhome, and what is under the enclosure on a GRP roof.",
  },
  {
    src: "/funnel/install-maybach.webp",
    srcSet: "/funnel/install-maybach.webp 874w",
    alt: "A dark Mercedes-Maybach GLS at the workshop with its doors open, a small black Starlink enclosure between the roof rails",
    // A customer's identifiable car, in with the owner's permission, confirmed
    // 2026-10-12. The plate of the red car parked behind it is blurred at
    // source. The copy Will sent is 874px wide, so there is no ladder: ask
    // for the original if this ever needs to be larger than a rail card.
    //
    // The caption does not describe the dish because from this angle you
    // can barely see it, and that is the point for the prestige-car buyer in
    // the FAQ ("Will it look right on my vehicle?"). The grey shape above the
    // roof is the open tailgate, not the dish; the dish is the small box
    // between the rails.
    vehicle: "Mercedes-Maybach GLS",
    fixing: "Magnets",
    assumed: true,
    detail: "Between the rails and low enough that from the front you have to look for it. Fitted at the workshop.",
    confirm: "ASSUMED Magnets: between the rails on a steel roof. " +
      "What is holding it between the rails on this one, and whether the owner wants the car credited by name.",
  },
  {
    src: "/funnel/install-tilted-base.webp",
    srcSet:
      "/funnel/install-tilted-base-960.webp 960w, /funnel/install-tilted-base-1280.webp 1280w, /funnel/install-tilted-base.webp 1500w",
    alt: "A Starlink Mini angled towards the sky on a short pivot over a round black base, at the edge of a white van roof",
    // Held for a week on the question below, in now on the user's call that
    // an assumed caption Will can correct beats an empty rail. If the base is
    // a suction cup this slide comes OFF: the page says in two places that we
    // do not fit them.
    vehicle: "Angled to the sky",
    fixing: "Magnets",
    assumed: true,
    detail: "A magnetic base on the roof edge, with the dish tilted to clear what is around it. Nothing through the roof.",
    confirm: "ASSUMED Magnets: the round black base reads as a magnetic mount with a rubber skirt. If it is a suction cup, remove this slide. Also: which van?",
  },
  {
    src: "/funnel/install-cable-entry-van.webp",
    srcSet:
      "/funnel/install-cable-entry-van-960.webp 960w, /funnel/install-cable-entry-van-1280.webp 1280w, /funnel/install-cable-entry-van.webp 1600w",
    alt: "A black Starlink Mini enclosure on a grey ribbed van roof, its cable running into a Scanstrut gland beside an open rooflight and a solar panel",
    // Second cable entry on the rail, with the gland's make visible. Kept
    // because it is the only black enclosure on a grey roof we have, which
    // is the "what will it look like" answer for a grey van.
    vehicle: "Cable entry, grey van roof",
    fixing: "Sealed gland",
    assumed: true,
    detail: "Through a sealed gland beside the rooflight, clear of the solar panel. The enclosure matches the roof.",
    confirm: "ASSUMED Sealed gland: the gland is a Scanstrut, visible in the frame. Which van, and what holds the enclosure on a ribbed roof?",
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  srcSet={s.srcSet}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 86vw"
                  alt={s.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
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
