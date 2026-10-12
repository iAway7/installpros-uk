/**
 * The photograph and its callouts, kept out of the section that renders them
 * so the copy has one home. finished-install-figure.tsx, the unused Motion
 * variant, reads the same list.
 *
 * Coordinates are percentages of the photograph, so a re-crop that keeps the
 * subject keeps the callouts.
 *
 * The fixing is not in this frame and no callout claims it; what holds the
 * enclosure to this roof is a question on the rail slide of the same photo.
 */

export type Dot = {
  /** Marker position, as a percentage of the photograph. */
  x: number;
  y: number;
  title: string;
  detail: string;
};

export const PHOTO = {
  // Will's photograph, 2026-10-12. The one it replaced was not ours: it had
  // been taken from a Google image search, and it carried the "bonded feet"
  // callout and the rail's only fixing badge with it. Both went with it.
  // Blurred at source over the connector at the front of the enclosure, on
  // Will's instruction ("the jigsaw piece"), before the crop. The crop is the
  // 16:9 window from y=200 of the 1600x1600 original: enclosure complete with
  // its front lip, the vent beside it, most of the rooflight above. The solar
  // panel sits below the window, which is why no callout names it.
  src: "/funnel/install-motorhome-white-hero.webp",
  srcSet:
    "/funnel/install-motorhome-white-hero-960.webp 960w, /funnel/install-motorhome-white-hero-1280.webp 1280w, /funnel/install-motorhome-white-hero.webp 1600w",
  alt: "A white low-profile Starlink Mini enclosure on the roof of a white coachbuilt motorhome, beside a vent dome and below a rooflight",
  caption: "Starlink Mini on a coachbuilt motorhome.",
};

export const DOTS: Dot[] = [
  {
    // On the vent dome: the neighbour it had to clear. Roof space is contested
    // on a motorhome and the frame answers "will it even fit up there".
    x: 67.5,
    y: 59.0,
    title: "It shares the roof",
    detail: "Sited clear of the vent and the rooflight, with the open sky it needs.",
  },
  {
    // On the grey edge band at the right, not the white face: the point of
    // this callout is the slab you can see the thickness of.
    x: 64.5,
    y: 82.0,
    title: "Low profile",
    detail: "A few centimetres proud of the roof, fixed in place. Nothing to fold away before you drive.",
  },
  {
    // On the top face. Replaces "No suction cups / bonded feet", which named
    // something this photograph does not show: the enclosure is closed and
    // the fixing is under it. What it does show is an enclosure the colour of
    // the roof, which answers "what will it look like up there".
    x: 43.7,
    y: 66.7,
    title: "Matched to the roof",
    detail: "A white enclosure on a white roof, so it reads as part of the van rather than a box on it.",
  },
];

/** How far in the zoomed views push. 2.6 puts the feet at a size where the
 *  white riser and the rubber base read as two separate parts, which is the
 *  whole argument of that callout. */
export const ZOOM = 2.6;

/** Translation that brings a dot to the centre of the frame at `ZOOM`.
 *  Percentages of the element's own (unscaled) box: CSS applies the scale
 *  before the translate, so these do not need scaling twice. */
export function centreOn(d: Dot, zoom = ZOOM) {
  return {
    x: `${-(d.x / 100 - 0.5) * zoom * 100}%`,
    y: `${-(d.y / 100 - 0.5) * zoom * 100}%`,
  };
}
