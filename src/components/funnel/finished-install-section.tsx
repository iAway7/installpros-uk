/**
 * A finished install: one real photograph, annotated.
 *
 * Why it exists, in the chat log's own words: "Can you send me some reviews/
 * pics of motorhome installs??", "Any pictures what it would look like on top
 * of my motorhome?", "How is your vehicle mount? Can u send me a picture?".
 * Seven of the thirty-six vehicle conversations asked to see a finished install
 * before deciding (see the page header and vehicle-fit-section.tsx). It sits
 * directly under the hero because that is the first thing the segment asks for,
 * and because on a phone this page loses most of its readers before the third
 * screen.
 *
 * One photograph, annotated, with the rail of the others under it. What they
 * ask is a single question, how it mounts AND what it looks like, so a caption
 * that repeats the claim is worth less than a callout that goes to the thing
 * itself.
 *
 * The rule every callout follows: IT ENDS ON THE THING ITS LABEL NAMES. The
 * pattern is everywhere as decoration (a line to a hard hat labelled "100%
 * satisfaction"), and decoration is the one thing this section cannot afford:
 * it is here to prove, and a callout that points at nothing proves nothing. If
 * a fact is not visible in the frame, it stays in VehicleFitSection as text.
 * That is why there are three callouts and not six, and why there is none for
 * the cable: it leaves the dish and runs to the roof trim, but the entry point
 * is out of shot.
 *
 * ── NO LEADER LINES, AND THAT WAS A DECISION ────────────────────────────────
 * The number does the binding. The same numbered marker sits on the photograph
 * and beside its label, which is the ordinary convention for a keyed figure and
 * needs no measuring to survive a re-crop or a narrow screen.
 *
 * Desktop used to draw a straight line from each label to its dot. It was
 * pulled: three diagonals raking across the subject is noise over a photograph
 * whose only job is evidence, and callouts 2 and 3 converged from 27 points
 * apart to under 7 near the dish, which reads as a tangle even though they
 * never actually cross. The real cost was structural, though. The lines forced
 * every label to sit at its own point's height, so the column could not be
 * spaced typographically and a re-crop meant re-tuning three more numbers.
 * Without them the labels space evenly down the photograph and a re-crop moves
 * only the markers. Do not put them back.
 * ────────────────────────────────────────────────────────────────────────────
 *
 * No JavaScript in the figure: every label is visible at once, at every width.
 * A Motion version that zoomed the frame to each callout briefly shipped here
 * and was pulled; it survives, unused, as finished-install-figure.tsx.
 *
 * Coordinates are percentages of the photograph, so a re-crop that keeps the
 * subject keeps the callouts. Change the photo, change three pairs of numbers.
 *
 * ── PENDING, BEFORE THIS GOES ANYWHERE NEAR PAID TRAFFIC ────────────────────
 * 1. CONFIRM WITH WILL WHAT THE FEET ARE. The photograph and its callouts live
 *    in finished-install-data.ts; the note is on DOTS[2] there.
 * 2. The photograph carries phone portrait-mode blur, which softens the
 *    workshop full of motorhomes behind it — the part that quietly says this
 *    is done all day. Swap in the unprocessed original when it turns up, at
 *    3000px or wider so the dish edge survives the phone crop.
 * 3. A second vehicle (a van, or a dark car for the white-dish-on-black-paint
 *    question in the FAQ) turns this into a two-photo section with the vehicle
 *    named under each. One is enough to ship.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { DOTS, PHOTO } from "./finished-install-data";
import { InstallGallery } from "./install-gallery";

export function FinishedInstallSection() {
  return (
    <section id="a-finished-install" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-10 max-w-2xl md:mb-12">
          <p className="eyebrow">A finished install</p>
          <h2 className="mt-4 h2-section text-foreground">This is what a finished one looks like.</h2>
        </div>

        {/* One <figure> as the grid, so the caption stays a figcaption and the
            first row is exactly as tall as the photograph. The label column
            stretches to that row and spreads its three entries down it. */}
        <figure className="m-0 lg:grid lg:grid-cols-[34%_66%] lg:grid-rows-[auto_auto]">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border bg-border lg:col-start-2 lg:row-start-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PHOTO.src}
              srcSet={PHOTO.srcSet}
              sizes="(min-width: 1024px) 66vw, 100vw"
              alt={PHOTO.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />

            {/* The marker is the whole binding now, so it keeps one size at
                every width instead of shrinking politely on desktop. In HTML
                rather than SVG, so the digit is real text at a real size.
                Neutral, never brand red: the red is the primary action's. */}
            {DOTS.map((d, i) => (
              <span
                key={d.title}
                aria-hidden="true"
                style={{ left: `${d.x}%`, top: `${d.y}%` }}
                className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(20,17,15,.35)] bg-white text-[13px] font-semibold tabular-nums text-foreground shadow-[0_1px_4px_rgba(20,17,15,.3)]"
              >
                {i + 1}
              </span>
            ))}
          </div>

          <figcaption className="mt-3 text-body-sm text-muted-foreground lg:col-start-2 lg:row-start-2">
            {PHOTO.caption}
          </figcaption>

          {/* Centred as a group against the photograph, with one even gap.
              justify-between was tried first and pushed the three entries to
              the extremes of a 446px column, roughly 95px apart, which read as
              three unrelated blocks instead of one key. */}
          <ol className="mt-8 space-y-8 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex lg:h-full lg:flex-col lg:justify-center lg:gap-8 lg:space-y-0">
            {DOTS.map((d, i) => (
              <li key={d.title} className="lg:pr-8">
                <div className="flex items-center gap-3">
                  {/* Same size and weight as the marker on the photograph, so
                      the two read as one object in two places. */}
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[13px] font-semibold tabular-nums text-foreground"
                  >
                    {i + 1}
                  </span>
                  <h3 className="text-lead font-semibold text-foreground">{d.title}</h3>
                </div>
                <p className="mt-2 pl-10 text-body-sm leading-[1.65] text-muted-foreground">
                  {d.detail}
                </p>
              </li>
            ))}
          </ol>
        </figure>

        {/* The rail lives inside this section rather than getting its own, so
            the page keeps its grey/white rhythm and the two halves of the same
            argument — this is what one looks like, here are more of them — are
            not separated by a background change. */}
        <InstallGallery />
      </div>
    </section>
  );
}
