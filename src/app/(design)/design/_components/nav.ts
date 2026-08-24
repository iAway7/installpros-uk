export interface NavItem { href: string; label: string }
export interface NavGroup { group: string; items: NavItem[] }

/** Single source for the sidebar and the prev/next footer. */
export const NAV: NavGroup[] = [
  {
    group: "Foundations",
    items: [
      { href: "/design/foundations/color", label: "Color" },
      { href: "/design/foundations/typography", label: "Typography" },
      { href: "/design/foundations/density", label: "Density" },
      { href: "/design/foundations/spacing", label: "Spacing & radius" },
      { href: "/design/foundations/motion", label: "Motion" },
      { href: "/design/foundations/elevation", label: "Elevation & borders" },
    ],
  },
  { group: "Design tokens", items: [{ href: "/design/tokens", label: "Token architecture" }] },
  {
    // Alphabetical. Nineteen entries in creation order was unscannable, and a
    // component list is something you arrive at knowing the name.
    group: "Primitives",
    items: [
      { href: "/design/primitives/accordion", label: "Accordion" },
      { href: "/design/primitives/badge", label: "Badge & Pill" },
      { href: "/design/primitives/breadcrumbs", label: "Breadcrumbs" },
      { href: "/design/primitives/button", label: "Button" },
      { href: "/design/primitives/calendar", label: "Calendar" },
      { href: "/design/primitives/card", label: "Card" },
      { href: "/design/primitives/choicebox", label: "Choicebox" },
      { href: "/design/primitives/combobox", label: "Combobox" },
      { href: "/design/primitives/copy-button", label: "Copy button" },
      { href: "/design/primitives/error", label: "Error" },
      { href: "/design/primitives/feedback", label: "Feedback" },
      { href: "/design/primitives/fieldset", label: "Fieldset" },
      { href: "/design/primitives/info-tip", label: "Info tip" },
      { href: "/design/primitives/input", label: "Input" },
      { href: "/design/primitives/label", label: "Label" },
      { href: "/design/primitives/menu", label: "Menu" },
      { href: "/design/primitives/middle-truncate", label: "Middle truncate" },
      { href: "/design/primitives/modal", label: "Modal" },
      { href: "/design/primitives/note", label: "Note" },
      { href: "/design/primitives/pagination", label: "Pagination" },
      { href: "/design/primitives/progress", label: "Progress" },
      { href: "/design/primitives/project-banner", label: "Project banner" },
      { href: "/design/primitives/radio", label: "Radio" },
      { href: "/design/primitives/search-input", label: "Search input" },
      { href: "/design/primitives/select", label: "Select" },
      { href: "/design/primitives/selection", label: "Selection" },
      { href: "/design/primitives/skeleton", label: "Skeleton" },
      { href: "/design/primitives/status-dot", label: "Status dot" },
      { href: "/design/primitives/tabs", label: "Tabs" },
      { href: "/design/primitives/textarea", label: "Textarea" },
      { href: "/design/primitives/toast", label: "Toast" },
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
