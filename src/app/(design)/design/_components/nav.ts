export interface NavItem { href: string; label: string }
export interface NavGroup { group: string; items: NavItem[] }

/** Single source for the sidebar and the prev/next footer. */
export const NAV: NavGroup[] = [
  {
    group: "Foundations",
    items: [
      { href: "/design/foundations/color", label: "Color" },
      { href: "/design/foundations/typography", label: "Typography" },
      { href: "/design/foundations/spacing", label: "Spacing & radius" },
      { href: "/design/foundations/motion", label: "Motion" },
    ],
  },
  { group: "Design tokens", items: [{ href: "/design/tokens", label: "Token architecture" }] },
  {
    group: "Primitives",
    items: [
      { href: "/design/primitives/button", label: "Button" },
      { href: "/design/primitives/input", label: "Input" },
      { href: "/design/primitives/selection", label: "Selection" },
      { href: "/design/primitives/radio", label: "Radio" },
      { href: "/design/primitives/choicebox", label: "Choicebox" },
      { href: "/design/primitives/combobox", label: "Combobox" },
      { href: "/design/primitives/calendar", label: "Calendar" },
      { href: "/design/primitives/error", label: "Error" },
      { href: "/design/primitives/feedback", label: "Feedback" },
      { href: "/design/primitives/breadcrumbs", label: "Breadcrumbs" },
      { href: "/design/primitives/copy-button", label: "Copy button" },
      { href: "/design/primitives/middle-truncate", label: "Middle truncate" },
    ],
  },
  { group: "Composites", items: [{ href: "/design/composites", label: "Cards & blocks" }] },
  { group: "Patterns", items: [{ href: "/design/patterns", label: "Page patterns" }] },
  {
    group: "System",
    items: [
      { href: "/design/layout", label: "Layout system" },
      { href: "/design/responsive", label: "Responsive rules" },
      { href: "/design/accessibility", label: "Accessibility" },
    ],
  },
  {
    group: "Conventions",
    items: [
      { href: "/design/conventions/naming", label: "Naming" },
      { href: "/design/conventions/structure", label: "Folder structure" },
      { href: "/design/migration", label: "Migration plan" },
    ],
  },
];

export const FLAT: NavItem[] = NAV.flatMap((g) => g.items);
