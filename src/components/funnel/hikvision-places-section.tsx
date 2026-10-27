import { Gap } from "./hikvision-gap";
import { LazyCameraPlanner } from "./hikvision-lazy";

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
 * DRAFT, 27 October 2026. No pictures yet: real install photos if Jordan has
 * them (question 8), otherwise the renders in prompts-imagenes.md. Until then
 * each card shows where its picture goes.
 */

type Place = { title: string; detail: string; wide?: boolean };

const PLACES: Place[] = [
  { title: "At the front door", detail: "Low enough to see faces, not just the top of a head.", wide: true },
  { title: "Over the drive", detail: "The car, the gate and the path to the door." },
  { title: "Down the side", detail: "The passage and the bins, where people cut through." },
  { title: "At the back", detail: "The back door, the garden and the shed.", wide: true },
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
              <div className="flex aspect-[4/3] items-center justify-center bg-[linear-gradient(160deg,#dfe4ea,#c9d0d8)] p-6 text-center md:aspect-auto md:h-[300px]">
                <span className="text-body-sm text-foreground/70">
                  <Gap q="Q8">Photo or render: {p.title.toLowerCase()}.</Gap>
                </span>
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

        {/* The planner replaced the static 2 / 3 to 4 / 6+ tiers (27 October):
            the same count, from the places people tap. */}
        <div className="mx-auto mt-16 max-w-6xl md:mt-20">
          <LazyCameraPlanner />
        </div>
      </div>
    </section>
  );
}
