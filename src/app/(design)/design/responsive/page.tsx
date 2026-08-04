import { PageHeader, Section, Table, Mono, Rule, Code } from "../_components/docs";

export const metadata = { title: "Responsive rules" };

export default function ResponsivePage() {
  return (
    <>
      <PageHeader
        title="Responsive rules"
        lead="The site has two layouts, not five. Everything meaningful happens at 768px — sm and lg only make small adjustments, and xl is never used."
      />

      <Section title="Breakpoints in real use">
        <Table
          head={["Prefix", "Width", "Uses", "What it is for"]}
          rows={[
            [<Mono key="a">sm</Mono>, "640px", "17", "Showing an icon, splitting a 1-col grid into 2"],
            [<Mono key="b">md</Mono>, "768px", "69", "The real layout switch. Type scale, columns, hero."],
            [<Mono key="c">lg</Mono>, "1024px", "12", "Third card column, wider padding"],
            [<Mono key="d">xl</Mono>, "1280px", "0", "Unused. The container caps at 1152px before it matters."],
          ]}
        />
        <div className="mt-6">
          <Rule>
            <strong>Design at 375 and 1440.</strong> Those are the two states worth mocking. If a design needs a third,
            it usually means the content is fighting the grid rather than the grid being wrong.
          </Rule>
        </div>
      </Section>

      <Section title="What changes at 768px">
        <Table
          head={["Thing", "Mobile", "Desktop"]}
          rows={[
            ["H1", "40px", "64px"],
            ["H2", "32px", "52px"],
            ["Section padding", "64px", "96px"],
            ["Hero overlay", "Darker (60/70/85%)", "Lighter (40/50/70%)"],
            ["Hero parallax", "Off", "On"],
            ["Before/after", "Two stacked cards", "Drag comparison"],
            ["Card grid", "1 column", "2–4 columns"],
          ]}
        />
      </Section>

      <Section title="Mobile-specific decisions" note="Three places where the desktop design does not survive a translation.">
        <ul className="space-y-4 text-[15px] leading-[1.7] text-neutral-600">
          <li>
            <strong className="text-neutral-900">Before/after stacks.</strong> At 375px the drag comparison gives each
            side ~165px and the text clips against the divider. Below md it becomes two cards — before on top, which is
            also the order the story reads in.
          </li>
          <li>
            <strong className="text-neutral-900">Parallax is desktop-only.</strong> iOS Safari ignores{" "}
            <Mono>background-attachment: fixed</Mono> and rescales the image, so the hero jumps while scrolling.
          </li>
          <li>
            <strong className="text-neutral-900">Carousel arrows hide below 640px.</strong> Native scroll-snap already
            gives swipe, and the arrows sat on the card edge.
          </li>
        </ul>
      </Section>

      <Section title="Viewport height">
        <Code>{`min-h-[100svh]   /* not min-h-screen */`}</Code>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          <Mono>100vh</Mono> on mobile includes the browser chrome, so a full-height hero measures taller than the
          screen and pushes its own trust bar out of view on load. <Mono>svh</Mono> measures the small viewport — what is
          actually visible.
        </p>
      </Section>
    </>
  );
}
