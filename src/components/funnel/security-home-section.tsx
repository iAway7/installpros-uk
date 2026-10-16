/**
 * The devices in a home, by day, straight after the break-in played at night.
 *
 * Jordan, 15 October 2026, asked whether the site needs "a more premium homely
 * feel". The answer agreed with Gus: yes, without anything that slows the
 * page or takes over the scroll. So this is plain: three photographs, lazy
 * loaded, a caption on each, and nothing that moves except a slight zoom on
 * hover.
 *
 * The photographs are Jordan's (sent on WhatsApp the same day): renders of a
 * hallway, a living room and the front of a house with black Ajax devices.
 * They are not photographs of homes InstallPros fitted, so the copy describes
 * the devices and never says "a home we fitted".
 *
 * BEFORE THIS GOES LIVE:
 *   - WhatsApp sent them at 1600 x 600. Swap in the originals (sent as a
 *     document, not a photo) at the same paths.
 *   - Confirm they are his to use, not Ajax's own material: the Ajax logo is
 *     on the devices.
 *
 * The black set because it is the only complete one: the white versions came
 * for the hallway and the outside, not for the living room.
 *
 * 16 October: the eyebrow carries the section's strongest fact, that nothing
 * gets chased into the walls, which for a finished or rented home is a
 * blocker rather than a matter of looks. It was buried in the paragraph under
 * an eyebrow ("At home in yours") that said nothing. "Wireless alarm", not
 * just "wireless": the Ajax cameras are wired, and this section shows only
 * alarm devices. The paragraph keeps the tidiness point.
 */

type Shot = { src: string; srcSet: string; sizes: string; alt: string; title: string; detail: string; position: string; wide?: boolean };

const SHOTS: Shot[] = [
  {
    src: "/funnel/ajax-home-hallway-1600.webp",
    srcSet: "/funnel/ajax-home-hallway-800.webp 800w, /funnel/ajax-home-hallway-1600.webp 1600w",
    // Full width from md; on phones a 4:3 crop, so the picture is drawn at
    // twice the card's width.
    sizes: "(min-width: 768px) min(100vw, 1200px), 200vw",
    alt: "A hallway with a keypad on the wall by the front door, a contact on the door frame and a siren high on the wall.",
    title: "By the front door",
    detail: "A keypad for anyone who would rather not use the app, a contact on the door and a siren inside.",
    // Keeps the keypad, the contact and the siren in the phone crop.
    position: "60% 50%",
    wide: true,
  },
  {
    src: "/funnel/ajax-home-living-1600.webp",
    srcSet: "/funnel/ajax-home-living-800.webp 800w, /funnel/ajax-home-living-1600.webp 1600w",
    sizes: "(min-width: 768px) min(100vw, 1200px), 200vw",
    alt: "A living room with a black motion detector mounted high on the corner of a wall.",
    title: "In the living room",
    detail: "A motion detector high in the corner, set to ignore the dog or the cat.",
    position: "80% 50%",
  },
  {
    src: "/funnel/ajax-home-outside-1600.webp",
    srcSet: "/funnel/ajax-home-outside-800.webp 800w, /funnel/ajax-home-outside-1600.webp 1600w",
    sizes: "(min-width: 768px) min(100vw, 1200px), 200vw",
    alt: "The brick front of a house at dusk, with a black outdoor siren on the wall beside a lit window.",
    title: "On the front of the house",
    detail: "An outdoor siren the whole street can hear, and a sign the house is protected.",
    position: "70% 50%",
  },
];

export function SecurityHomeSection() {
  return (
    <section id="at-home" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Wireless alarm, no chasing walls</p>
          <h2 className="mt-4 h2-section text-foreground">
            Fitted neatly,
            <br className="hidden sm:block" /> in the right places.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            Each device goes where it covers the most and still sits tidily in the room.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 md:gap-5">
          {SHOTS.map((s) => (
            <figure
              key={s.title}
              className={`group relative overflow-hidden rounded-2xl bg-secondary ${
                s.wide ? "aspect-[4/3] md:col-span-2 md:aspect-[8/3]" : "aspect-[4/3]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                srcSet={s.srcSet}
                sizes={s.sizes}
                alt={s.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
                style={{ objectPosition: s.position }}
              />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white md:p-7">
                <p className="text-lead font-semibold">{s.title}</p>
                <p className="mt-1 max-w-md text-body-sm leading-[1.55] text-white/85">{s.detail}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
