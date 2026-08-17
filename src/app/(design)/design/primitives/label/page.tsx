import { Label } from "@/components/system/label";
import { Input } from "@/components/system/input";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

export const metadata = { title: "Label" };

export default function LabelPage() {
  return (
    <>
      <PageHeader
        title="Label"
        lead="Names a form control. The funnel gets away without visible labels because each step asks one question in a heading — everywhere else, a field needs one."
      />

      <Section title="Default">
        <Preview className="!block">
          <div className="max-w-sm">
            <Label htmlFor="demo-postcode">Postcode</Label>
            <Input id="demo-postcode" placeholder="e.g. SW1A 1AA" />
          </div>
        </Preview>
        <Code>{`<Label htmlFor="postcode">Postcode</Label>
<Input id="postcode" placeholder="e.g. SW1A 1AA" />`}</Code>
      </Section>

      <Section title="Required and hint">
        <Preview className="!block">
          <div className="max-w-sm space-y-5">
            <div>
              <Label htmlFor="demo-phone" required>Phone number</Label>
              <Input id="demo-phone" placeholder="07123 456789" />
            </div>
            <div>
              <Label htmlFor="demo-notes" hint="Optional">Access notes</Label>
              <Input id="demo-notes" placeholder="Gate code, parking…" />
            </div>
          </div>
        </Preview>
      </Section>

      <BestPractices
        when={[
          "Every input, select, textarea and radio group outside the funnel wizard.",
          "Inside the funnel, the step heading is the label — that is why the fields carry <code>aria-label</code> instead. Do not add a second visible label there.",
          "Mark the exception, not the rule: if most fields are required, label the optional ones with <code>hint=\"Optional\"</code> rather than starring everything.",
        ]}
        behavior={[
          "<code>htmlFor</code> is required, not optional. It is what makes clicking the label focus the field, which is half the point.",
          "The required marker goes on the label; <code>aria-required</code> goes on the input. They are two different jobs.",
          "Sits above the field, never beside it. Left-aligned labels look tidier in a mockup and read slower in practice.",
        ]}
        content={[
          "Short Title Case nouns: <code>Postcode</code>, <code>Phone Number</code>, <code>Access Notes</code>. No trailing colon.",
          "Never phrase it as a question — that is the heading&rsquo;s job. <em>Phone number</em>, not <em>What is your phone number?</em>",
          "Helper text goes in a sibling element wired through <code>aria-describedby</code>, not inside the label.",
        ]}
        accessibility={[
          "A placeholder is not a label. It vanishes exactly when the user needs it, and screen readers treat it inconsistently.",
          "The asterisk is <code>aria-hidden</code> — <code>aria-required</code> on the input is what actually announces it.",
          "A disabled label drops to 50% opacity, which fails contrast. That is acceptable only because the field is not operable; never use that opacity on live text.",
        ]}
      />
    </>
  );
}
