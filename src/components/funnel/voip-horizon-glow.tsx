/**
 * The curved edge of a dark planet with light breaking over it, as a
 * background for a dark band. Gus, 3 November: he liked React Bits Pro's
 * "Horizon Bloom" (paid) for the managed service section; this is our own
 * take on the idea in plain CSS, no canvas, no script, nothing to hydrate.
 *
 * Place it first inside a `relative` wrapper (the cards' grid). `y` is where
 * the horizon's highest point sits, measured from that wrapper's top: a
 * length such as "-28px" (just above it) or "50%" (its middle). The band
 * itself needs `overflow-hidden`, and the cards need an opaque background
 * to sit in front of the light rather than let it through.
 *
 * Three layers, all ignored by pointers and screen readers:
 *   - the bloom, a soft ellipse of light rising from the top of the rim;
 *   - the planet, a huge circle slightly darker than the band, whose top
 *     edge is the horizon;
 *   - its rim, a thin bright line with a tight glow (box-shadow on the
 *     circle), faded towards the sides by the mask so it is brightest at
 *     the top.
 */

/** Violet, as in the Horizon Bloom example Gus sent. The brand red was his
 *  first look and he found it horrible (3 November). */
const GLOW = "168, 85, 247";

/** Room above the horizon for the bloom, in px. */
const SKY = 420;

export function VoipHorizonGlow({ y = "-28px" }: { y?: string }) {
  const mask = `radial-gradient(60vw 700px at 50% ${SKY}px, #000 30%, transparent 90%)`;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 w-screen -translate-x-1/2"
      style={{ top: `calc(${y} - ${SKY}px)`, height: SKY + 1400, maskImage: mask, WebkitMaskImage: mask }}
    >
      {/* The bloom: light rising over the horizon, strongest at its top. */}
      <div
        className="absolute left-1/2 w-[110%] -translate-x-1/2"
        style={{
          top: 0,
          height: SKY,
          background: `radial-gradient(45% 100% at 50% 100%, rgba(${GLOW}, 0.22) 0%, rgba(${GLOW}, 0.07) 40%, transparent 80%)`,
        }}
      />
      {/* The planet, with the bright rim on its top edge. */}
      <div
        className="absolute left-1/2 aspect-square w-[260%] -translate-x-1/2 rounded-full md:w-[180%]"
        style={{
          top: SKY,
          background: "#08090b",
          boxShadow: `0 -1px 0 0 rgba(${GLOW}, 0.95), 0 -2px 6px 0 rgba(${GLOW}, 0.7), 0 -10px 40px 0 rgba(${GLOW}, 0.3), 0 -40px 140px 0 rgba(${GLOW}, 0.15)`,
        }}
      />
    </div>
  );
}
