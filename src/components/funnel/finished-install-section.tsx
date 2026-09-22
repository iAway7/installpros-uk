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
 * No JavaScript in the figure: every label is visible at once, desktop draws
 * the leader lines and the phone numbers the markers and repeats them as a
 * list underneath. A Motion version that zoomed the frame to each callout
 * briefly shipped here and was pulled; it survives, unused, as
 * finished-install-figure.tsx.
 *
 * Coordinates are percentages of the photograph, so a re-crop that keeps the
 * subject keeps the callouts. Change the photo, change three pairs of numbers.
 *
 * ── PENDING, BEFORE THIS GOES ANYWHERE NEAR PAID TRAFFIC ────────────────────
 1. CONFIRM WITH WILL WHAT THE FEET ARE. The photograph and its callouts live
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
            first row is exactly as tall as the photograph. `labelY` is a
            percentage of that row, and the labels only line up with their
            leader lines while nothing else shares it. */}
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

            {/* One straight line per callout, from the photo edge at the
                label's own height to its dot. The previous version ran a
                horizontal segment and then turned, which put a kink in the
                middle of the picture and made two of the three cross near the
                dish. Straight lines cannot cross here because the labels are
                in the same vertical order as the points they name.

                The viewBox is the photograph's own 16:9, so a percentage maps
                to x*16 / y*9 and the markers land on the same point. Two
                strokes: a dark one to survive the white roof, a white one to
                survive the shadows. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 1600 900"
              preserveAspectRatio="none"
              className="absolute inset-0 hidden h-full w-full lg:block"
            >
              {DOTS.map((d) => {
                const line = `0,${d.labelY * 9} ${d.x * 16},${d.y * 9}`;
                return (
                  <g key={d.title}>
                    <polyline points={line} fill="none" stroke="rgba(20,17,15,.35)" strokeWidth={3} vectorEffect="non-scaling-stroke" />
                    <polyline points={line} fill="none" stroke="rgba(255,255,255,.92)" strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
                  </g>
                );
              })}
            </svg>

            {/* Numbered at every width now. The number does the binding between
                a label and its point, which leaves the line free to be quiet
                instead of load-bearing. Markers in HTML, not SVG, so the digit
                is real text at a real size. Neutral, never brand red. */}
            {DOTS.map((d, i) => (
              <span
                key={d.title}
                aria-hidden="true"
                style={{ left: `${d.x}%`, top: `${d.y}%` }}
                className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(20,17,15,.35)] bg-white text-[13px] font-semibold tabular-nums text-foreground shadow-[0_1px_4px_rgba(20,17,15,.3)] lg:h-6 lg:w-6 lg:text-[12px]"
              >
                {i + 1}
              </span>
            ))}
          </div>

          <figcaption className="mt-3 text-body-sm text-muted-foreground lg:col-start-2 lg:row-start-2">
            {PHOTO.caption}
          </figcaption>

          <ol className="relative mt-8 space-y-8 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:space-y-0">
            {DOTS.map((d, i) => (
              <li
                key={d.title}
                style={{ ["--y" as string]: `${d.labelY}%` }}
                /* -14px, half the 28px number, so it is the NUMBER that sits on
                   `labelY` and not the top of the block. That is what puts the
                   hairline, the number and the leader line on one axis. */
                className="lg:absolute lg:left-0 lg:top-[var(--y)] lg:w-full lg:-translate-y-[14px]"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[13px] font-semibold tabular-nums text-foreground"
                  >
                    {i + 1}
                  </span>
                  <h3 className="text-lead font-semibold text-foreground">{d.title}</h3>
                  {/* Leaves the title and runs to the photo edge, where the
                      line picks it up. Only as long as the space left over, so
                      it reads as a leader rather than a divider between two
                      labels, which is how the old full-width rule read. */}
                  <span aria-hidden="true" className="hidden h-px flex-1 bg-foreground/15 lg:block" />
                </div>
                <p className="mt-2 pl-10 text-body-sm leading-[1.65] text-muted-foreground lg:pr-6">
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
