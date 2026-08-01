"use client";

import { useState } from "react";
import { Home, Ship, Building2, Caravan } from "lucide-react";
import { FormOption } from "@/components/funnel/ui/form-option";
import { ConsentCheckbox } from "@/components/funnel/consent-checkbox";
import { PageHeader, Section, Preview, Code, Rule, Mono } from "../../_components/docs";

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
        lead="FormOption and the GDPR checkbox. Both are interactive below — click them. Neither uses brand red, and that is deliberate."
      />

      <Section title="FormOption" note="Single-select cards. Click to see the selected state.">
        <Preview>
          <div className="grid w-full grid-cols-2 gap-3 sm:max-w-md">
            {OPTIONS.map((o) => (
              <FormOption
                key={o.value}
                label={o.label}
                icon={o.icon}
                selected={picked === o.value}
                onClick={() => setPicked(o.value)}
              />
            ))}
          </div>
        </Preview>
        <Code>{`<FormOption
  label="Residential"
  icon={<Home className="h-6 w-6" />}
  selected={value === "residential"}
  onClick={() => setValue("residential")}
/>`}</Code>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          It is a <Mono>&lt;button&gt;</Mono> with <Mono>aria-pressed</Mono>, not a radio — there is no group semantic,
          because each card commits the step on its own.
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
            <Mono>--selection</Mono>. On the dark hero the checkbox inverts to white — and the terms link goes white
            too, because brand red on that background only reaches 3.4:1.
          </Rule>
        </div>
      </Section>
    </>
  );
}
