import type { ReactNode } from "react";
import { Bell, Clock, Lightbulb, Moon } from "lucide-react";
import { Gap } from "./hikvision-gap";

/**
 * Colour at night, first under the hero. Takes the place of the Ajax page's
 * break-in scene (security-layers-section.tsx), which is an alarm story.
 *
 * Why first: colour after dark is what people ask Hikvision for by name ("do
 * you do the hikvison night colour vu", 13 of 81 camera buyers), and the
 * birds-and-foxes alerts are what owners of other systems complain about.
 *
 * DRAFT, 27 October 2026. The picture is a placeholder: a generated night
 * scene of the front of a house, in colour, with a car on the drive and
 * someone at the gate (prompt in hikvision-research/prompts-imagenes.md).
 * When it exists, the cards can light up in turn the way the Ajax scene
 * does; until then they are static.
 *
 * Every card waits on Jordan's question 2: whether ColorVu and AcuSense are
 * standard, which models carry a light and a siren, how many days are kept.
 * No Hikvision lab figures ("over 90% of false alarms filtered").
 */

type Card = { icon: ReactNode; title: string; detail: ReactNode };

const CARDS: Card[] = [
  {
    icon: <Moon className="h-5 w-5" />,
    title: "Colour after dark",
    detail: "See the car, the coat and the face, not a grey shape.",
  },
  {
    icon: <Bell className="h-5 w-5" />,
    title: "People and cars, not cats",
    detail: <Gap q="Q2" tone="dark">Alerts for a person or a vehicle, not every bird and fox.</Gap>,
  },
  {
    icon: <Lightbulb className="h-5 w-5" />,
    title: "A light and a warning",
    detail: <Gap q="Q2" tone="dark">The camera can light up and sound a warning when someone steps onto the drive.</Gap>,
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Recorded around the clock",
    detail: <Gap q="Q2" tone="dark">Every camera, kept for [X] days on the recorder in your home.</Gap>,
  },
];

const BAND = "#070b10";

export function HikvisionNightSection() {
  return (
    <section id="night" className="w-full scroll-mt-28 text-white" style={{ backgroundColor: BAND }}>
      <div className="relative overflow-hidden">
        {/* Placeholder for the night scene: the band's own colour, lit where
            the front door would be. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "radial-gradient(60% 70% at 72% 55%, rgba(255,190,120,0.16) 0%, rgba(13,27,42,0.6) 45%, #070b10 100%)" }}
        />
        <div className="container relative mx-auto py-20 md:py-28">
          <p className="eyebrow !text-[#ff6a5f]">
            <Gap q="Q2" tone="dark">Hikvision ColorVu</Gap>
          </p>
          <h2 className="mt-4 max-w-[640px] h2-section text-white">In colour, even at 3am.</h2>
          <p className="mt-4 max-w-[540px] text-pretty text-body text-white/70 md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
            Most cameras turn black and white after dark. ColorVu keeps the colour of the car, the coat and the face at the
            door, with a large lens and a soft warm light.
          </p>
          <p className="mt-6 text-body-sm text-white/60">
            <Gap q="Q8" tone="dark">Night scene image: the front of a house, in colour.</Gap>
          </p>
        </div>
      </div>

      <div className="container mx-auto pb-14 md:pb-20">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {CARDS.map((c) => (
            <li key={c.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                {c.icon}
              </span>
              <h3 className="mt-4 text-lg font-bold leading-tight text-white">{c.title}</h3>
              <p className="mt-1.5 text-pretty text-body-sm text-white/70" style={{ lineHeight: "1.55" }}>
                {c.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
