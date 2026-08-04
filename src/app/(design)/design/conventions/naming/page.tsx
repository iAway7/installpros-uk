import { PageHeader, Section, Table, Mono, Code, Rule } from "../../_components/docs";

export const metadata = { title: "Naming" };

export default function NamingPage() {
  return (
    <>
      <PageHeader
        title="Naming convention"
        lead="Names are the cheapest documentation there is. These rules exist because the codebase previously had four reds, three greens and a near-black repeated ten times with no name at all."
      />

      <Section title="Tokens" note="category/role, lowercase, slash-separated.">
        <Table
          head={["Pattern", "Example", "Note"]}
          rows={[
            ["Primitive (Figma)", <Mono key="a">red/700</Mono>, "Ramp position. Never referenced by a component."],
            ["Semantic colour", <Mono key="b">--brand-hover</Mono>, "What it does, not what it looks like."],
            ["Figma semantic", <Mono key="c">brand/hover</Mono>, "Same concept, Figma's grouping syntax."],
            ["Spacing", <Mono key="d">space/24</Mono>, "Named by px, so the name is the value."],
            ["Radius", <Mono key="e">radius/card</Mono>, "Named by use where a number would not help."],
          ]}
        />
        <div className="mt-6">
          <Rule>
            Name by role, not appearance. <Mono>--brand-hover</Mono> survives the brand turning blue;{" "}
            <Mono>--dark-red</Mono> does not. The one exception is the primitive ramp, whose whole job is to describe
            appearance.
          </Rule>
        </div>
      </Section>

      <Section title="Type styles" note="Flat and semantic. No prefix groups.">
        <Code>{`Display-XL  H1  H2  H3  H4
Body-L  Body  Body-S  Caption  Input
Eyebrow  Button`}</Code>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          There is exactly one H2. Names like <Mono>Heading/H2 Section</Mono> and <Mono>Heading/H2 Form</Mono> are what
          a system looks like when nobody decided — they differed by a weight and half a pixel.
        </p>
      </Section>

      <Section title="Components">
        <Table
          head={["Thing", "Convention", "Example"]}
          rows={[
            ["Component", "PascalCase", <Mono key="a">FunnelButton</Mono>],
            ["File", "kebab-case", <Mono key="b">funnel-button.tsx</Mono>],
            ["Section component", "PascalCase + Section", <Mono key="c">CoverageSection</Mono>],
            ["Figma variant", "Property=Value", <Mono key="d">Variant=Primary, Size=Default</Mono>],
            ["Boolean prop", "no is/has prefix", <Mono key="e">selected</Mono>, ],
          ]}
        />
      </Section>

      <Section title="Variant vocabulary" note="The same words mean the same thing everywhere.">
        <Table
          head={["Axis", "Values"]}
          rows={[
            ["Variant", "Primary · Secondary · Outline · Ghost"],
            ["Size", "Small · Default · Large"],
            ["State", "Default · Hover · Focus · Disabled · Error"],
            ["Tone", "light · dark — which surface it sits on"],
          ]}
        />
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          <Mono>tone</Mono> is the one worth internalising: it does not mean the component is dark, it means the surface
          underneath is. <Mono>tone=&quot;dark&quot;</Mono> gives you a white checkbox.
        </p>
      </Section>
    </>
  );
}
