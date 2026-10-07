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
  /** Analytics id, fixed. Without it the id is derived from `t`, so renaming a
   *  card splits its history in two and the section stops answering the one
   *  question it was built for: whether these six are the right six. Set it to
   *  whatever the derived value was on the day the card shipped and the series
   *  survives any amount of rewriting. */
  k?: string;
}

const SECTORS: Sector[] = [
  {
    // Replaced the stock shot Will called out: "i don't think offices look like
    // that any more lol". This one is bench desks, glass partitions and a
    // commercial block out of the window, which is what a UK office actually
    // looks like now.
    img: "/funnel/sector-offices.webp",
    alt: "Open-plan office with bench desks and a glazed frontage",
    // The review's list, cut to the length of the set. It ran "Connectivity
    // planned around video meetings, cloud applications, shared systems and
    // business Wi-Fi", which is 98 characters and three lines where the
    // neighbours run to one or two. The four things it names survive; the
    // "connectivity planned around" opening does not, because every card here
    // is a list and none of them needs to say that it is one.
    //
    // "Shared systems" is the one genuine addition. VoIP handsets come out:
    // phones have their own card in the systems row below, and the office
    // visitor is not scanning for them here.
    t: "Offices",
    d: "Video meetings, cloud apps, shared systems and Wi-Fi",
  },
  {
    img: "/funnel/sector-warehouses.webp",
    alt: "Forklift moving pallets in a warehouse aisle",
    // The review's nouns, without its wrapper. It ran "Coverage planned across
    // offices, working areas and yards, with cabling or wireless links where
    // appropriate": 107 characters and three lines. The three places survive
    // and so does the mechanism; "coverage planned across" and "where
    // appropriate" do not.
    //
    // Worth the change because "the whole floor" was an abstraction and these
    // are not. A depot manager reads "yards" and recognises himself, and the
    // chat log is where that word comes from: "I need to be able to work from
    // the yard. The grounds are approximately 95 acres and our yard covers
    // approximately 45 acres." Naming cable or a wireless link also answers
    // the man with the metal barn, "a nice Faraday cage".
    t: "Warehouses and depots",
    d: "Offices, working areas and yards, by cable or wireless link",
  },
  {
    img: "/funnel/sector-construction.webp",
    alt: "Crane lifting a precast floor slab onto a city-centre building site",
    // "Construction sites" until 7 October. The two extra words are the
    // cheapest way to start catching a fifth of the commercial book: site
    // containers, an 18 week job, a 9 month season, a 5 day event, a 13 month
    // self build. "Temporary" appeared nowhere on this page before today, so
    // all of that arrived and found nothing addressed to it.
    //
    // The body is the review's, which named site offices and project teams,
    // minus its second half about access, mounting and safety being reviewed
    // before installation. That half is process, and at 124 characters it ran
    // to three lines where every neighbour runs to one or two. "Cabins" is the
    // word the chat log uses.
    k: "construction_sites",
    t: "Construction and temporary sites",
    d: "Site offices, cabins and project teams",
  },
  {
    img: "/funnel/sector-retail.webp",
    alt: "Retail counter with a card terminal",
    // "Card terminals and tills that stay up" promised uptime, which is the
    // same blanket claim that came out of the H1 and the backup card. Three
    // sentences on one page all guaranteeing the day. A list instead, like
    // Offices two cards up.
    //
    // Staff systems and guest access are the review's additions and both are
    // real: "to be able to offer WiFi to customers as well as connecting our
    // till systems". Its word for the first item is not. It wrote "payments",
    // and Will has already corrected this once on the systems row: a barber
    // says "the card machine" and "the till", not "POS". So the additions come
    // in and the vocabulary stays ours.
    t: "Retail and hospitality",
    d: "Card terminals, tills, staff systems and guest Wi-Fi",
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
      <div className="container mx-auto">
        <p className="eyebrow">Sectors</p>
        {/* 760, not the 640 this was. That width was measured against "Every
            building is a different problem.", and the shorter heading that
            replaced it broke one word earlier, leaving "connect." alone on a
            line of its own. 760 is the first round value that holds it on one
            line; below that the container wraps it to "Commercial sites / we
            connect.", which is a fair break. */}
        <h2 className="mt-4 max-w-[760px] h2-section text-foreground">
          Commercial sites we connect.
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
                  cta_id: `sector_${s.k ?? s.t.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
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
