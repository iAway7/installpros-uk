import { FunnelInput } from "@/components/funnel/ui/funnel-input";
import { PageHeader, Section, Preview, Code, Table, Mono, Rule } from "../../_components/docs";

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
          <FunnelInput inputSize="sm" placeholder="Small — 36px" />
          <FunnelInput placeholder="Default — 48px" />
          <FunnelInput inputSize="lg" placeholder="Large — 56px, used by the lead form" />
        </Preview>
      </Section>

      <Section title="States">
        <Preview className="!flex-col !items-stretch">
          <FunnelInput inputSize="lg" placeholder="Default" />
          <FunnelInput inputSize="lg" state="error" defaultValue="not-an-email" aria-describedby="err-demo" />
          <p id="err-demo" role="alert" className="text-[15px] text-error">
            Please enter a valid email address.
          </p>
          <FunnelInput inputSize="lg" placeholder="Disabled" disabled />
        </Preview>
        <Code>{`<FunnelInput
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
          itself. For a long time this variant existed and no caller ever passed it — an invalid field looked identical
          to a valid one, and a screen reader was told nothing at all.
        </Rule>
      </Section>
    </>
  );
}
