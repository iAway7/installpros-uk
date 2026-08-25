"use client";

import { useState } from "react";
import { Home, Ship, Building2, Caravan } from "lucide-react";
import { FormOption } from "@/components/system/form-option";
import { ConsentCheckbox } from "@/components/funnel/consent-checkbox";
import { PageHeader, Section, Preview, Code, Rule, Mono, BestPractices } from "../../_components/docs";

const OPTIONS = [
  { value: "residential", label: "Residential", icon: <Home className="h-6 w-6" /> },
  { value: "marine", label: "Marine", icon: <Ship className="h-6 w-6" /> },
  { value: "commercial", label: "Commercial", icon: <Building2 className="h-6 w-6" /> },
  { value: "mobile_rv", label: "Mobile/RV", icon: <Caravan className="h-6 w-6" /> },
];

export default function SelectionPage() {
  const [picked, setPicked] = useState("residential");
  const [consent, setConsent] = useState(false);
  const [consentDark, setConsentDark] = useState(false);
  const [showError, setShowError] = useState(true);

  return (
    <>
      <PageHeader
        title="Selection"
        lead="FormOption and the GDPR checkbox. Both are interactive below, click them. Neither uses brand red, and that is deliberate."
      />

      <Section title="FormOption" note="Single-select cards. Click to see the selected state.">
        <Preview>
          <div className="grid w-full grid-cols-2 gap-3 sm:max-w-md">
            {OPTIONS.map((o) => (
              <FormOption
                name="demo-install-type"
                key={o.value}
                label={o.label}
                icon={o.icon}
                selected={picked === o.value}
                onSelect={() => setPicked(o.value)}
              />
            ))}
          </div>
        </Preview>
        <Code>{`<FormOption
  name="install-type"
  label="Residential"
  icon={<Home className="h-6 w-6" />}
  selected={value === "residential"}
  onSelect={() => setValue("residential")}
/>`}</Code>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          It is a real radio group. It used to be a <Mono>&lt;button&gt;</Mono> with{" "}
          <Mono>aria-pressed</Mono>, which is toggle semantics — this thing is on or off,
          independently of its neighbours. Every use is a pick-one question, so a screen reader was
          announcing four unrelated switches where only one can be on. Arrow keys now move between
          options and the set is announced as a set.
        </p>
        <p className="mt-3 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          <Mono>name</Mono> is required and options in the same question must share it. Two groups
          on one page that share a name become one group, and choosing in either clears the other.
        </p>
        <p className="mt-3 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          The indicator is round with a tick. The shape is what tells someone whether they can pick
          one or several — round here and on Choicebox&apos;s radio, square on Choicebox&apos;s
          checkbox — so the tick is free to mean nothing more than &ldquo;this is the one&rdquo;.
        </p>
      </Section>

      <Section title="Consent checkbox" note="Shown on the final step of both lead forms.">
        <Preview className="!flex-col !items-stretch">
          <ConsentCheckbox checked={consent} onChange={setConsent} id="docs-consent" />
        </Preview>

        <div className="mt-4">
          <Preview dark className="!flex-col !items-stretch">
            <ConsentCheckbox checked={consentDark} onChange={setConsentDark} tone="dark" id="docs-consent-dark" />
          </Preview>
        </div>

        <div className="mt-4">
          <Preview className="!flex-col !items-stretch">
            <ConsentCheckbox
              checked={false}
              onChange={() => setShowError(false)}
              error={showError}
              id="docs-consent-error"
            />
          </Preview>
        </div>
      </Section>

      <Section title="Two rules you cannot break here">
        <div className="space-y-4">
          <Rule>
            <strong>Never pre-checked.</strong> Consent initialises to <Mono>false</Mono> and the submit is blocked until
            it is ticked. A pre-ticked GDPR box is not consent.
          </Rule>
          <Rule>
            <strong>Selection is neutral, never brand red.</strong> Checked boxes and selected cards use{" "}
            <Mono>--selection</Mono>. On the dark hero the checkbox inverts to white, and the terms link goes white
            too, because brand red on that background only reaches 3.4:1.
          </Rule>
        </div>
      </Section>
      <BestPractices
        when={[
          "<code>FormOption</code> for the install-type step, where each card commits the step on its own.",
          "<code>ConsentCheckbox</code> for an acknowledgment the user must actively affirm. It is the only checkbox on the funnel and it is deliberately the last thing before submit.",
          "For a generic multi-select with descriptions, reach for <code>Choicebox</code> instead, it is the generalised version of this pattern.",
        ]}
        behavior={[
          "Consent is never pre-ticked and blocks submit twice, in <code>canProceed()</code> and again in <code>submit()</code>. A pre-ticked GDPR box is not consent.",
          "The consent error appears on a blocked submit, not on blur, ticking and unticking should not flash red.",
          "Selection uses <code>--selection</code>, never brand red, so the CTA below stays the only red thing on the step.",
          "On the dark hero the checkbox inverts to white and the terms link goes white too, because brand red on that background only reaches 3.4:1.",
        ]}
        content={[
          "The consent sentence is full prose ending in a period, not a fragment. It is a legal statement and should read like one.",
          "Option labels are single Title Case nouns, <em>Residential</em>, <em>Marine</em>, <em>Commercial</em>. Parallel and scannable.",
          "The terms link says <em>terms and conditions</em>, not <em>here</em> or <em>this link</em>.",
        ]}
        accessibility={[
          "<code>FormOption</code> is a real radio group and <code>name</code> is required. It used to be a <code>&lt;button&gt;</code> with <code>aria-pressed</code>, which announced four unrelated on/off switches for a question where only one can be on.",
          "Two radio groups on one page must not share a <code>name</code> — choosing in either would clear the other.",
          "The consent checkbox sets <code>aria-invalid</code> and <code>aria-describedby</code> when it errors, and the message carries <code>role=\"alert\"</code>.",
          "The whole label row is the click target, so the real target is 44px+ even though the box itself is 20px.",
          "Selected state is a border plus a ring plus a filled indicator, never colour alone.",
        ]}
      />
    </>
  );
}
