import { Gap } from "./hikvision-gap";

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

/**
 * How many cameras, without a price. Added 27 October (Gus approved the
 * section review): 9 of the general CCTV pages reviewed compare systems by
 * camera count first, and in the chats the median was 3 cameras, "Is there a
 * big price difference between 4 and 6?" and "where would you suggest
 * positioning them" were asked, and staff had to confirm positions in 28
 * threads. No £ anywhere: the tiers say what each covers, not what it costs.
 *
 * The plan is a house seen from above: back garden at the top, the street at
 * the bottom with a car on the drive and one on the road. Camera spots are
 * the same in all three, lit or not.
 */
type Spot = "frontDoor" | "drive" | "side" | "backDoor" | "garden" | "otherSide";

const SPOTS: Record<Spot, [number, number]> = {
  frontDoor: [62, 60],
  drive: [32, 58],
  side: [92, 44],
  backDoor: [62, 26],
  garden: [92, 26],
  otherSide: [32, 32],
};

type Tier = { count: string; covers: string; spots: Spot[] };

const TIERS: Tier[] = [
  { count: "2 cameras", covers: "The front door and the back door.", spots: ["frontDoor", "backDoor"] },
  {
    count: "3 to 4 cameras",
    covers: "The front, the drive and the car on the street, the side and the back.",
    spots: ["frontDoor", "drive", "side", "backDoor"],
  },
  {
    count: "6 or more",
    covers: "The whole outside, and inside too if you want it.",
    spots: ["frontDoor", "drive", "side", "backDoor", "garden", "otherSide"],
  },
];

function HousePlan({ lit }: { lit: Spot[] }) {
  return (
    <svg viewBox="0 0 124 92" className="h-auto w-full" aria-hidden="true">
      {/* Lawn front and back, then the back garden's shed */}
      <rect x="0" y="0" width="124" height="78" fill="#e6efe2" />
      <rect x="100" y="6" width="16" height="11" rx="1.5" fill="#ffffff" stroke="#9aa5b1" strokeWidth="1" />
      {/* Drive with a car, the street with a parked car */}
      <rect x="8" y="44" width="22" height="34" fill="#dde1e6" />
      <rect x="12" y="62" width="14" height="10" rx="2.5" fill="#8e98a3" />
      <rect x="0" y="78" width="124" height="14" fill="#c7cdd4" />
      <line x1="0" y1="85" x2="124" y2="85" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="4 4" />
      <rect x="44" y="80.5" width="18" height="8" rx="2.5" fill="#8e98a3" />
      {/* House */}
      <rect x="32" y="26" width="60" height="34" rx="2" fill="#ffffff" stroke="#5b6672" strokeWidth="1.4" />
      {(Object.keys(SPOTS) as Spot[]).map((s) => {
        const [x, y] = SPOTS[s];
        const on = lit.includes(s);
        return (
          <g key={s}>
            {on && <circle cx={x} cy={y} r="6" className="fill-primary/15" />}
            <circle cx={x} cy={y} r="2.8" className={on ? "fill-primary" : "fill-foreground/15"} />
          </g>
        );
      })}
    </svg>
  );
}

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

        <div className="mx-auto mt-16 max-w-5xl md:mt-20">
          <div className="mx-auto max-w-xl text-center">
            <h3 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">How many cameras?</h3>
            <p className="mt-3 text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
              Most homes ask for three or four. Not sure? Send photos and we will suggest the positions.
            </p>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 md:mt-10 md:gap-5">
            {TIERS.map((t) => (
              // Phones: a row each, the plan small on the left, so the three
              // tiers fit in about one screen. From sm, three cards.
              <li
                key={t.count}
                className="grid grid-cols-[112px_minmax(0,1fr)] items-center gap-4 rounded-3xl border border-border bg-background p-4 sm:block sm:p-5 md:p-6"
              >
                <div className="overflow-hidden rounded-xl border border-border sm:rounded-2xl">
                  <HousePlan lit={t.spots} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold leading-tight text-foreground sm:mt-5">{t.count}</p>
                  <p className="mt-1 text-pretty text-body-sm text-muted-foreground sm:mt-1.5" style={{ lineHeight: "1.55" }}>
                    {t.covers}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
