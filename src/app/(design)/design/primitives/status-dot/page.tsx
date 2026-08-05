import { StatusDot } from "@/components/system/status-dot";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

export const metadata = { title: "Status dot" };

export default function StatusDotPage() {
  return (
    <>
      <PageHeader
        title="Status dot"
        lead="A coloured dot with a label. The dot is decoration — the label carries the meaning, because a dot alone is unreadable to anyone who cannot see the hue."
      />

      <Section title="States">
        <Preview className="!flex-col !items-start">
          <StatusDot state="neutral">New lead</StatusDot>
          <StatusDot state="active">Engineer en route</StatusDot>
          <StatusDot state="success">Installed</StatusDot>
          <StatusDot state="warning">Awaiting survey</StatusDot>
          <StatusDot state="error">Lost</StatusDot>
        </Preview>
        <Code>{`<StatusDot state="success">Installed</StatusDot>`}</Code>
      </Section>

      <Section title="Live" note="Pulse only for something happening right now.">
        <Preview>
          <StatusDot state="active" pulse>Install in progress</StatusDot>
        </Preview>
      </Section>

      <BestPractices
        when={[
          "Inline status next to a name or a row — a lead in a list, an engineer on a schedule.",
          "For a status that needs to stand out as a chip, use <code>Pill</code>. Same idea with a border and more presence.",
          "Never as the only column in a table. A grid of dots is a puzzle.",
        ]}
        behavior={[
          "<code>pulse</code> is for genuinely live state only. A pulsing dot on a static row is movement with nothing behind it, and it pulls the eye away from everything else.",
          "Keep the state set small. Five is already a lot to hold in memory across a table.",
        ]}
        content={[
          "The label is sentence case and names the state from the reader&rsquo;s point of view: <em>Awaiting survey</em>, not <em>Status 3</em>.",
          "Keep it to one or two words so rows stay scannable.",
        ]}
        accessibility={[
          "The dot is <code>aria-hidden</code>. Colour is reinforcement, never the message.",
          "Omitting the label needs a very good reason and an <code>aria-label</code> in its place — a bare dot announces nothing.",
          "Warning uses <code>--gold</code>, which fails contrast as text. It is fine on a 7px dot next to a dark label; it is not fine as the label colour.",
        ]}
      />
    </>
  );
}
