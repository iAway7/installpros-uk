/**
 * "Trusted to install for" — the six brands a UK reader recognises, still, in
 * one row.
 *
 * This replaced a 120s leftward marquee of all twenty-one logos Will supplied.
 * His reasoning, and it is right: in something that moves, the recognisable
 * names scroll past and land with the same weight as the ones nobody has heard
 * of. "That's a very punchy 1 second hook seeing those in a row." Six on their
 * own are stronger than twenty-one going by.
 *
 * Cutting to six also closed two other notes of his in the same move. The row
 * is static, so there is nothing to make static later, and six fit above the
 * fold instead of a full-bleed marquee that pushed the section down the page.
 *
 * The other fifteen webp files stay in public/funnel/clients. They cost nothing
 * and this list is one edit away from changing again.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LAUNCH BLOCKER, and a bigger one than it was as a marquee.
 *
 * Two separate things are still missing, and both are needed before this page
 * comes out of noindex:
 *
 *  1. WRITTEN PERMISSION PER LOGO. Isolating six marks under a claim is a
 *     stronger use than one of twenty-one drifting past, and these are the six
 *     most regulated in the set. Two are not even the client's to give: the NHS
 *     lozenge belongs to NHS England under the NHS Identity rules and what can
 *     be asked for is the specific trust's logo, and the National Rail double
 *     arrow is licensed by Rail Delivery Group rather than by any operator.
 *
 *  2. CONFIRMATION THAT WE INSTALLED. "Trusted to install for" is a claim about
 *     who did the work, not just who the client is. If any of the six came
 *     through a subcontract or through a different entity, that heading is the
 *     part that causes the problem, not the logo.
 * ─────────────────────────────────────────────────────────────────────────────
 */

type Client = { name: string; file: string; w: number; h: number };

/** Ordered so the two tallest marks (Greene King, NHS) do not sit together and
 *  the widest wordmark (National Grid) is not on an end. Widths and heights are
 *  the normalised ones from the build script: every mark carries the same ink
 *  area, which is what stops a row of six very different logos reading as a
 *  collage. */
const CLIENTS: Client[] = [
  { name: "Amazon", file: "amazon", w: 98, h: 32 },
  { name: "National Grid", file: "national-grid", w: 161, h: 33 },
  { name: "NHS", file: "nhs", w: 56, h: 22 },
  { name: "Audi", file: "audi", w: 93, h: 32 },
  { name: "National Rail", file: "national-rail", w: 148, h: 27 },
  { name: "Greene King", file: "greene-king", w: 69, h: 36 },
];

export function ClientLogosSection() {
  return (
    <section className="w-full bg-background py-14 md:py-16">
      <div className="container mx-auto max-w-6xl">
        {/* Muted, not brand red. The logos are the loud part; an eyebrow in
            primary competes with them for the one second Will wants this
            section to buy. */}
        <p className="text-center text-caption font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Trusted to install for
        </p>

        {/* Three across on mobile, six on desktop. No marquee, so nothing to
            pause, nothing off-screen, and no mask. */}
        <div className="mt-9 grid grid-cols-3 items-center justify-items-center gap-x-6 gap-y-9 md:mt-10 lg:grid-cols-6 lg:gap-x-10">
          {CLIENTS.map((c) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={c.file}
              src={`/funnel/clients/${c.file}.webp`}
              alt={c.name}
              width={c.w}
              height={c.h}
              loading="lazy"
              className="h-auto max-w-full"
              style={{ width: c.w }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
