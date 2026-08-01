import { ArrowRight } from "lucide-react";
import { FunnelButton } from "@/components/funnel/ui/funnel-button";
import { PageHeader, Section, Preview, Code, Table, Mono, Rule } from "../../_components/docs";

export const metadata = { title: "Button" };

export default function ButtonPage() {
  return (
    <>
      <PageHeader
        title="Button"
        lead="Everything below is the real FunnelButton — the same import the funnel uses. Change the component and this page changes with it."
      />

      <Section title="Variants" note="Primary is the only one that should appear more than once per screen sparingly.">
        <Preview>
          <FunnelButton>Get my free quote</FunnelButton>
          <FunnelButton variant="secondary">Back</FunnelButton>
          <FunnelButton variant="outline">Talk on WhatsApp</FunnelButton>
        </Preview>
        <Code>{`import { FunnelButton } from "@/components/funnel/ui/funnel-button";

<FunnelButton>Get my free quote</FunnelButton>
<FunnelButton variant="secondary">Back</FunnelButton>
<FunnelButton variant="outline">Talk on WhatsApp</FunnelButton>`}</Code>
      </Section>

      <Section title="Sizes">
        <Preview>
          <FunnelButton size="sm">Small</FunnelButton>
          <FunnelButton>Default</FunnelButton>
          <FunnelButton size="lg">Large</FunnelButton>
        </Preview>
        <div className="mt-4">
          <Table
            head={["Size", "Height", "Use"]}
            rows={[
              [<Mono key="a">sm</Mono>, "36px", "Desktop-only — below the 44px touch minimum"],
              [<Mono key="b">default</Mono>, "48px", "Everything"],
              [<Mono key="c">lg</Mono>, "56px", "Pairs with the 56px lead-form input"],
            ]}
          />
        </div>
      </Section>

      <Section title="States">
        <Preview>
          <FunnelButton>Default</FunnelButton>
          <FunnelButton disabled>Disabled</FunnelButton>
          <FunnelButton>
            Next <ArrowRight className="ml-1 h-4 w-4" />
          </FunnelButton>
        </Preview>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          Hover darkens the fill to <Mono>--brand-hover</Mono> (#9E0404) rather than dropping opacity, so the button
          keeps its weight over any background. Focus draws a 2px ring in <Mono>--selection</Mono>, not red — a red ring
          on a red button cannot be seen.
        </p>
      </Section>

      <Section title="On the hero">
        <Preview dark>
          <FunnelButton>Check availability</FunnelButton>
          <FunnelButton variant="secondary">Back</FunnelButton>
        </Preview>
      </Section>

      <Section title="The label">
        <Rule>
          <strong>12px, Bold, uppercase, +0.5px tracking.</strong> This is the only 12px uppercase style in the system
          besides the eyebrow. It was documented as 12px for months while a Tailwind override silently rendered it at
          16px — if you are touching the button, check what it actually computes to in the browser.
        </Rule>
      </Section>

      <Section title="Anti-patterns">
        <ul className="space-y-3 text-[15px] leading-[1.7] text-neutral-600">
          <li>
            <strong className="text-neutral-900">Do not hand-roll a button.</strong> Two CTAs on the page were{" "}
            <Mono>&lt;a&gt;</Mono> tags with copied classes and a 14px inline font size. They drifted from the component
            within a release.
          </li>
          <li>
            <strong className="text-neutral-900">Use asChild for links.</strong>{" "}
            <Mono>{`<FunnelButton asChild><a href="#quote">…</a></FunnelButton>`}</Mono> keeps the semantics right without
            duplicating styles.
          </li>
          <li>
            <strong className="text-neutral-900">Do not stack two primaries.</strong> If both options are red, neither is
            the call to action.
          </li>
        </ul>
      </Section>
    </>
  );
}
