/**
 * The photograph and its callouts, kept out of the section that renders them
 * so the copy has one home. finished-install-figure.tsx, the unused Motion
 * variant, reads the same list.
 *
 * Coordinates are percentages of the photograph, so a re-crop that keeps the
 * subject keeps the callouts.
 *
 * CONFIRM WITH WILL: DOTS[2] says "bonded feet" because the roof is GRP and a
 * magnetic base needs steel (permanent-or-removable.tsx says exactly that). If
 * they are anything else the label changes. A black disc on a white roof reads
 * as a suction cup to a customer who has just been told we do not fit them.
 */

export type Dot = {
  /** Marker position, as a percentage of the photograph. */
  x: number;
  y: number;
  /** Where this callout's number, its hairline and its leader line all sit,
   *  as a percentage of the photograph's height. Desktop only. Keep them in
   *  the same order as `y` and at least 25 points apart: closer and the label
   *  blocks touch, out of order and the leader lines cross. */
  labelY: number;
  title: string;
  detail: string;
};

export const PHOTO = {
  src: "/funnel/install-motorhome-roof.webp",
  srcSet:
    "/funnel/install-motorhome-roof-960.webp 960w, /funnel/install-motorhome-roof-1280.webp 1280w, /funnel/install-motorhome-roof.webp 1920w",
  alt: "A Starlink Mini fitted flat to the roof of a coachbuilt motorhome, between a solar panel and a rooflight, photographed in the workshop",
  caption: "Starlink Mini on a coachbuilt motorhome.",
};

export const DOTS: Dot[] = [
  {
    x: 41.7,
    y: 28.0,
    labelY: 18,
    title: "It shares the roof",
    // Roof space is contested on a motorhome: solar, rooflight, aerial, vent.
    // The frame answers "will it even fit up there" without being asked.
    detail: "Sited clear of the solar panel and the rooflight, with the open sky it needs.",
  },
  {
    x: 57.3,
    // On the grey edge band, not on the white face above it: the whole point
    // of this callout is the slab you can see the thickness of.
    y: 55.5,
    labelY: 45,
    title: "Low profile",
    detail: "A few centimetres proud of the roof, fixed in place. Nothing to fold away before you drive.",
  },
  {
    x: 46.1,
    y: 60.1,
    labelY: 72,
    title: "No drilling, no suction cups",
    detail: "Bonded feet spread the load across the GRP roof.",
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
