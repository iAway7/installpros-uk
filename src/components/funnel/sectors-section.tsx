"use client";

import { track, EVENTS } from "@/lib/analytics";
import { rememberSectorInterest } from "@/lib/funnel/sector-interest";

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
 * The cards are links, not decoration. They already lifted on hover, which
 * promised a click that never happened; now the whole card goes to the quote
 * form, carries which sector was clicked into the lead, and fires a
 * cta_clicked so we can see which sector actually pulls. That last one answers
 * a question nobody can answer today: whether these six are the right six.
 *
 * The /35 opacity modifier on the hover border is fine, contrary to what the
 * previous commit claimed. These tokens are HSL triplets, so Tailwind emits
 * hsl(var(--brand-soft) / 0.35) and modern hsl() takes the alpha directly. No
 * <alpha-value> placeholder is needed anywhere in this config.
 *
 * WAREHOUSES AND RETAIL ARE STILL STOCK. Offices, farms, campsites and
 * construction are real photographs now. Replace the last two before this page
 * takes spend.
 */
interface Sector {
  img?: string;
  alt?: string;
  t: string;
  d: string;
}

const SECTORS: Sector[] = [
  {
    // Replaced the stock shot Will called out: "i don't think offices look like
    // that any more lol". This one is bench desks, glass partitions and a
    // commercial block out of the window, which is what a UK office actually
    // looks like now.
    img: "/funnel/sector-offices.webp",
    alt: "Open-plan office with bench desks and a glazed frontage",
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
    img: "/funnel/sector-construction.webp",
    alt: "Crane lifting a precast floor slab onto a city-centre building site",
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
    // Real photo now, replacing a stock tractor under snow-capped mountains
    // that was plainly not Britain. Will asked for a solar farm or more
    // agriculture, and this is both: hedgerows, small irregular fields and
    // sheep on one side, an array on the other. Solar sites are also a genuine
    // Starlink market, since they are remote by design and need monitoring.
    img: "/funnel/sector-farms.webp",
    alt: "Aerial view of a solar farm among British farmland",
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
            /* An anchor rather than a button with a scroll handler: the browser
               does the scrolling, it works with the keyboard and with JS off,
               and #quote already carries scroll-mt so the heading is not cut by
               the header on arrival. */
            <a
              key={s.t}
              href="#quote"
              onClick={() => {
                rememberSectorInterest(s.t);
                track(EVENTS.CTA_CLICKED, {
                  cta_id: `sector_${s.t.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
                  cta_label: s.t,
                  cta_location: "sectors",
                });
              }}
              className="group block overflow-hidden rounded-xl border border-border bg-card transition-all duration-card ease-ds hover:-translate-y-[5px] hover:border-brand-soft/35 focus-visible:-translate-y-[5px] focus-visible:border-brand-soft/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                {/* Always visible, not on hover. There is no hover on a phone,
                    and without this the card is a photo with a caption. */}
                <span className="mt-3 inline-flex items-center gap-1.5 text-caption font-semibold text-brand-deep">
                  Get a quote
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-quick group-hover:translate-x-0.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
