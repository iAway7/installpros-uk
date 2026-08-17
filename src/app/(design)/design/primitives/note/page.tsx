import { Note } from "@/components/system/note";
import { Button } from "@/components/system/button";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

export const metadata = { title: "Note" };

export default function NotePage() {
  return (
    <>
      <PageHeader
        title="Note"
        lead="Inline message sitting next to the thing it describes. Persistent until the underlying state changes — if it needs dismissing, it probably wanted to be a toast."
      />

      <Section title="Variants" note="Pick by meaning, not by colour.">
        <Preview className="!flex-col !items-stretch">
          <Note>We install across all four nations, including the Highlands and the islands.</Note>
          <Note variant="success">Your postcode is covered. Engineers are usually on site within the week.</Note>
          <Note variant="warning" label="Lead time">Same-day slots are fully booked until Thursday.</Note>
          <Note variant="error" label="Coverage">We could not check your postcode just now.</Note>
        </Preview>
        <Code>{`<Note variant="warning" label="Lead time">
  Same-day slots are fully booked until Thursday.
</Note>`}</Code>
      </Section>

      <Section title="Filled" note="More weight, for when the note is the point of the block.">
        <Preview className="!flex-col !items-stretch">
          <Note fill variant="success">Covered — engineers on site this week.</Note>
          <Note fill variant="warning">Listed buildings need a survey before we can quote.</Note>
        </Preview>
      </Section>

      <Section title="With an action" note="One CTA. Never two.">
        <Preview className="!block">
          <Note
            variant="warning"
            label="Obstruction"
            action={<Button size="sm">Book a survey</Button>}
          >
            Trees on the south elevation may block the line of sight.
          </Note>
        </Preview>
      </Section>

      <Section title="Sizes and no icon">
        <Preview className="!flex-col !items-stretch">
          <Note size="sm">A small note, for dense contexts.</Note>
          <Note icon={null}>Pass a null icon to render none at all.</Note>
        </Preview>
      </Section>

      <BestPractices
        when={[
          "Inline feedback next to the field, card or section it describes — a lead-time warning above the date picker, a coverage result under the postcode field.",
          "Use <code>Banner</code> when the message is page-level and needs a CTA. Use a toast for something transient. Use <code>ErrorMessage</code> for field validation — a Note is too heavy for &ldquo;check your email&rdquo;.",
          "Choose the variant by meaning: <code>error</code> for a problem the user must fix, <code>warning</code> for a consequence to acknowledge, <code>success</code> for a passed check, <code>secondary</code> for neutral information.",
        ]}
        behavior={[
          "Persistent until the state changes. There is no dismiss control on purpose — a dismissable note competes with its own message.",
          "One note per concept. Three stacked on a card means the page architecture is wrong, not the copy.",
          "<code>action</code> holds a single inline CTA. A second button turns the note into a dialog it is not.",
        ]}
        content={[
          "<code>label</code> is a 1–2 word Title Case prefix naming the topic: <code>Lead time</code>, <code>Coverage</code>, <code>Obstruction</code>. Cut hedges — no &ldquo;Heads up&rdquo;, no &ldquo;Please note&rdquo;.",
          "The body is one sentence in active voice naming the impact: <em>Same-day slots are fully booked until Thursday.</em> Not <em>Please be aware that availability may be limited.</em>",
          "Labels take no period; full sentences in the body do.",
        ]}
        accessibility={[
          "<code>role=\"note\"</code>, so assistive tech announces it as an aside rather than as body copy.",
          "The icon is decorative and <code>aria-hidden</code>. The variant must never be the only signal — the label and the wording carry the meaning.",
          "Warning uses <code>--gold</code>, which fails contrast as text on white. It is used for the border and the icon only; the body text stays <code>--foreground</code>.",
        ]}
      />
    </>
  );
}
