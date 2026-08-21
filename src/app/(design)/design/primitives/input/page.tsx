import { Input } from "@/components/system/input";
import { PageHeader, Section, Preview, Code, Table, Mono, Rule, BestPractices } from "../../_components/docs";

export const metadata = { title: "Input" };

export default function InputPage() {
  return (
    <>
      <PageHeader
        title="Input"
        lead="The lead form is the product. Every field here is 56px tall so it is the largest thing on its step, and the error state is wired to assistive tech rather than being colour alone."
      />

      <Section title="Sizes">
        <Preview className="!flex-col !items-stretch">
          <Input inputSize="sm" placeholder="Small, 36px" />
          <Input placeholder="Default, 48px" />
          <Input inputSize="lg" placeholder="Large, 56px, used by the lead form" />
        </Preview>
      </Section>

      <Section title="States">
        <Preview className="!flex-col !items-stretch">
          <Input inputSize="lg" placeholder="Default" />
          <Input inputSize="lg" state="error" defaultValue="not-an-email" aria-describedby="err-demo" />
          <p id="err-demo" role="alert" className="text-[15px] text-error">
            Please enter a valid email address.
          </p>
          <Input inputSize="lg" placeholder="Disabled" disabled />
        </Preview>
        <Code>{`<Input
  inputSize="lg"
  state={errors.email ? "error" : "default"}
  aria-describedby={errors.email ? "err-email" : undefined}
/>
{errors.email && (
  <p id="err-email" role="alert" className="text-error">{errors.email}</p>
)}`}</Code>
      </Section>

      <Section title="Focus and error">
        <Table
          head={["State", "Border", "Ring"]}
          rows={[
            ["Default", <Mono key="a">--field</Mono>, "—"],
            ["Focus", <Mono key="b">--selection-border</Mono>, "2px --selection / 15%"],
            ["Error", <Mono key="c">--error</Mono>, "2px --error / 20%"],
          ]}
        />
      </Section>

      <Section title="Errors are not just a colour">
        <Rule>
          Passing <Mono>state=&quot;error&quot;</Mono> sets <Mono>aria-invalid</Mono> automatically. Always pair it with
          an <Mono>aria-describedby</Mono> pointing at the message and <Mono>role=&quot;alert&quot;</Mono> on the message
          itself. For a long time this variant existed and no caller ever passed it, an invalid field looked identical
          to a valid one, and a screen reader was told nothing at all.
        </Rule>
      </Section>
      <BestPractices
        when={[
          "One line of free-form text, a name, a phone number, an email, a postcode.",
          "When the value comes from a known list the user filters by typing, use <code>Combobox</code>. The address step already does.",
          "When the answer is one of a few fixed options, use <code>Radio</code> or <code>Choicebox</code>. Do not make someone type what they could tap.",
        ]}
        behavior={[
          "Validate on blur or on submit, never on every keystroke. Flagging an email as invalid at the third character is technically true and practically hostile.",
          "Trim leading and trailing whitespace before submitting, so <code> SW1A 1AA</code> and <code>SW1A 1AA</code> resolve to one value.",
          "The postcode field validates live against postcodes.io because the answer is binary and useful immediately, that is the exception, not the rule.",
          "Keep the field focusable while submitting. Disable it only when input is genuinely impossible.",
        ]}
        content={[
          "Placeholders show an example value: <code>e.g. SW1A 1AA</code>, <code>you@example.com</code>. Never instructions like <em>Enter your email</em>.",
          "A placeholder is not a label. It disappears the moment someone types, which is exactly when they need it.",
          "Validation names the field and the constraint, ends in a period, and skips &ldquo;please&rdquo;: <em>Enter a full email address, including the domain.</em>",
        ]}
        accessibility={[
          "<code>state=\"error\"</code> sets <code>aria-invalid</code> automatically. Pair it with <code>aria-describedby</code> pointing at the message.",
          "Every field has an <code>aria-label</code>, because the funnel uses the step heading as its visible label rather than a per-field one.",
          "56px tall in the lead form, so the field is the largest thing on its step and the easiest thing to hit.",
          "Focus is a neutral ring in <code>--selection</code>, not brand red, red is reserved for the primary button.",
        ]}
      />
    </>
  );
}
