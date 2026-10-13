import { DoorOpen, Footprints, ScanEye } from "lucide-react";
import type { ReactNode } from "react";

/**
 * How the devices protect the home, first under the hero.
 *
 * Will's first question, 13 October 2026, in his words: "How do the devices
 * work together to protect them (benefits compared to contacts vs our
 * vibration sensors, extra layers of protection we provide) and verification
 * to avoid false alarms". And his sales language: "protect vulnerable entry
 * and exit points". So the section is three layers in the order a break-in
 * meets them: the way in, the inside, and the check that it is real.
 *
 * The contact vs vibration point is the one detail a buyer does not already
 * know: a contact tells you a door opened, a vibration sensor tells you
 * someone is forcing it. That is the "extra layer" Will sells, so it gets
 * the first card.
 *
 * Verification is a detector with a camera that sends a photo with the alarm.
 * Not every detector has one, so the copy says "a detector with a camera",
 * not "every detector".
 *
 * Fire and leaks are a line under the cards, not a fourth layer: they are
 * not about anyone getting in.
 */

type Layer = { icon: ReactNode; title: string; detail: string; tags: string[] };

const LAYERS: Layer[] = [
  {
    icon: <DoorOpen className="h-5 w-5" />,
    title: "Doors and windows",
    detail:
      "A contact knows the moment a door or window opens. A vibration sensor goes further: it feels someone forcing the frame or the glass, before it gives.",
    tags: ["Door and window contacts", "Vibration sensors"],
  },
  {
    icon: <Footprints className="h-5 w-5" />,
    title: "Inside the house",
    detail:
      "Motion detectors cover the rooms anyone would have to cross. They are set to ignore the dog or the cat, so the pets do not set it off.",
    tags: ["Motion detectors", "Pet-friendly"],
  },
  {
    icon: <ScanEye className="h-5 w-5" />,
    title: "Checked before anyone panics",
    detail:
      "A detector with a camera sends a photo with the alert, so you see straight away whether it is a break-in or a false alarm.",
    tags: ["Photo verification", "Fewer false alarms"],
  },
];

export function SecurityLayersSection() {
  return (
    <section id="protection" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-7">
          <div>
            <p className="eyebrow">Layers of protection</p>
            <h2 className="mt-4 max-w-[640px] h2-section text-foreground">
              Every way in,
              <br className="hidden sm:block" /> protected in layers.
            </h2>
          </div>
          <p className="max-w-[440px] text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            A break-in starts at a door or a window, so that is where the first layer goes. The second is inside, and
            the third tells you what happened.
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-3">
          {LAYERS.map((l, i) => (
            <li key={l.title} className="flex flex-col rounded-xl border border-border bg-background p-6 md:p-8">
              <div className="flex items-center justify-between">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/[0.06] text-brand-icon"
                >
                  {l.icon}
                </span>
                {/* The <ol> carries the order for screen readers. */}
                <span aria-hidden="true" className="text-lead font-semibold tabular-nums text-muted-foreground/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 text-lead font-semibold text-foreground">{l.title}</h3>
              <p className="mt-2 text-body-sm leading-[1.65] text-muted-foreground">{l.detail}</p>
              <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                {l.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-border bg-secondary px-3 py-1 text-caption font-medium text-foreground"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <p className="mt-8 max-w-3xl text-body-sm leading-[1.65] text-muted-foreground">
          Smoke, heat and leak detectors join the same system, so the app also tells you about a fire or a burst pipe.
        </p>
      </div>
    </section>
  );
}
