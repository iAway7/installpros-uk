"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem, Radio } from "@/components/system/radio";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

export default function RadioPage() {
  const [a, setA] = useState("morning");
  const [b, setB] = useState("one");
  const [c, setC] = useState("standard");

  return (
    <>
      <PageHeader
        title="Radio"
        lead="A single choice from a small set of plain-text options. When an option needs a description or an icon, use Choicebox instead."
      />

      <Section title="Default">
        <Preview className="!block">
          <RadioGroup label="Preferred install slot" showLabel value={a} onChange={setA}>
            <RadioGroupItem value="morning">Morning, 8am to 12pm</RadioGroupItem>
            <RadioGroupItem value="afternoon">Afternoon, 12pm to 5pm</RadioGroupItem>
          </RadioGroup>
        </Preview>
        <Code>{`<RadioGroup label="Preferred install slot" showLabel value={slot} onChange={setSlot}>
  <RadioGroupItem value="morning">Morning, 8am to 12pm</RadioGroupItem>
  <RadioGroupItem value="afternoon">Afternoon, 12pm to 5pm</RadioGroupItem>
</RadioGroup>`}</Code>
      </Section>

      <Section title="Required" note="Required belongs on the group, never on one option.">
        <Preview className="!block">
          <RadioGroup label="Property type" showLabel required value={c} onChange={setC}>
            <RadioGroupItem value="standard">House or flat</RadioGroupItem>
            <RadioGroupItem value="listed">Listed building</RadioGroupItem>
          </RadioGroup>
        </Preview>
      </Section>

      <Section title="Disabled" note="A whole group, or one option within it.">
        <Preview className="!flex-col !items-start !gap-8">
          <RadioGroup label="Disabled group" showLabel disabled value={b} onChange={setB}>
            <RadioGroupItem value="one">Option 1</RadioGroupItem>
            <RadioGroupItem value="two">Option 2</RadioGroupItem>
          </RadioGroup>
          <RadioGroup label="One option unavailable" showLabel value={b} onChange={setB}>
            <RadioGroupItem value="one">Available this week</RadioGroupItem>
            <RadioGroupItem value="two" disabled>Same-day, fully booked</RadioGroupItem>
          </RadioGroup>
        </Preview>
      </Section>

      <Section title="Standalone" note="Unlabelled, for custom rows. Needs an aria-label.">
        <Preview className="!block">
          <ul className="max-w-sm divide-y divide-border">
            {["Westminster", "Camden"].map((area) => (
              <li key={area} className="flex items-center justify-between py-3">
                <span className="text-[15px] text-foreground">{area}</span>
                <Radio aria-label={`Cover ${area}`} checked={b === area} onChange={() => setB(area)} />
              </li>
            ))}
          </ul>
        </Preview>
        <Code>{`<Radio aria-label="Cover Westminster" checked={v === "Westminster"} onChange={…} />`}</Code>
      </Section>

      <BestPractices
        when={[
          "A single choice from 2–6 mutually exclusive options where seeing all of them matters, an install slot, a property type, a billing cycle.",
          "Past six options, switch to <code>Combobox</code> so the list stops dominating the form.",
          "For richer per-option content, an icon, a description, a price, use <code>Choicebox</code>. For a binary on/off, a checkbox is clearer than two radios.",
        ]}
        behavior={[
          "Pre-select the safest default so the field reads as configured rather than required-but-empty. Skip the default only when the choice has real consequences and you want a deliberate pick.",
          "<code>required</code> goes on the group, not on an option. Required-against-a-single-radio means nothing.",
          "Arrow keys move within the group and skip disabled options; Tab leaves the group entirely. That is native behaviour and comes free from using real inputs, do not reimplement it.",
          "A disabled option needs a reason next to it (&ldquo;fully booked&rdquo;). A greyed radio with no explanation reads as a bug.",
        ]}
        content={[
          "The group label is a Title Case noun: <code>Install Slot</code>, <code>Property Type</code>. No trailing colon.",
          "Option labels are parallel, same part of speech, same length, same register. <em>Morning / Afternoon</em>, not <em>Morning / I&rsquo;d prefer the afternoon</em>.",
          "Keep <code>showLabel</code> on unless the surrounding heading already names the choice. Hiding the legend is an accessibility affordance, not a layout shortcut.",
        ]}
        accessibility={[
          "Rendered as <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code>, so a screen reader announces the group name before each option. With <code>showLabel</code> off the legend becomes <code>sr-only</code>, present, just not painted.",
          "The standalone <code>Radio</code> requires an <code>aria-label</code>. A radio with no accessible name is unusable without sight.",
          "The click target extends across the label. Do not wrap the input in something that breaks the <code>&lt;label&gt;</code> association.",
          "Focus is a 2px ring in <code>--selection</code> with an offset. Do not swap it for a border change, a keyboard user loses track of which option is focused.",
        ]}
      />
    </>
  );
}
