"use client";

/**
 * The annotated photograph: pick a callout, the frame goes to it.
 *
 * This replaced a static version with leader lines drawn from a column of
 * labels into the photograph. That version failed for a reason worth writing
 * down, because it is the reason not to bring it back: the details it pointed
 * at are forty pixels wide in a 16:9 frame, so the lines had to cross most of
 * the picture to reach them, and each label's rule sat between its own text
 * and the next label's title, where it read as an underline for the wrong one.
 * A diagram that needs a key is not a diagram.
 *
 * NOT RENDERED ANYWHERE. It shipped on the cars page for an afternoon and was
 * pulled; FinishedInstallSection went back to the static figure. It is the
 * only thing importing `motion`, so deleting this file makes that dependency
 * removable too.
 *
 * So instead of drawing longer lines to the detail, the frame travels to it.
 * ZOOM and centreOn live in finished-install-data.ts with the coordinates.
 *
 * Motion (ex Framer Motion) earns its ~35 KB here on one thing: the spring. A
 * photograph zoomed with a duration and an easing curve reads as a slide
 * changing; the same move on a spring reads as something being picked up and
 * brought closer, which is the difference between an effect and a tool. The
 * dimming, the ring and the marker fades would all be fine in CSS.
 *
 * The controls are the labels, not the dots on the photograph. Three buttons
 * with aria-pressed beat three 12px targets on an image: it works from the
 * keyboard, it works for a thumb, and the state is announced rather than
 * implied. The titles are spans rather than h3s because a heading inside a
 * button is invalid HTML; the section's own h2 carries the outline.
 *
 * KNOWN WEAKNESS. Nothing on the page says the photograph moves. A reader who
 * never presses a label sees a wide shot and three sentences, which is no
 * worse than the old version but wastes what this is for. The two candidate
 * fixes, neither of them shipped: a single slow pass through the three
 * callouts the first time the section comes into view, stopping on any
 * interaction and never repeating; or one line of copy under the list. Decide
 * before this page takes paid traffic.
 */

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { DOTS, PHOTO, ZOOM, centreOn } from "./finished-install-data";

export function FinishedInstallFigure() {
  const [active, setActive] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const d = active === null ? null : DOTS[active];
  const offset = d ? centreOn(d) : { x: "0%", y: "0%" };

  /* Reduced motion keeps the zoom, which is information, and drops the spring
     for a cut. */
  const move = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 140, damping: 20, mass: 0.9 };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[34%_66%] lg:gap-10">
      <ol className="order-2 mt-6 space-y-2 lg:order-1 lg:mt-0 lg:flex lg:h-full lg:flex-col lg:justify-center lg:space-y-4">
        {DOTS.map((dot, i) => {
          const on = active === i;
          return (
            <li key={dot.title}>
              <button
                type="button"
                aria-pressed={on}
                data-on={on}
                onClick={() => setActive(on ? null : i)}
                className="group w-full rounded-lg border border-transparent px-4 py-3 text-left transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border data-[on=true]:border-border data-[on=true]:bg-background"
              >
                <span className="flex items-center gap-3">
                  <motion.span
                    aria-hidden="true"
                    animate={{ scale: on ? 1 : 0.8, opacity: on ? 1 : 0.45 }}
                    transition={move}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[13px] font-semibold tabular-nums text-foreground"
                  >
                    {i + 1}
                  </motion.span>
                  <span className="text-lead font-semibold text-foreground">{dot.title}</span>
                </span>
                <motion.span
                  animate={{ opacity: on || active === null ? 1 : 0.45 }}
                  transition={{ duration: reduced ? 0 : 0.25 }}
                  className="mt-2 block pl-9 text-body-sm leading-[1.65] text-muted-foreground"
                >
                  {dot.detail}
                </motion.span>
              </button>
            </li>
          );
        })}
        <li className="pl-4 pt-1">
          <button
            type="button"
            onClick={() => setActive(null)}
            disabled={active === null}
            className="text-body-sm text-muted-foreground underline underline-offset-4 disabled:opacity-0"
          >
            Show the whole roof
          </button>
        </li>
      </ol>

      <figure className="order-1 m-0 lg:order-2">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-border">
          <motion.img
            src={PHOTO.src}
            srcSet={PHOTO.srcSet}
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={PHOTO.alt}
            loading="lazy"
            decoding="async"
            animate={{ scale: d ? ZOOM : 1, x: offset.x, y: offset.y }}
            transition={move}
            className="h-full w-full object-cover will-change-transform"
          />

          {/* Everything but the middle goes down. A vignette rather than a hard
              mask, so the reader still sees where they are on the roof. */}
          <motion.div
            aria-hidden="true"
            animate={{ opacity: d ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 0.35 }}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(20,17,15,0) 0 16%, rgba(20,17,15,.18) 34%, rgba(20,17,15,.62) 78%)",
            }}
          />

          {/* Markers while the frame is wide, a viewfinder ring once it has
              travelled, because the target is then dead centre. Neutral, never
              brand red: red on this page means the primary action. */}
          {DOTS.map((dot, i) => (
            <motion.span
              key={dot.title}
              aria-hidden="true"
              animate={{
                left: d ? "50%" : `${dot.x}%`,
                top: d ? "50%" : `${dot.y}%`,
                opacity: d ? (active === i ? 1 : 0) : 1,
                width: d && active === i ? 56 : 28,
                height: d && active === i ? 56 : 28,
              }}
              transition={move}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[rgba(20,17,15,.55)] bg-white/95 text-[13px] font-semibold tabular-nums text-foreground shadow-[0_1px_4px_rgba(20,17,15,.35)]"
              style={{
                borderColor: d && active === i ? "rgba(255,255,255,.95)" : undefined,
                background: d && active === i ? "transparent" : undefined,
              }}
            >
              <motion.span animate={{ opacity: d ? 0 : 1 }} transition={{ duration: reduced ? 0 : 0.15 }}>
                {i + 1}
              </motion.span>
            </motion.span>
          ))}
        </div>
        <figcaption className="mt-3 text-body-sm text-muted-foreground">{PHOTO.caption}</figcaption>
      </figure>
    </div>
  );
}
