"use client";

import { useState } from "react";
import { Fieldset } from "@/components/system/fieldset";
import { RadioGroupItem, RadioGroup } from "@/components/system/radio";
import { Choicebox } from "@/components/system/choicebox";
import { PageHeader, Section, Preview, Code, Rule, BestPractices } from "../../_components/docs";

export default function FieldsetPage() {
  const [roof, setRoof] = useState("tile");
  const [addons, setAddons] = useState<string[]>([]);
  const toggle = (v: string) => setAddons((a) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]));

  return (
    <>
      <PageHeader
        title="Fieldset"
        lead="Groups related controls under one name. The name is not decoration, without it a screen reader reads each option with no idea what is being chosen."
      />

      <Section title="Default">
        <Preview className="!block">
          <div className="max-w-md">
            <Fieldset legend="Roof type" description="It changes which mount the engineer brings.">
              <RadioGroup label="Roof type" value={roof} onChange={setRoof}>
                <RadioGroupItem value="tile">Tile or slate</RadioGroupItem>
                <RadioGroupItem value="metal">Metal</RadioGroupItem>
                <RadioGroupItem value="flat">Flat</RadioGroupItem>
              </RadioGroup>
            </Fieldset>
          </div>
        </Preview>
        <Code>{`<Fieldset legend="Roof type" description="It changes which mount the engineer brings.">
  <RadioGroup label="Roof type" value={roof} onChange={setRoof}>
    <RadioGroupItem value="tile">Tile or slate</RadioGroupItem>
  </RadioGroup>
</Fieldset>`}</Code>
      </Section>

      <Section title="Required, with an error">
        <Preview className="!block">
          <div className="max-w-md">
            <Fieldset legend="Add-ons" required error="Choose at least one, or skip this step.">
              <div className="flex flex-wrap gap-3">
                <Choicebox multi title="Mesh nodes" selected={addons.includes("mesh")} onSelect={() => toggle("mesh")} />
                <Choicebox multi title="Mast mount" selected={addons.includes("mast")} onSelect={() => toggle("mast")} />
              </div>
            </Fieldset>
          </div>
        </Preview>
      </Section>

      <Section title="The min-width trap">
        <Rule>
          A <code>&lt;fieldset&gt;</code> defaults to <code>min-width: min-content</code> and, unlike every other
          element, <strong>refuses to shrink inside a flex row</strong> even when its children can. It is one of the
          most common causes of phantom horizontal scroll. This component ships with <code>min-w-0</code> for that
          reason, do not remove it.
        </Rule>
      </Section>

      <BestPractices
        when={[
          "Any set of controls that answers one question: a radio group, a set of checkboxes, a group of choiceboxes.",
          "A single input does not need one. A fieldset around one field is a label with extra steps.",
          "Nest at most one level. Fieldsets inside fieldsets are almost always a form that should be two steps.",
        ]}
        behavior={[
          "<code>required</code> and <code>disabled</code> apply to the group. A single required radio means nothing on its own.",
          "<code>disabled</code> on the fieldset disables every control inside it natively, no need to thread the prop through each child.",
          "The error sits under the group, not under one control, because the constraint belongs to the whole set.",
        ]}
        content={[
          "The legend is a Title Case noun naming the question: <code>Roof Type</code>, <code>Add-ons</code>. No trailing colon, no question mark.",
          "The description explains why you are asking: <em>It changes which mount the engineer brings.</em> If there is no good answer to &ldquo;why&rdquo;, consider not asking.",
        ]}
        accessibility={[
          "Real <code>&lt;fieldset&gt;</code> and <code>&lt;legend&gt;</code>, so the group name is announced before each option rather than once at the top.",
          "<code>showLegend={false}</code> keeps the legend in the accessibility tree as <code>sr-only</code>, hidden visually, never removed.",
          "The error carries <code>role=\"alert\"</code> and is wired to the fieldset through <code>aria-describedby</code>.",
        ]}
      />
    </>
  );
}
