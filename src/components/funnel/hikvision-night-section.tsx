import type { ReactNode } from "react";
import { Bell, Clock, Lightbulb, Moon } from "lucide-react";

/**
 * Colour at night, first under the hero. Takes the place of the Ajax page's
 * break-in scene (security-layers-section.tsx), which is an alarm story.
 *
 * Why first: colour after dark is what people ask Hikvision for by name ("do
 * you do the hikvison night colour vu", 13 of 81 camera buyers), and the
 * birds-and-foxes alerts are what owners of other systems complain about.
 *
 * Section review, 27 October: what people asked to judge was clarity, not
 * megapixels ("So are they still quite clear", 13 threads), and one real
 * comparison image settled a 4MP or 8MP doubt. So real stills from an
 * InstallPros job, day and night, near and far, beat the render when Jordan
 * has them (question 8).
 *
 * The picture is a Gemini render (28 October): the camera's view of a front
 * drive at night, in colour, someone in a red coat at the gate. Behind the
 * heading from md up, with the dark street on the left under the text; on
 * phones it sits below the text. Real stills replace it if Jordan has them.
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
    detail: "Alerts for a person or a vehicle, not every bird and fox.",
  },
  {
    icon: <Lightbulb className="h-5 w-5" />,
    title: "A light and a warning",
    detail: "The camera can light up and sound a warning when someone steps onto the drive.",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Recorded around the clock",
    detail: "Every camera, kept for about 30 days on the recorder in your home.",
  },
];

// The page's one dark (Gus, 28 October).
const BAND = "#0e1013";

export function HikvisionNightSection() {
  return (
    <section id="night" className="w-full scroll-mt-28 text-white" style={{ backgroundColor: BAND }}>
      <div className="relative overflow-hidden md:min-h-[600px] lg:min-h-[680px]">
        <div className="container relative z-10 mx-auto pt-20 pb-8 md:py-28">
          <p className="eyebrow !text-[#ff6a5f]">
            Hikvision ColorVu
          </p>
          <h2 className="mt-4 max-w-[640px] h2-section text-white">In colour, even at 3am.</h2>
          <p className="mt-4 max-w-[540px] text-pretty text-body text-white/70 md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
            Most cameras turn black and white after dark. ColorVu keeps the colour of the car, the coat and the face at the
            door, with a large lens and a soft warm light.
          </p>
        </div>
        <div className="relative aspect-[16/9] md:absolute md:inset-0 md:aspect-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/funnel/hikvision-night-1920.webp"
            srcSet="/funnel/hikvision-night-960.webp 960w, /funnel/hikvision-night-1920.webp 1920w"
            sizes="100vw"
            alt="A camera's view at night, in colour: a person in a red coat walks through the gate onto a drive with a blue car parked by a lit front door."
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "60% 50%" }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden md:block"
            style={{ background: `linear-gradient(90deg, ${BAND} 0%, rgba(14,16,19,0.85) 30%, rgba(14,16,19,0.2) 62%, transparent 80%)` }}
          />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/4" style={{ background: `linear-gradient(to top, ${BAND}, transparent)` }} />
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
