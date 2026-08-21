import { PageHeader, Section, Table, Mono, Code, Rule } from "../_components/docs";

export const metadata = { title: "Layout system" };

export default function LayoutPage() {
  return (
    <>
      <PageHeader
        title="Layout system"
        lead="One container width, one vertical rhythm, one grid pattern. The page was built by different hands at different times and had five container widths, this is the one that won."
      />

      <Section title="The container">
        <Code>{`<section className="w-full bg-background py-16 md:py-24">
  <div className="container mx-auto max-w-6xl px-6">
    {/* content */}
  </div>
</section>`}</Code>
        <div className="mt-4">
          <Table
            head={["Property", "Value", "Why"]}
            rows={[
              ["Max width", "1152px (max-w-6xl)", "What eight of eleven sections already used"],
              ["Side padding", "24px (px-6)", "Constant at every breakpoint"],
              ["Section padding", "64px → 96px", "py-16 md:py-24"],
            ]}
          />
        </div>
        <div className="mt-6">
          <Rule>
            The header and footer still hardcode <Mono>maxWidth: 1140px</Mono> and the hero trust bar uses 1160px. That
            leaves the logo six pixels off from the content edge above 1200px. It is on the migration plan, not fixed.
            Do not copy those values into anything new.
          </Rule>
        </div>
      </Section>

      <Section title="Grids" note="Three patterns cover every section on the site.">
        <Table
          head={["Pattern", "Code", "Used by"]}
          rows={[
            ["Auto-fit cards", <Mono key="a">repeat(auto-fit, minmax(258px, 1fr))</Mono>, "Feature grid, stats"],
            ["Fixed columns", <Mono key="b">sm:grid-cols-2 lg:grid-cols-4</Mono>, "Equipment cards"],
            ["Split", <Mono key="c">md:grid-cols-2</Mono>, "Coverage map"],
          ]}
        />
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          Gap is <Mono>14px</Mono> for card grids and <Mono>40px</Mono> where the items are text blocks rather than
          bordered cards. Prefer auto-fit, it degrades on its own without a breakpoint for every count.
        </p>
      </Section>

      <Section title="Section anatomy" note="Every content section on the funnel follows this order.">
        <Code>{`Eyebrow      12px uppercase, brand red
H2           the claim, 32 → 52px
Lead         one sentence, muted, max ~2 columns wide
Content      cards / grid / media
CTA          optional, centred, primary + outline pair`}</Code>
      </Section>

      <Section title="Stacking and z-index">
        <Table
          head={["Layer", "z-index", "Notes"]}
          rows={[
            ["Header", "50", "Fixed. Hero adds pt-28 md:pt-36 to clear it."],
            ["Hero content", "10", "Sits above the photo and its overlay."],
            ["Autocomplete dropdown", "30", "Above the form, below the header."],
            ["Skip link (focused)", "100", "Must beat everything."],
          ]}
        />
      </Section>
    </>
  );
}
