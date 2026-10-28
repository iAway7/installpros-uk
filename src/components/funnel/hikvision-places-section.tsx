/**
 * Where the cameras go, in the place of the Ajax page's home photos
 * (security-home-section.tsx). Same plain treatment: pictures with a short
 * caption each, lazy loaded, nothing that moves.
 *
 * Why these four: they are what buyers asked to cover, in their words. The
 * front door, the drive and, unprompted in 6 chats, "the car parked on the
 * street"; the side passage and gate; the back door and garden. Median of 3
 * cameras, nearly all outside.
 *
 * "Low enough to see faces" is a fitting rule, not a promise of face
 * recognition (staff promised that with 8MP cameras; the page does not).
 *
 * Pictures: Gemini renders with a Hikvision camera in each, logo visible
 * (Gus, 28 October); real install photos replace them if Jordan has them
 * (question 8). The door and the side are portrait, so they take the narrow
 * cards and the drive and the back the wide ones; `position` keeps the
 * camera in the crop.
 */

type Place = { title: string; detail: string; src: string; srcSet: string; alt: string; position: string; wide?: boolean };

const PLACES: Place[] = [
  {
    title: "At the front door",
    detail: "Low enough to see faces, not just the top of a head.",
    src: "/funnel/hikvision-place-door-640.webp",
    srcSet: "/funnel/hikvision-place-door-640.webp 640w, /funnel/hikvision-place-door-960.webp 960w",
    alt: "A white Hikvision camera on the brick wall beside a front door with a porch canopy.",
    position: "50% 30%",
  },
  {
    title: "Over the drive",
    detail: "The car, the gate and the path to the door.",
    src: "/funnel/hikvision-place-drive-800.webp",
    srcSet: "/funnel/hikvision-place-drive-800.webp 800w, /funnel/hikvision-place-drive-1440.webp 1440w",
    alt: "A Hikvision camera under the gutter looking across a block-paved drive with a silver car.",
    position: "50% 30%",
    wide: true,
  },
  {
    title: "Down the side",
    detail: "The passage and the bins, where people cut through.",
    src: "/funnel/hikvision-place-side-640.webp",
    srcSet: "/funnel/hikvision-place-side-640.webp 640w, /funnel/hikvision-place-side-960.webp 960w",
    alt: "A camera under the soffit at the end of a side passage, looking at a wooden gate and two wheelie bins.",
    position: "50% 30%",
  },
  {
    title: "At the back",
    detail: "The back door, the garden and the shed.",
    src: "/funnel/hikvision-place-back-800.webp",
    srcSet: "/funnel/hikvision-place-back-800.webp 800w, /funnel/hikvision-place-back-1440.webp 1440w",
    alt: "A Hikvision camera under the eaves looking over a back garden, the back door and a shed.",
    position: "50% 25%",
    wide: true,
  },
];

export function HikvisionPlacesSection() {
  return (
    <section id="placement" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Placed where it matters</p>
          <h2 className="mt-4 h2-section text-foreground">
            The door, the drive,
            <br className="hidden sm:block" /> and the car on the street.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            We agree every position with you from your photos before anything is fitted.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-5 md:gap-5">
          {PLACES.map((p) => (
            <figure key={p.title} className={`overflow-hidden rounded-3xl bg-secondary ${p.wide ? "md:col-span-3" : "md:col-span-2"}`}>
              <div className="relative aspect-[4/3] md:aspect-auto md:h-[300px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  srcSet={p.srcSet}
                  sizes={p.wide ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 40vw, 100vw"}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: p.position }}
                />
              </div>
              <figcaption className="p-5 md:p-6">
                <p className="text-lg font-bold leading-tight text-foreground">{p.title}</p>
                <p className="mt-1.5 text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                  {p.detail}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

      </div>
    </section>
  );
}
