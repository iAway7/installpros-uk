"use client";

import { toast } from "@/components/system/toast";
import { Button } from "@/components/system/button";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

export default function ToastPage() {
  return (
    <>
      <PageHeader
        title="Toast"
        lead="Transient confirmation of something that already happened. If the user has to respond, it is a Modal. If it persists until state changes, it is a Note."
      />

      <Section title="Try them">
        <Preview>
          <Button size="sm" onClick={() => toast.success("Quote request submitted")}>Success</Button>
          <Button size="sm" variant="secondary" onClick={() => toast.error("Something went wrong", "Try again, or call 020 3397 7003.")}>Error</Button>
          <Button size="sm" variant="outline" onClick={() => toast.info("Photos saved as a draft")}>Info</Button>
        </Preview>
        <Code>{`import { toast } from "@/components/system/toast";

toast.success("Quote request submitted");
toast.error("Something went wrong", "Try again, or call 020 3397 7003.");

toast.promise(submitLead(data), {
  loading: "Submitting…",
  success: "Quote request submitted",
  error: "Could not submit. Try again",
});`}</Code>
      </Section>

      <BestPractices
        when={[
          "Something completed and needs no follow-up: a lead submitted, photos uploaded, a change saved.",
          "Never for validation. A field error must sit next to the field, a toast that disappears cannot be re-read while fixing the input.",
          "Never for anything the user must act on. It vanishes, and so does the action.",
        ]}
        behavior={[
          "Success runs 4s, errors 6s. Failure copy takes longer to process than success copy.",
          "One toast per action. Two firing together means one of them is redundant.",
          "<code>toast.promise</code> ties the lifecycle to the request, so there is no window where the UI looks idle but work is in flight.",
          "Position is <code>top-center</code>, set once in the root layout. Do not override it per call, inconsistent placement is how people miss them.",
        ]}
        content={[
          "The title states what happened in the past tense: <em>Quote request submitted</em>. No exclamation marks.",
          "Put the recovery in the description, not the title: <em>Try again, or call 020 3397 7003.</em>",
          "Never say &ldquo;Success!&rdquo; on its own. Success at what?",
        ]}
        accessibility={[
          "Sonner renders into a live region, so a screen reader announces it without stealing focus.",
          "Because it is not focusable, a toast must never be the only way to learn something. Anything important also belongs on the page.",
          "The durations respect the reduced-motion preference for their entrance animation, but the timing itself does not change.",
        ]}
      />
    </>
  );
}
