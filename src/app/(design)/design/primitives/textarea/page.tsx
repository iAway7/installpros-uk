import { Textarea } from "@/components/system/textarea";
import { Label } from "@/components/system/label";
import { ErrorMessage } from "@/components/system/error-message";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

export const metadata = { title: "Textarea" };

export default function TextareaPage() {
  return (
    <>
      <PageHeader
        title="Textarea"
        lead="Multi-line free text. The moment content can wrap to a second line, this is the right control and an Input is not."
      />

      <Section title="Default">
        <Preview className="!block">
          <div className="max-w-md">
            <Label htmlFor="ta-notes">Access notes</Label>
            <Textarea id="ta-notes" placeholder="Gate codes, parking, where to find the meter…" />
          </div>
        </Preview>
        <Code>{`<Label htmlFor="notes">Access notes</Label>
<Textarea id="notes" placeholder="Gate codes, parking…" />`}</Code>
      </Section>

      <Section title="Error and disabled">
        <Preview className="!flex-col !items-stretch">
          <div className="max-w-md">
            <Textarea state="error" defaultValue="…" aria-describedby="ta-err" />
            <div className="mt-2"><ErrorMessage id="ta-err">Add at least a sentence so the engineer knows what to expect.</ErrorMessage></div>
          </div>
          <div className="max-w-md">
            <Textarea disabled placeholder="Locked until the survey is booked" />
          </div>
        </Preview>
      </Section>

      <BestPractices
        when={[
          "Anything that can run past one line: access notes, obstruction descriptions, internal comments on a lead.",
          "For one line of structured text — a name, a postcode — use <code>Input</code>. A textarea invites more than you want.",
          "Size <code>rows</code> to the expected answer. A four-row box asks for a paragraph; a two-row box asks for a sentence.",
        ]}
        behavior={[
          "Resizes vertically by default. Taking that away forces people to write in a keyhole — do it only when the layout genuinely cannot absorb it.",
          "Horizontal resize is never allowed. It breaks everything around it and nobody wants it.",
          "Validate on blur, and never truncate silently. If there is a limit, show the count before it is hit.",
        ]}
        content={[
          "The placeholder is an example, not an instruction: <em>Gate codes, parking, where to find the meter…</em>",
          "If the answer is optional, mark it on the label with <code>hint=\"Optional\"</code> rather than leaving people guessing.",
        ]}
        accessibility={[
          "<code>state=\"error\"</code> sets <code>aria-invalid</code>; pair it with <code>aria-describedby</code> pointing at the message.",
          "Always pair with a <code>Label</code> and <code>htmlFor</code>. A textarea with only a placeholder is unlabelled the moment someone types.",
          "16px text, like every other field — below that iOS Safari zooms the page on focus.",
        ]}
      />
    </>
  );
}
