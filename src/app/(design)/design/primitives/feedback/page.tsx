"use client";

import { Feedback, FeedbackInline } from "@/components/system/feedback";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

export default function FeedbackPage() {
  return (
    <>
      <PageHeader
        title="Feedback"
        lead="Gathers text with an associated emotion. The emotion is what makes free text worth collecting, it gives you something to sort by when a hundred come in."
      />

      <Section title="Inline" note="One line. Use at the end of an answer or a page.">
        <Preview>
          <FeedbackInline />
        </Preview>
        <Code>{`<FeedbackInline question="Was this helpful?" onSubmit={(e) => track(e)} />`}</Code>
      </Section>

      <Section title="Full" note="Text plus emotion. Use where someone has something to say.">
        <Preview>
          <Feedback />
        </Preview>
        <Code>{`<Feedback onSubmit={({ text, emotion }) => send(text, emotion)} />`}</Code>
      </Section>

      <BestPractices
        when={[
          "Use the inline form on FAQ answers and help content, where the question is cheap to answer and the answer is useful in aggregate.",
          "Use the full form after a completed action, a booking confirmed, an install finished. Not before someone has experienced anything.",
          "Never on the lead funnel. Every element on that page either moves someone towards a quote or gets in the way.",
        ]}
        behavior={[
          "One interaction ends it. The inline form replaces itself with thanks on the first tap, asking a follow-up after someone has already helped you is a tax.",
          "Send stays disabled until there is either text or an emotion. An empty submission is noise in the inbox.",
          "The emotion is optional on the full form. Forcing a rating before text loses the people with the most specific thing to say.",
          "Nothing is retried or queued. If the submit fails, it fails quietly, this is not data worth interrupting someone over.",
        ]}
        accessibility={[
          "Each face is a real button with an <code>aria-label</code> (&ldquo;Unhappy&rdquo;, &ldquo;Delighted&rdquo;) and <code>aria-pressed</code>. The emoji itself is <code>aria-hidden</code>, screen readers read emoji names inconsistently and often absurdly.",
          "The textarea has a visually-hidden label. A placeholder is not a label; it disappears the moment someone types.",
          "Selected state is a background plus a ring, not colour alone.",
        ]}
      />
    </>
  );
}
