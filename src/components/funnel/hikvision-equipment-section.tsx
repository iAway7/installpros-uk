import type { ReactNode } from "react";

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
 *     28 October; it was "the box" before), and where it goes.
 *   - "Do I need a monitor?" came up often, so it keeps a card of its own,
 *     "No monitor needed" (Gus, 30 October; it was "No screen needed").
 *   - "One cable per camera" went (Gus, 30 October: it read as filler; the
 *     wired section already says one cable carries power and picture).
 *   - The Wi-Fi line that sat under the cards moved to the wired card.
 *   - A video doorbell, fourth (Gus, 5 November, once Jordan confirmed they
 *     supply them; 9 buyer chats asked for a doorbell or intercom). No brand
 *     named: Jordan did not say which doorbell they fit.
 *
 * PHOTOS: Hikvision's own product shots of the camera (white and black) and
 * the recorder, chosen by Gus on 28 October, both cut out; they need
 * authorised status (question 12). The phone is Gus's Gemini render with a
 * green screen, which now shows three of the page's feeds (door, drive,
 * garden), blended with multiply so its white takes the card's grey. The
 * doorbell is a generated render on white (Figma, gemini-3.1-flash-image, 5
 * November), no logo, blended the same way. "The make and model are on your quote"
 * holds only once the quote template names them (24 of 63 camera quotes
 * never say Hikvision): a team change.
 *
 * DESIGN, 5 November (Gus: the cards should follow residential's, in
 * equipment-section.tsx, which is not touched): a square picture, a red
 * outlined badge above the title, a two-line description with no full stop
 * (residential's rule: under about 50 characters at four across), the lift
 * on hover, and one quiet strip under the four. The one difference is the
 * background: this section stays grey with white cards, so it still sits
 * between the white planners and the white "Already have cameras?".
 * The descriptions were cut to fit two lines; what they dropped ("for
 * outside and in", "it records every camera to a hard drive", "On
 * request") is said by the title, the badge or the page elsewhere.
 */

type Item = { visual: ReactNode; badge: string; title: string; detail: string };

/** `contain` for a cut-out on a transparent background, like the Ajax cards;
 *  `multiply` for a photo on pure white, whose white then takes the box's grey. */
function Photo({ name, alt, contain, multiply }: { name: string; alt: string; contain?: boolean; multiply?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/funnel/hikvision-kit-${name}-480.webp`}
      srcSet={`/funnel/hikvision-kit-${name}-480.webp 480w, /funnel/hikvision-kit-${name}-800.webp 800w`}
      sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
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
    badge: "Supply & Fit",
    title: "The camera",
    detail: "ColorVu 4MP in white or black, 8MP (4K) on request",
  },
  {
    visual: <Photo name="recorder" alt="A black Hikvision network video recorder." contain />,
    badge: "Included",
    title: "The recorder",
    detail: "A Hikvision NVR, by your router or in the loft",
  },
  {
    visual: <Photo name="phone" alt="A phone showing three camera feeds: the front door, the drive and the garden." contain multiply />,
    badge: "Free app",
    title: "No monitor needed",
    detail: "Every camera on your phone, in the Hik-Connect app",
  },
  {
    visual: <Photo name="doorbell" alt="A black video doorbell with a camera at the top and a lit call button." contain multiply />,
    badge: "Add-on",
    title: "A video doorbell",
    detail: "Answer the door from your phone, wherever you are",
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
            <div
              key={e.title}
              className="rounded-xl border border-border bg-background p-6 transition-all duration-card ease-ds hover:-translate-y-[5px] hover:border-brand-soft/35"
            >
              <div
                className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border"
                style={{ background: "var(--eq-img-grad)" }}
              >
                {e.visual}
              </div>

              <div className="pt-5">
                <span className="inline-flex whitespace-nowrap rounded-full border border-brand-deep px-2.5 py-1 text-micro font-semibold uppercase tracking-[0.14em] text-brand-deep">
                  {e.badge}
                </span>
                <h3 className="mt-3 text-lg font-bold leading-tight text-foreground">{e.title}</h3>
                <p className="mt-2.5 text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                  {e.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* The line that sat under the cards, as residential's warranty
            strip: same radius and hairline, one quiet row covering all four. */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-xl border border-border bg-background p-4 text-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand-icon" aria-hidden="true"><path d="M12 3 5 6v5.5c0 4.3 2.9 8.2 7 9.5 4.1-1.3 7-5.2 7-9.5V6l-7-3z" /><path d="m9 12 2 2 4-4" /></svg>
          <p className="text-body text-muted-foreground">
            <span className="font-semibold text-foreground">The make and model of every camera are on your quote.</span>{" "}
            You know exactly what you are getting.
          </p>
        </div>
      </div>
    </section>
  );
}
