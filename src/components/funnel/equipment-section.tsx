const EQUIPMENT = [
  {
    t: "Starlink Standard",
    badge: "Supply & Fit",
    d: "The dish: supplied, mounted and aligned for a clear view of the sky.",
    img: "/funnel/starlink-gen-3.webp",
  },
  {
    t: "Router 3",
    badge: "Premium Upgrade",
    d: "Premium upgrade over the standard Router Mini. WiFi 6, whole-home coverage.",
    img: "/funnel/starlink-gen-3-router.webp",
  },
  {
    t: "Mounts & Masts",
    badge: "All-metal",
    d: "Durable roof, wall and pole mounts for any property type.",
    img: "/funnel/mounts-masts.webp",
  },
  {
    t: "Indoor/Outdoor WiFi",
    badge: "Add-on",
    d: "Seamless coverage across every floor and outbuilding.",
    img: "/funnel/wifi-access-point.webp",
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
          <p className="mx-auto mt-5 max-w-xl text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            We supply, mount and configure the full Starlink ecosystem. Nothing for you to source.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {EQUIPMENT.map((e) => (
            <div
              key={e.t}
              className="rounded-xl border border-border bg-secondary/50 p-6 transition-all duration-card ease-ds hover:-translate-y-[5px] hover:border-brand-soft/35"
            >
              <div
                className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border"
                style={{ background: "var(--eq-img-grad)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.img} alt={e.t} loading="lazy" className="h-full w-full object-contain p-[8%]" />
              </div>

              <div className="pt-5">
                {/* Badge above the title, not beside it. Side by side they share
                    the card width, so "Starlink Standard" wrapped to two lines
                    while "Mounts & Masts" sat on one, and the row heights went
                    ragged.
                    Stacked, the title gets the full width and a longer product
                    name later cannot squeeze the badge. */}
                <span className="inline-flex whitespace-nowrap rounded-full border border-brand-deep px-2.5 py-1 text-micro font-semibold uppercase tracking-[0.14em] text-brand-deep">
                  {e.badge}
                </span>
                <h3 className="mt-3 text-lg font-bold leading-tight text-foreground">{e.t}</h3>
                <p className="mt-2.5 text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                  {e.d}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Warranty strip. Not a fifth card: same rounded-xl and hairline as
            its neighbours, but one quiet row instead of a tile, so it reads as
            a statement covering all four. Tokens only: border, secondary,
            brand-icon for the single spot of red the DS allows on a glyph. */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-xl border border-border bg-secondary p-4 text-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand-icon" aria-hidden="true"><path d="M12 3 5 6v5.5c0 4.3 2.9 8.2 7 9.5 4.1-1.3 7-5.2 7-9.5V6l-7-3z" /><path d="m9 12 2 2 4-4" /></svg>
          <p className="text-body text-muted-foreground">
            <span className="font-semibold text-foreground">2-year warranty on everything we install.</span>{" "}
            Option to extend to 5 years.
          </p>
        </div>
      </div>
    </section>
  );
}
