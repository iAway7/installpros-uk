import { Badge, Pill } from "@/components/system/badge";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

export const metadata = { title: "Badge" };

export default function BadgePage() {
  return (
    <>
      <PageHeader
        title="Badge & Pill"
        lead="Two small labels with different jobs. A Badge names what something is and does not change. A Pill shows what state something is in right now."
      />

      <Section title="Badge" note="Uppercase, static. Already used on the equipment cards.">
        <Preview>
          <Badge>Supply &amp; Fit</Badge>
          <Badge>All-metal</Badge>
          <Badge variant="neutral">Add-on</Badge>
          <Badge variant="success">Included</Badge>
        </Preview>
        <Code>{`<Badge>Supply & Fit</Badge>
<Badge variant="neutral">Add-on</Badge>`}</Code>
      </Section>

      <Section title="Filled badge" note="For when it needs to carry more weight.">
        <Preview>
          <Badge fill>New</Badge>
          <Badge fill variant="neutral">Draft</Badge>
          <Badge fill variant="success">Installed</Badge>
          <Badge fill variant="error">Cancelled</Badge>
        </Preview>
      </Section>

      <Section title="Pill" note="Sentence case with a dot. For state that moves.">
        <Preview>
          <Pill variant="neutral">New lead</Pill>
          <Pill variant="warning">Awaiting survey</Pill>
          <Pill variant="brand">Booked</Pill>
          <Pill variant="success">Installed</Pill>
          <Pill variant="error">Lost</Pill>
        </Preview>
        <Code>{`<Pill variant="warning">Awaiting survey</Pill>`}</Code>
      </Section>

      <BestPractices
        when={[
          "<strong>Badge</strong> for a fixed attribute of a thing: <em>Supply &amp; Fit</em>, <em>All-metal</em>, <em>Add-on</em>. It never changes for a given item.",
          "<strong>Pill</strong> for a state that moves through a lifecycle: a lead going from <em>New</em> to <em>Booked</em> to <em>Installed</em>. This is the one the leads table wants.",
          "Neither is a button. If it does something when clicked, it is a button or a filter chip, and it should look like one.",
        ]}
        behavior={[
          "Both are <code>shrink-0</code> and <code>whitespace-nowrap</code>, so they never wrap mid-word or get squeezed in a flex row.",
          "One badge per item. A card with four badges has no hierarchy left.",
          "Keep the variant set small. Six pill colours in a table means people read the legend instead of the data.",
        ]}
        content={[
          "Badges are 1–3 words, Title Case, rendered uppercase by the style — write them in normal case in the JSX.",
          "Pills are sentence case, because they read as state rather than as a label: <em>Awaiting survey</em>, not <em>AWAITING SURVEY</em>.",
          "Name the state from the reader&rsquo;s point of view. <em>Awaiting survey</em> tells you what is blocked; <em>Status 3</em> does not.",
        ]}
        accessibility={[
          "The Pill dot is <code>aria-hidden</code> — colour and a dot are decoration, the word is the information.",
          "Never encode meaning in colour alone. A red pill that just says the item&rsquo;s name is unreadable to anyone who cannot see the red.",
          "<code>--gold</code> on white fails contrast as text. The warning variants use it for the dot and the border; the label stays <code>--foreground</code>.",
        ]}
      />
    </>
  );
}
