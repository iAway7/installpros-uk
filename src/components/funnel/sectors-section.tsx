/**
 * Sector cards for the commercial landing.
 *
 * One page, several ad groups: an ad about warehouses points here and the
 * visitor finds his own sector. A plain grid rather than a rail or an
 * accordion, because on a paid landing page anything a visitor has to scroll
 * or click to reach does not count towards message match. Six cards in three
 * columns also gives the largest card the container allows, 358px, which is
 * where the photographs start doing their job.
 *
 * IMAGES ARE PLACEHOLDERS. They are stock, none shows one of our installs, and
 * two are visibly not British (see the note on each). Replace with real job
 * photographs before this page takes spend.
 */
interface Sector {
  img?: string;
  alt?: string;
  t: string;
  d: string;
}

const SECTORS: Sector[] = [
  {
    img: "/funnel/sector-offices.webp",
    alt: "Open-plan office floor",
    t: "Offices",
    d: "Video calls, cloud tools and VoIP handsets",
  },
  {
    img: "/funnel/sector-warehouses.webp",
    alt: "Forklift moving pallets in a warehouse aisle",
    t: "Warehouses and depots",
    d: "Coverage across the whole floor, not just the office",
  },
  {
    // Placeholder shows timber-frame construction, which reads as North
    // American rather than UK brick and block.
    img: "/funnel/sector-construction.webp",
    alt: "Groundworker finishing a concrete slab on a building site",
    t: "Construction sites",
    d: "Connected from week one, long before a line could be",
  },
  {
    img: "/funnel/sector-retail.webp",
    alt: "Retail counter with a card terminal",
    t: "Retail and hospitality",
    d: "Card terminals and tills that stay up",
  },
  {
    img: "/funnel/sector-campsites.webp",
    alt: "Touring caravans with awnings pitched on a British holiday park",
    t: "Holiday parks and campsites",
    d: "Guest Wi-Fi across pitches, lodges and static vans",
  },
  {
    // Placeholder shows snow-capped mountains over arid foothills. Not Britain.
    img: "/funnel/sector-farms.webp",
    alt: "Tractor working a ploughed field",
    t: "Farms and rural business",
    d: "Where fibre was never going to arrive",
  },
];

export function SectorsSection() {
  return (
    <section id="sectors" className="w-full scroll-mt-28 bg-secondary/40 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <p className="eyebrow">Sectors</p>
        <h2 className="mt-4 max-w-[640px] h2-section text-foreground">
          Every building is a different problem.
        </h2>
        <p className="mt-5 max-w-[560px] text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
          The dish is the easy part. What changes is the structure, the number of people on it, and what it costs you when the connection drops.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
          {SECTORS.map((s) => (
            <div
              key={s.t}
              className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-card ease-ds hover:-translate-y-[5px] hover:border-brand-soft/35"
            >
              {s.img ? (
                <>
                  {/* Below the fold, so lazy loading costs nothing at first paint. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.img}
                    alt={s.alt ?? ""}
                    loading="lazy"
                    width={800}
                    height={533}
                    className="aspect-[3/2] w-full object-cover"
                  />
                </>
              ) : (
                /* Deliberately blank and labelled, not a stand-in photograph: an
                   empty slot gets filled, a plausible wrong one ships. */
                <div
                  className="flex aspect-[3/2] w-full items-center justify-center border-b border-border bg-secondary"
                  role="img"
                  aria-label="Photograph to come"
                >
                  <span className="text-label font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Photo to come
                  </span>
                </div>
              )}
              <div className="p-5">
                <h3 className="text-lead font-semibold text-foreground">{s.t}</h3>
                <p className="mt-1.5 text-body-sm text-muted-foreground" style={{ lineHeight: "1.45" }}>
                  {s.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
