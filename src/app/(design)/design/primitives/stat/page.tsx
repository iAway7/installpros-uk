import { CalendarClock, PoundSterling, Sparkles, Timer, TrendingUp, Users } from "lucide-react";
import { Stat } from "@/components/system/stat";
import { PageHeader, Section, Preview, Code, BestPractices, Rule, Mono, Table } from "../../_components/docs";

export const metadata = { title: "Stat" };

export default function StatPage() {
  return (
    <>
      <PageHeader
        title="Stat"
        lead="One figure on a dashboard: what it is, the number, and how it moved. The first component built for Product rather than borrowed from the funnel."
      />

      <Section title="A row of figures" note="Overview, in Product density.">
        <Preview>
          <div className="theme-product grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={<CalendarClock />} label="Today" value={14} />
            <Stat icon={<Users />} label="This month" value={212} />
            <Stat icon={<Sparkles />} label="New / unworked" value={9} attention />
            <Stat
              icon={<TrendingUp />}
              label="Visitor → lead rate (30d)"
              value="3.4%"
              delta={{ text: "+0.6 pts vs previous 30d", direction: "up" }}
            />
          </div>
        </Preview>
        <Code>{`<Stat icon={<CalendarClock />} label="Today" value={14} />
<Stat icon={<Sparkles />} label="New / unworked" value={9} attention />
<Stat
  icon={<TrendingUp />}
  label="Visitor → lead rate (30d)"
  value="3.4%"
  delta={{ text: "+0.6 pts vs previous 30d", direction: "up" }}
/>`}</Code>
      </Section>

      <Section title="Deltas" note="Green means good, not up. Say which way good is.">
        <Preview>
          <div className="theme-product grid w-full gap-4 sm:grid-cols-3">
            <Stat icon={<PoundSterling />} label="Revenue in pipeline" value="£48,200" delta={{ text: "+12%", direction: "up" }} />
            <Stat
              icon={<Timer />}
              label="Avg time to first contact"
              value="2.1h"
              delta={{ text: "−40 min", direction: "down", good: "down" }}
            />
            <Stat label="Cost / lead" value="—" hint="Connect Google Ads" />
          </div>
        </Preview>
        <Table
          head={["direction", "good", "Reads as"]}
          rows={[
            [<Mono key="a">up</Mono>, <Mono key="b">up</Mono>, "Green, arrow up"],
            [<Mono key="a">down</Mono>, <Mono key="b">down</Mono>, "Green, arrow down — less was better"],
            [<Mono key="a">down</Mono>, <Mono key="b">up</Mono>, "Red, arrow down"],
            [<Mono key="a">flat</Mono>, "—", "Grey, a dash"],
          ]}
        />
        <Rule>
          A delta is never colour alone: it carries an arrow, and its text says the number. That is
          also why <Mono>good</Mono> exists — time to first contact going down is the good news, and
          a red down-arrow would tell the team the opposite of what happened.
        </Rule>
      </Section>

      <Section title="Tokens" note="Nothing in the component is a literal.">
        <Table
          head={["Part", "Token", "Product", "Editorial"]}
          rows={[
            ["Number", <Mono key="t">text-metric</Mono>, "24px", "28px"],
            ["Label", <Mono key="t">text-body-sm</Mono>, "13px", "14px"],
            ["Delta, hint", <Mono key="t">text-label</Mono>, "11px", "12px"],
            ["Surface", <Mono key="t">Card</Mono>, "radius 10px + 4", "radius 12px + 4"],
            ["Figures", <Mono key="t">tabular-nums</Mono>, "—", "—"],
          ]}
        />
        <Rule>
          The number was Tailwind&apos;s <Mono>text-2xl</Mono> in three hand-written copies — Kpi on
          Overview, another Kpi on Marketing, Stat on Landings — outside the type scale.{" "}
          <Mono>text-metric</Mono> is the step above <Mono>text-title</Mono>, with its own tight
          leading, because a figure is not a sentence.
        </Rule>
      </Section>

      <BestPractices
        when={[
          "A single figure someone checks at a glance: today&apos;s leads, the conversion rate, revenue in the pipeline.",
          "In a row of three or four, so the eye compares like with like. A lone Stat on a page is usually a sentence.",
          "Not for a series over time — that is a chart. Stat says where it is; the chart says how it got there.",
        ]}
        behavior={[
          "Figures use tabular numerals, so a value that refreshes does not shift sideways.",
          "<code>attention</code> puts a dot by the label for figures that ask for action. Use it once per row at most, or it stops meaning anything.",
          "When the data is missing, show <code>—</code> and say why in <code>hint</code> (&ldquo;Connect PostHog&rdquo;), rather than a zero that looks real.",
        ]}
        content={[
          "Label in sentence case, naming the figure and its window: &ldquo;Visitor → lead rate (30d)&rdquo;.",
          "Delta text carries the number and the comparison: &ldquo;+12% vs previous 30d&rdquo;, not just &ldquo;+12%&rdquo;, when the window is not obvious.",
        ]}
        accessibility={[
          "The label comes before the number in reading order; the icon is <code>aria-hidden</code>.",
          "<code>attention</code> adds &ldquo;(needs action)&rdquo; for screen readers — the dot alone is invisible to them.",
          "The delta is outlined rather than tinted on purpose: on a 10% tint of themselves, success and error text measure 4.44 and 4.13:1, under AA; on the card&apos;s white they are 5.08 and 4.80.",
        ]}
      />
    </>
  );
}
