import { TrendChart } from "@/components/system/chart";
import { ConversionChart } from "@/components/dashboard/conversion-chart";
import { PageHeader, Section, Preview, Code, BestPractices, Rule, Mono, Table } from "../../_components/docs";

export const metadata = { title: "Chart" };

// Sample data, made up and deterministic: a page that showed real leads would
// publish them. Shapes match what the dashboard feeds the chart.
const day = (i: number) => {
  const d = new Date(Date.UTC(2026, 8, 1 + i));
  return d.toISOString().slice(0, 10);
};
const wave = (i: number, base: number, amp: number, period = 7) =>
  Math.round(base + amp * Math.sin((i / period) * Math.PI * 2) + (i % 3));

const LEADS = Array.from({ length: 14 }, (_, i) => ({ date: day(i), leads: wave(i, 9, 4) }));
const FUNNEL = Array.from({ length: 28 }, (_, i) => ({
  date: day(i),
  submits: wave(i, 11, 4),
  visitors: wave(i, 320, 90),
}));
const WEEKS = [
  { week: "2026-07-06", visitors: 1840, leads: 52 },
  { week: "2026-07-13", visitors: 2010, leads: 61 },
  { week: "2026-07-20", visitors: 1930, leads: 66 },
  { week: "2026-07-27", visitors: 2105, leads: 70 },
  { week: "2026-08-03", visitors: 2240, leads: 81 },
  { week: "2026-08-10", visitors: 980, leads: 31 },
].map((w) => ({ ...w, rate: w.leads / w.visitors }));

export default function ChartPage() {
  return (
    <>
      <PageHeader
        title="Chart"
        lead="A time series, area or line, one axis or two. Every chart in the dashboard is this one component, on the chart tokens."
      />

      <Section title="One series" note="Overview's daily leads. An area, because leads accumulate.">
        <Preview>
          <div className="theme-product w-full">
            <TrendChart data={LEADS} series={[{ key: "leads", name: "Leads" }]} height={180} />
          </div>
        </Preview>
        <Code>{`<TrendChart data={daily} series={[{ key: "leads", name: "Leads" }]} />`}</Code>
      </Section>

      <Section title="Two series, two axes" note="Funnel: form submits against visitors, on their own scales.">
        <Preview>
          <div className="theme-product w-full">
            <TrendChart
              data={FUNNEL}
              series={[
                { key: "submits", name: "Form submits" },
                { key: "visitors", name: "Visitors", rightAxis: true },
              ]}
            />
          </div>
        </Preview>
        <Code>{`<TrendChart
  data={daily}
  series={[
    { key: "submits", name: "Form submits" },          // what the chart is about: chart-2
    { key: "visitors", name: "Visitors", rightAxis: true }, // context: chart-1
  ]}
/>`}</Code>
        <Rule>
          Order is meaning. The first series is what the chart is about and takes the strong blue,{" "}
          <Mono>chart-2</Mono>; the second is context and takes the light one, <Mono>chart-1</Mono>.
          More than two series on one chart is the wrong chart.
        </Rule>
      </Section>

      <Section title="A rate" note="Marketing's weekly conversion. A line, because a filled area would suggest a volume.">
        <Preview>
          <div className="theme-product w-full">
            <ConversionChart data={WEEKS} />
          </div>
        </Preview>
        <Code>{`<TrendChart
  data={weeks}
  series={[{ key: "pct", name: "Conversion", kind: "line", dots: true }]}
  unit="%"
  tooltipValue={(v, _k, row) => \`\${v}%  (\${row.leads} leads / \${row.visitors} visitors)\`}
/>`}</Code>
      </Section>

      <Section title="Tokens">
        <Table
          head={["Part", "Token", "Value"]}
          rows={[
            ["The series", <Mono key="t">--chart-2</Mono>, "#2B7FFF · 3.76:1"],
            ["Context series", <Mono key="t">--chart-1</Mono>, "#8EC5FF · 1.81:1, see below"],
            ["Hovered point", <Mono key="t">--chart-accent</Mono>, "near-black, ringed in the card colour"],
            ["Grid", <Mono key="t">--chart-grid</Mono>, "= --border"],
            ["Axis labels", <Mono key="t">text-label</Mono>, "muted-foreground"],
            ["Tooltip", <Mono key="t">Elevation/popover</Mono>, "card surface, text-caption"],
          ]}
        />
        <Rule>
          <Mono>chart-1</Mono> is under the 3:1 WCAG 1.4.11 asks of a graphical object — taken
          knowingly, for the look. It only ever carries a context series, which always has a legend
          entry and its values in the tooltip, so nothing is told by that colour alone.
        </Rule>
      </Section>

      <BestPractices
        when={[
          "How something moved over time. Where it is now is a Stat; the two sit together.",
          "<code>area</code> for counts that accumulate — leads, visitors, clicks. <code>line</code> for rates and averages.",
          "A second series only as context for the first, on its own axis when the scales differ by an order of magnitude.",
        ]}
        behavior={[
          "Hovering a point shows every series for that day in one tooltip, the hovered point marked near-black.",
          "Gaps in the data stay gaps: a missing day is not drawn as zero.",
          "Gradient ids come from useId, so two charts on one page never share a fill.",
        ]}
        accessibility={[
          "The legend names every series; colour is never the only key.",
          "Every value is reachable as text in the tooltip.",
          "Known gap, recorded: the chart itself is not keyboard-navigable. The figures it plots are also on the page as Stats.",
        ]}
      />
    </>
  );
}
