const EQUIPMENT = [
  {
    t: "Starlink Standard",
    badge: "Supply & Fit",
    d: "The dish — supplied, mounted and aligned for a clear view of the sky.",
    img: "/funnel/starlink-standard.png",
  },
  {
    t: "Gen 3 Router",
    badge: "Setup Included",
    d: "Wi-Fi 6, configured and positioned for whole-home coverage.",
    img: "/funnel/gen-3-router.webp",
  },
  {
    t: "Mounts & Masts",
    badge: "All-metal",
    d: "Durable roof, wall and pole mounts for any property type.",
    img: "/funnel/mounts-masts.webp",
  },
  {
    t: "Mesh Nodes",
    badge: "Add-on",
    d: "Seamless coverage across every floor and outbuilding.",
    img: "/funnel/mesh-nodes.webp",
  },
];

/** "The hardware, handled." — the four equipment cards, ported from the
 *  /starlink-installations landing. */
export function EquipmentSection() {
  return (
    <section id="equipment" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="eyebrow">Equipment</p>
          <h2
            className="mt-4 h2-section text-foreground"
          >
            The hardware, handled.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            We supply, mount and configure the full Starlink ecosystem — nothing for you to source.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {EQUIPMENT.map((e) => (
            <div
              key={e.t}
              className="rounded-[26px] border border-border bg-secondary/50 p-[18px] pb-7 transition-all duration-450 ease-ds hover:-translate-y-[5px] hover:border-brand-soft/35"
            >
              <div
                className="flex aspect-square items-center justify-center overflow-hidden rounded-[18px] border border-border"
                style={{ background: "var(--eq-img-grad)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.img} alt={e.t} loading="lazy" className="h-full w-full object-contain p-[12%]" />
              </div>

              <div className="px-2.5 pt-5">
                {/* Badge above the title, not beside it. Side by side they share
                    the card width, so "Starlink Standard" wrapped to two lines
                    while "Mesh Nodes" sat on one — the row heights went ragged.
                    Stacked, the title gets the full width and a longer product
                    name later cannot squeeze the badge. */}
                <span className="inline-flex whitespace-nowrap rounded-full border border-brand-deep px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-brand-deep">
                  {e.badge}
                </span>
                <h3 className="mt-3 text-lg font-bold leading-tight text-foreground">{e.t}</h3>
                <p className="mt-2.5 text-[15px] text-muted-foreground" style={{ lineHeight: "1.55" }}>
                  {e.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
