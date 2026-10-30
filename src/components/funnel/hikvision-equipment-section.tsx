import type { ReactNode } from "react";
import { Smartphone } from "lucide-react";

/**
 * The exact camera and the recorder. Started as a copy of the Ajax
 * equipment cards (security-equipment-section.tsx, the live Ajax page);
 * reworked 27 October from the chats (hikvision-research/
 * conversaciones-decision.md, sections 2 and 5), Gus approving.
 *
 *   - What people asked to see was the actual camera: model, make and a
 *     photo (9 threads: "Are you okay to show me the camera the exact ones
 *     we'll get with the purchase"). In 2 purchases the yes came within a day
 *     of staff sending a picture of the exact camera.
 *   - The recorder puzzled people ("What is nvr", "So does it come with a
 *     recording box??", "Do I need a monitor?"), so it is "the recorder",
 *     named as a Hikvision NVR the way the camera card names ColorVu (Gus,
 *     28 October; it was "the box" before), where it
 *     goes, and no screen needed.
 *   - The Wi-Fi line that sat under the cards moved to the wired card.
 *
 * PHOTOS: Hikvision's own product shots of the camera (white and black) and
 * the recorder, chosen by Gus on 28 October, both cut out; they need
 * authorised status before the page goes live (question 12). The cable is
 * Gus's Gemini render (30 October) on white, blended with multiply so the
 * white takes the card's grey (a white cable does not cut out cleanly).
 * "No screen needed" is an icon until there is a photo (the small phone mock
 * was rejected, 28 October). "The make and model are on your quote" holds only once the quote template
 * names them (24 of 63 camera quotes never say Hikvision): a team change.
 */

type Item = { visual: ReactNode; title: string; detail: ReactNode };

/** `contain` for a cut-out on a transparent background, like the Ajax cards;
 *  `multiply` for a photo on pure white, whose white then takes the card's grey. */
function Photo({ name, alt, contain, multiply }: { name: string; alt: string; contain?: boolean; multiply?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/funnel/hikvision-kit-${name}-480.webp`}
      srcSet={`/funnel/hikvision-kit-${name}-480.webp 480w, /funnel/hikvision-kit-${name}-800.webp 800w`}
      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`absolute inset-0 h-full w-full ${contain ? "object-contain p-[8%]" : "object-cover"} ${multiply ? "mix-blend-multiply" : ""}`}
    />
  );
}

const ITEMS: Item[] = [
  {
    visual: <Photo name="camera" alt="Hikvision ColorVu turret cameras in white and in black." contain />,
    title: "The camera",
    detail: "Hikvision ColorVu 4MP, in white or black, for outside and in. 8MP on request.",
  },
  {
    visual: <Photo name="recorder" alt="A black Hikvision network video recorder." contain />,
    title: "The recorder",
    detail: "A Hikvision NVR, by your router or in the loft. It records every camera to a hard drive.",
  },
  {
    visual: <Photo name="cable" alt="A coil of white network cable with its plug." contain multiply />,
    title: "One cable per camera",
    detail: "Power and picture down the same cable, from the recorder to each camera.",
  },
  {
    visual: <Smartphone aria-hidden="true" className="h-12 w-12 text-brand-icon" strokeWidth={1.25} />,
    title: "No screen needed",
    detail: "The Hik-Connect app on your phone is the screen. A monitor is optional.",
  },
];

export function HikvisionEquipmentSection() {
  return (
    <section id="equipment" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow">What you get</p>
          <h2 className="mt-4 h2-section text-foreground">
            The exact camera,
            <br className="hidden sm:block" /> and the recorder.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((e) => (
            <div key={e.title} className="rounded-xl border border-border bg-background p-6">
              <div
                className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border"
                style={{ background: "var(--eq-img-grad)" }}
              >
                {e.visual}
              </div>
              <h3 className="mt-5 text-lg font-bold leading-tight text-foreground">{e.title}</h3>
              <p className="mt-2.5 text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                {e.detail}
              </p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-body text-muted-foreground">
          The make and model of every camera are on your quote, so you know exactly what you are getting.
        </p>
      </div>
    </section>
  );
}
