"use client";

import { useState } from "react";
import { Choicebox, ChoiceboxGroup } from "@/components/system/choicebox";
import { PageHeader, Section, Preview, Code, BestPractices, Rule } from "../../_components/docs";

export default function ChoiceboxPage() {
  const [single, setSingle] = useState("residential");
  const [multi, setMulti] = useState<string[]>(["mesh"]);
  const toggle = (v: string) => setMulti((m) => (m.includes(v) ? m.filter((x) => x !== v) : [...m, v]));

  return (
    <>
      <PageHeader
        title="Choicebox"
        lead="A larger form of radio or checkbox, with room for a description and a tap target you can hit on a moving train. This is the generalised form of the install-type cards in the lead form."
      />

      <Section title="Choicebox or FormOption">
        <Rule>
          They overlap, and knowing which to reach for is the whole difference. FormOption is a
          picture card: an icon above a short label, centred, laid out two across. Choicebox is a
          row with a visible radio or checkbox, a title and room for a line of description.
        </Rule>
        <Rule>
          So: FormOption when the icon carries the meaning and the labels are one or two words —
          the install-type step on a phone is read at a glance, not read. Choicebox when an option
          needs explaining, or when more than one can be picked, which FormOption cannot do.
        </Rule>
        <Rule>
          Worth saying plainly: Choicebox ships nowhere today. All of its uses are on these
          documentation pages, while FormOption runs the quote form and the coverage checker. Both
          are kept on purpose — Choicebox has the description and multi-select that FormOption will
          never grow — but if a year from now it is still unused, that is the answer.
        </Rule>
      </Section>

      <Section title="Single-select" note="Radio semantics. One wins.">
        <Preview>
          <ChoiceboxGroup label="Installation type">
            <Choicebox name="install" title="Residential" description="Houses, flats, outbuildings" selected={single === "residential"} onSelect={() => setSingle("residential")} />
            <Choicebox name="install" title="Commercial" description="Offices, farms, sites" selected={single === "commercial"} onSelect={() => setSingle("commercial")} />
          </ChoiceboxGroup>
        </Preview>
        <Code>{`<Choicebox
  name="install"
  title="Residential"
  description="Houses, flats, outbuildings"
  selected={value === "residential"}
  onSelect={() => setValue("residential")}
/>`}</Code>
      </Section>

      <Section title="Multi-select" note="Checkbox semantics. Any number.">
        <Preview>
          <ChoiceboxGroup label="Add-ons">
            <Choicebox multi title="Mesh nodes" description="Coverage in every room" selected={multi.includes("mesh")} onSelect={() => toggle("mesh")} />
            <Choicebox multi title="Mast mount" description="For obstructed roofs" selected={multi.includes("mast")} onSelect={() => toggle("mast")} />
          </ChoiceboxGroup>
        </Preview>
      </Section>

      <Section title="Disabled">
        <Preview>
          <Choicebox multi disabled title="Marine install" description="Not available in your area" selected={false} onSelect={() => {}} />
        </Preview>
      </Section>

      <BestPractices
        when={[
          "Use when the choice needs explaining. If the options are one word each and self-evident, a plain radio or a select is less visual weight.",
          "Use on touch. A 20px radio next to a label is a miss waiting to happen; the whole card is the target here.",
          "Between two and six options. Past six, a Combobox with search beats a wall of cards.",
        ]}
        behavior={[
          "The whole card is clickable, not just the indicator, it is a <code>&lt;label&gt;</code> wrapping a visually-hidden input.",
          "Single-select needs a shared <code>name</code>, which is what makes arrow keys move between options natively.",
          "Selection uses <code>--selection</code>, never brand red. Red is reserved for the primary button, so the CTA stays the only red thing on screen.",
          "Cards flex to fill the row. Keep descriptions to one line or the row heights go ragged.",
        ]}
        content={[
          "One Title Case title plus one sentence-case description per tile. Keep them parallel, same length range, same register.",
          "The description adds the differentiator, never a synonym of the title. <em>Houses, flats, outbuildings</em>, not <em>For residential properties</em>.",
          "A disabled tile needs its reason in the description (&ldquo;Not available in your area&rdquo;). A faded tile with no explanation reads as broken.",
        ]}
        accessibility={[
          "Real <code>&lt;input type=\"radio\"&gt;</code> and <code>type=\"checkbox\"</code> underneath, so keyboard and screen-reader behaviour is the browser's, not ours.",
          "Wrap a set in <code>ChoiceboxGroup</code>, which supplies the <code>&lt;fieldset&gt;</code> and legend that names what is being chosen.",
          "Focus is mirrored from the hidden input onto the card, so the ring is visible where the eye is.",
          "The indicator alone would be a 20px target, the card gives you 60px+ in both directions.",
        ]}
      />
    </>
  );
}
