/**
 * The curved edge of a dark planet with light breaking over it, as a
 * background for a dark band. Gus, 3 November: he liked React Bits Pro's
 * "Horizon Bloom" (paid) for the managed service section; this is our own
 * take on the idea in plain CSS, no canvas, no script, nothing to hydrate.
 *
 * Place it first inside a `relative` wrapper: the horizon's highest point
 * sits `gap` px above that wrapper's top, so whatever follows (the cards)
 * rests on the planet and the light rises behind whatever came before (the
 * heading). Anchoring to the content rather than to a share of the band
 * keeps the line off the cards at every width; the band itself needs
 * `overflow-hidden`.
 *
 * Three layers, all ignored by pointers and screen readers:
 *   - the bloom, a soft ellipse of light rising from the top of the rim;
 *   - the planet, a huge circle slightly darker than the band, whose top
 *     edge is the horizon;
 *   - its rim, a thin bright line with a tight glow (box-shadow on the
 *     circle), faded towards the sides by the mask so it is brightest at
 *     the top.
 */

/** The brand red of the dark bands' eyebrows. Change here for another tint. */
const GLOW = "255, 106, 95";

/** Room above the horizon for the bloom, in px. */
const SKY = 420;

export function VoipHorizonGlow({ gap = 28 }: { gap?: number }) {
  const mask = `radial-gradient(60vw 700px at 50% ${SKY}px, #000 30%, transparent 90%)`;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 w-screen -translate-x-1/2"
      style={{ top: -(SKY + gap), height: SKY + 1400, maskImage: mask, WebkitMaskImage: mask }}
    >
      {/* The bloom: light rising over the horizon, strongest at its top. */}
      <div
        className="absolute left-1/2 w-[110%] -translate-x-1/2"
        style={{
          top: 0,
          height: SKY,
          background: `radial-gradient(45% 100% at 50% 100%, rgba(${GLOW}, 0.32) 0%, rgba(${GLOW}, 0.1) 40%, transparent 80%)`,
        }}
      />
      {/* The planet, with the bright rim on its top edge. */}
      <div
        className="absolute left-1/2 aspect-square w-[260%] -translate-x-1/2 rounded-full md:w-[180%]"
        style={{
          top: SKY,
          background: "#08090b",
          boxShadow: `0 -1px 0 0 rgba(${GLOW}, 0.95), 0 -2px 6px 0 rgba(${GLOW}, 0.8), 0 -10px 40px 0 rgba(${GLOW}, 0.45), 0 -40px 140px 0 rgba(${GLOW}, 0.25)`,
        }}
      />
    </div>
  );
}
