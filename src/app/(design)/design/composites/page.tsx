import { PageHeader, Section, Preview, Code, Mono, Rule, Table } from "../_components/docs";

export const metadata = { title: "Composites" };

export default function CompositesPage() {
  return (
    <>
      <PageHeader
        title="Composite components"
        lead="Assemblies of primitives plus tokens. They carry no business logic — the difference between a composite and a pattern is that a composite is a shape you fill, and a pattern is a decision about how something works."
      />

      <Section title="Feature card" note="Icon chip, title, one sentence. Used in the capability and coverage grids.">
        <Preview>
          <div className="w-[290px] rounded-[22px] border border-border bg-secondary/40 p-7 transition-all duration-card ease-ds hover:-translate-y-[5px] hover:border-brand-soft/35">
            <div className="flex h-11 w-11 items-center justify-center rounded-[13px] border border-brand-soft/25 bg-primary/10 text-brand-icon">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="8" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <h3 className="mt-5 text-[17px] font-semibold text-foreground">Optimal Signal Placement</h3>
            <p className="mt-2.5 text-[14.5px] leading-[1.6] text-muted-foreground">
              Obstruction scanning finds the perfect line of sight before we drill.
            </p>
          </div>
        </Preview>
        <Code>{`radius   22px (radius/card)
padding  28px
border   --border, 1px
surface  --secondary at 40%
icon     44×44, radius 13px, bg --primary/10,
         border --brand-soft/25, glyph --brand-icon
hover    -5px, border --brand-soft/35, 450ms ease-ds`}</Code>
      </Section>

      <Section title="Stat block" note="A number and a label above a hairline. Two sizes.">
        <Preview>
          <div className="w-[220px] border-t border-border pt-7">
            <div className="text-[44px] font-extralight leading-none tracking-[-1.9px] text-foreground">9,163+</div>
            <div className="mt-3.5 text-[15px] leading-[1.55] text-muted-foreground">
              Installations completed across the UK
            </div>
          </div>
          <div className="w-[200px] border-t border-border pt-6">
            <div className="text-[34px] font-normal leading-[1.1] tracking-[-1px] text-foreground">175+</div>
            <div className="mt-1 text-[13px] text-muted-foreground">Towns &amp; cities served</div>
          </div>
        </Preview>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          The large one uses <Mono>Display-XL</Mono> at weight 200. The thin stroke is what stops a 72px number reading
          as a shout — do not bold it.
        </p>
      </Section>

      <Section title="Badge" note="Small uppercase tag. Equipment cards only.">
        <Preview>
          <span className="rounded-full border border-brand-soft/30 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[1.5px] text-brand-icon">
            Supply &amp; Fit
          </span>
          <span className="rounded-full border border-brand-soft/30 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[1.5px] text-brand-icon">
            All-metal
          </span>
        </Preview>
      </Section>

      <Section title="Accordion item">
        <Preview className="!block">
          <div className="border-b border-border">
            <button className="group flex w-full items-center justify-between gap-6 py-6 text-left text-[18px] font-medium text-foreground transition-colors duration-quick hover:text-brand-hover">
              How long does an installation take?
              <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
              </span>
            </button>
          </div>
        </Preview>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          The plus rotates 45° into a cross over 550ms. Hover goes to <Mono>--brand-hover</Mono>, the only place on the
          page besides the footer where a red hover appears on text.
        </p>
      </Section>

      <Section title="Inventory" note="What exists today, and what still needs building in Figma.">
        <Table
          head={["Composite", "In code", "In Figma"]}
          rows={[
            ["Feature card", "✅", "—"],
            ["Equipment card", "✅", "—"],
            ["Review card", "✅", "—"],
            ["Accordion item", "✅", "—"],
            ["Stat block", "✅", "—"],
            ["Trust bar item", "✅", "—"],
            ["Badge", "✅", "—"],
          ]}
        />
        <div className="mt-6">
          <Rule>
            Every composite exists in code and none of them exist in Figma yet — only the Button component set has been
            built. That gap is Phase 3 of the migration plan, and it is the honest state of things today.
          </Rule>
        </div>
      </Section>
    </>
  );
}
