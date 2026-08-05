"use client";

import { useState } from "react";
import { Progress, StepProgress } from "@/components/system/progress";
import { FunnelButton } from "@/components/system/funnel-button";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

export default function ProgressPage() {
  const [step, setStep] = useState(2);

  return (
    <>
      <PageHeader
        title="Progress"
        lead="Two shapes for the same idea. A bar when the total is a quantity, steps when it is a sequence. Both are determinate — if you do not know the end, use a spinner instead."
      />

      <Section title="Bar">
        <Preview className="!block">
          <div className="max-w-md space-y-6">
            <Progress label="Uploading property photos" value={64} showValue />
            <Progress label="Survey completed" value={100} variant="success" showValue />
            <Progress label="Compact" value={30} size="sm" />
          </div>
        </Preview>
        <Code>{`<Progress label="Uploading property photos" value={64} showValue />`}</Code>
      </Section>

      <Section title="Steps" note="For the lead form, where the steps are not equal in effort.">
        <Preview className="!block">
          <div className="max-w-md">
            <StepProgress current={step} total={4} />
            <div className="mt-5 flex items-center gap-3">
              <FunnelButton size="sm" variant="secondary" onClick={() => setStep((s) => Math.max(1, s - 1))}>Back</FunnelButton>
              <FunnelButton size="sm" onClick={() => setStep((s) => Math.min(4, s + 1))}>Next</FunnelButton>
              <span className="text-[14px] text-neutral-500">Step {step} of 4</span>
            </div>
          </div>
        </Preview>
        <Code>{`<StepProgress current={step} total={4} />`}</Code>
      </Section>

      <BestPractices
        when={[
          "Use the bar for a quantity with a known total — photos uploaded, survey questions answered.",
          "Use steps for a sequence. <em>Step 2 of 4</em> is more honest than <em>50%</em> when step 3 takes four times as long as step 1.",
          "If the end is unknown, do not fake it. A bar that never fills damages trust more than a spinner that never claims to know.",
        ]}
        behavior={[
          "The fill animates over 450ms with the system easing, so a jump from 20% to 80% reads as movement rather than a teleport.",
          "The value is clamped to 0–100. A progress bar that overflows its track is a bug the component refuses to render.",
          "Never animate backwards. If a step is undone, jump instantly — reversing the fill reads as an error.",
        ]}
        content={[
          "<code>label</code> names what is progressing, in sentence case: <em>Uploading property photos</em>. Not <em>Progress</em>, not <em>Loading</em>.",
          "Show the percentage only when it is actionable. On a three-second upload it is noise.",
        ]}
        accessibility={[
          "<code>role=\"progressbar\"</code> with <code>aria-valuenow</code>, <code>aria-valuemin</code> and <code>aria-valuemax</code>, so assistive tech can read the position.",
          "<code>label</code> is required and becomes <code>aria-label</code> — a bar with no name announces a number with no subject.",
          "<code>StepProgress</code> wraps its segments in a group labelled <em>step 2 of 4</em>. The segments themselves are <code>aria-hidden</code> decoration.",
        ]}
      />
    </>
  );
}
