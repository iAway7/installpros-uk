import { SwitchDemo } from "./demo";
import { PageHeader, Section, Preview, Code, BestPractices, Rule, Mono } from "../../_components/docs";

export const metadata = { title: "Switch" };

export default function SwitchPage() {
  return (
    <>
      <PageHeader
        title="Switch"
        lead="An on/off setting that takes effect the moment it is flipped. No Save button, so it is only for changes that are safe to make in one click."
      />

      <Section title="In a settings row" note="Settings and Webhooks. Try them.">
        <Preview>
          <SwitchDemo />
        </Preview>
        <Code>{`<Switch checked={on} onCheckedChange={save} aria-label="WhatsApp follow-up" />`}</Code>
        <Rule>
          Radix&apos;s API (<Mono>checked</Mono>, <Mono>onCheckedChange</Mono>) without the package: the
          dashboard had two of these hand-rolled on a native <Mono>role=&quot;switch&quot;</Mono> button,
          which is all Radix renders. What the copies got wrong is what the component fixes. One had
          no accessible name at all; the other made its state its name (&ldquo;Active&rdquo; /
          &ldquo;Paused&rdquo;), so the name changed on every press. Both were green when on; checked
          states use <Mono>--selection</Mono>, like every selected control here.
        </Rule>
      </Section>

      <BestPractices
        when={[
          "A setting that applies immediately and is safe to undo by flipping it back: pause an endpoint, turn a follow-up on.",
          "Not inside a form with a Save button. There a Checkbox is the honest control, because nothing happens until submit.",
        ]}
        behavior={[
          "The change is optimistic: the switch moves at once, and moves back with a toast if the save fails.",
          "Disabled when a prerequisite is missing, with a title saying which.",
        ]}
        accessibility={[
          "<code>aria-label</code> (or a <code>&lt;label&gt;</code> for its id) is required: the name says what the switch controls; <code>aria-checked</code> says whether it is on.",
          "Off is <code>field-hover</code>, not a pale grey: the track is the control&apos;s boundary and needs 3:1 against the page. The thumb&apos;s position carries the state.",
          "Space and Enter toggle it, as a native button.",
        ]}
      />
    </>
  );
}
