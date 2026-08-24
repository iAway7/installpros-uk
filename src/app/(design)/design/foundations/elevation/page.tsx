import { PageHeader, Section, Preview, Code, Mono, Rule } from "../../_components/docs";

export const metadata = { title: "Elevation & borders" };

const LAYERS = [
  {
    name: "Resting",
    token: "shadow-sm",
    role: "cards, buttons, tabs",
    note: "One hairline. Not really an elevation step — it keeps a white surface from disappearing into a white page.",
    cls: "shadow-sm",
  },
  {
    name: "Raised",
    token: "shadow-raised",
    role: "sticky header, carousel arrows",
    note: "Sits on the page and moves over it as you scroll.",
    cls: "shadow-raised",
  },
  {
    name: "Popover",
    token: "shadow-popover",
    role: "dropdowns, menus, combobox",
    note: "The layer that matters. Nothing dims behind these, so the shadow is the only thing separating them from the page underneath.",
    cls: "shadow-popover",
  },
  {
    name: "Overlay",
    token: "shadow-overlay",
    role: "modal, slide-over panel",
    note: "Cast onto a 40% black scrim, which is why the shadow is barely visible here and why the modal and the drawer could disagree for months without anyone noticing.",
    cls: "shadow-overlay",
  },
];

export default function ElevationPage() {
  return (
    <>
      <PageHeader
        title="Elevation & borders"
        lead="Two ways a surface separates from what is behind it. Four shadow layers named by job, and two border widths that say what kind of control something is."
      />

      <Section title="The four layers">
        <div className="space-y-8">
          {LAYERS.map((l) => (
            <div key={l.name}>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-[15px] font-medium text-neutral-900">{l.name}</span>
                <Mono>{l.token}</Mono>
                <span className="text-[13px] text-neutral-500">{l.role}</span>
              </div>
              <div className="mt-3 rounded-xl bg-neutral-50 p-8">
                <div className={`h-16 w-full max-w-sm rounded-xl border border-neutral-200 bg-white ${l.cls}`} />
              </div>
              <p className="mt-3 max-w-2xl text-[14px] leading-[1.6] text-neutral-500">{l.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Why they needed names">
        <Rule>
          There were six shadow values across 23 uses and none of them had a name, so a new dropdown
          got whatever its author reached for. That is how the old select ended up one step lighter
          than the menu and the combobox doing the same job. The values did not change much; the
          naming is the fix.
        </Rule>
        <Rule>
          Elevation is not a ladder to climb. Four layers is the whole set, and a fifth would mean
          the hierarchy is being drawn with shadows instead of layout. If something needs to sit
          above an overlay, that is usually a sign it should have replaced it.
        </Rule>
      </Section>

      <Section title="Border widths" note="Two, and the width carries meaning.">
        <Preview>
          <div className="theme-editorial flex flex-wrap items-center gap-6">
            <div className="rounded-lg border-[length:var(--border-field)] border-field bg-white px-5 py-3 text-body text-foreground">
              Text field · 1.5px
            </div>
            <div className="rounded-lg border-[length:var(--border-control)] border-border bg-white px-5 py-3 text-body text-foreground">
              Selectable · 2px
            </div>
            <div className="rounded-lg border border-border bg-white px-5 py-3 text-body text-foreground">
              Card · 1px
            </div>
          </div>
        </Preview>
        <Code>{`border-[length:var(--border-field)]     /* text fields */
border-[length:var(--border-control)]   /* radio, checkbox, choicebox */
border                                  /* cards, panels, rules */`}</Code>
        <Rule>
          The arbitrary-value syntax is ugly and deliberate. The natural names —{" "}
          <Mono>border-field</Mono>, <Mono>border-input</Mono> — are already colour tokens.
          Registering them as widths too would make Tailwind emit two different rules under one class
          name, and <Mono>border-field</Mono> would mean a colour and a thickness at the same time.
        </Rule>
        <Rule>
          Both widths are shared across the two densities. Product could thin its fields if it ever
          wanted to, but there is no reason to yet, and a difference with no reason is drift.
        </Rule>
      </Section>
    </>
  );
}
