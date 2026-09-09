/**
 * "Companies we have worked with" — a slow leftward marquee of client logos.
 *
 * Not decoration. For the buyer who has to forward this page to a manager or to
 * finance, a named business outweighs any number of reviews, and it is the one
 * piece of proof the page could not make until Will sent the list.
 *
 * Assets are normalised at build time, not sized here: each logo was scaled to
 * a constant amount of INK rather than a constant box height, because equal
 * heights make a long wordmark shout and a compact mark disappear. Two arrived
 * as light-on-dark artwork and were repainted; Norwich Cloud's had a Cyber
 * Essentials badge welded to it, which was cropped off because that
 * accreditation is theirs and we hold none.
 *
 * Explicit width and height on every image: 21 of them arriving without
 * intrinsic size would shift the row as they load.
 */
interface Client {
  name: string;
  file: string;
  w: number;
  h: number;
}

/** Ordered so wide wordmarks and compact marks alternate rather than clumping,
 *  which is what stops the row reading as lumpy while it drifts. */
const CLIENTS: Client[] = [
  { name: "Amazon", file: "amazon", w: 98, h: 32 },
  { name: "Blue Cross", file: "blue-cross", w: 36, h: 36 },
  { name: "National Grid", file: "national-grid", w: 161, h: 33 },
  { name: "NHS", file: "nhs", w: 56, h: 22 },
  { name: "Burns & McDonnell", file: "burns-mcdonnell", w: 168, h: 25 },
  { name: "Audi", file: "audi", w: 93, h: 32 },
  { name: "The Ivy", file: "the-ivy", w: 168, h: 19 },
  { name: "Crest Nicholson", file: "crest-nicholson", w: 36, h: 36 },
  { name: "Hays Travel", file: "hays-travel", w: 145, h: 25 },
  { name: "IMCD", file: "imcd", w: 45, h: 27 },
  { name: "Subway", file: "subway", w: 109, h: 22 },
  { name: "Wills Meals", file: "wills-meals", w: 37, h: 36 },
  { name: "National Rail", file: "national-rail", w: 148, h: 27 },
  { name: "Northway", file: "northway", w: 52, h: 36 },
  { name: "Boohoo", file: "boohoo", w: 124, h: 20 },
  { name: "Greene King", file: "greene-king", w: 69, h: 36 },
  { name: "The Working Mums Club", file: "working-mums-club", w: 102, h: 26 },
  { name: "Bill's", file: "bills", w: 62, h: 36 },
  { name: "Harry's", file: "harrys", w: 100, h: 27 },
  { name: "Norwich Cloud", file: "norwich-cloud", w: 66, h: 36 },
  { name: "On Tick", file: "on-tick", w: 82, h: 20 },
];

export function ClientLogosSection() {
  return (
    <section className="w-full overflow-hidden bg-background py-14 md:py-16">
      <style>{`
        @keyframes ipxDrift { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
        /* One copy of the track is about 3,200px, so 120s is roughly 27px a
           second: slow enough to read a logo as it passes. */
        .ipx-logos-track { animation: ipxDrift 120s linear infinite; width: max-content; }
        .ipx-logos:hover .ipx-logos-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          /* Not just a paused marquee: half the track would sit off-screen for
             good. Drop to a static centred row that wraps. */
          .ipx-logos-track { animation: none; width: 100%; flex-wrap: wrap; justify-content: center; row-gap: 34px; }
          .ipx-logos-copy2 { display: none; }
        }
      `}</style>

      <div className="container mx-auto max-w-6xl">
        <p className="text-center text-caption font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Companies we have worked with
        </p>
      </div>

      {/* Full bleed, outside the container: a marquee that starts and stops at
          the content edge reads as a broken carousel rather than a flow.
          The mask fades both ends so logos enter and leave instead of clipping. */}
      <div
        className="ipx-logos relative mt-9 w-full"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
        }}
      >
        <div className="ipx-logos-track flex items-center gap-16">
          {[0, 1].map((copy) => (
            <div key={copy} className={`flex items-center gap-16 ${copy === 1 ? "ipx-logos-copy2" : ""}`}>
              {CLIENTS.map((c) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={c.file}
                  src={`/funnel/clients/${c.file}.webp`}
                  /* The second copy exists only to make the loop seamless, so it
                     is hidden from assistive tech rather than read out twice. */
                  alt={copy === 0 ? c.name : ""}
                  aria-hidden={copy === 1 || undefined}
                  width={c.w}
                  height={c.h}
                  loading="lazy"
                  decoding="async"
                  className="block shrink-0"
                  style={{ width: c.w, height: c.h }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
