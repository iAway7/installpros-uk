import { ArrowRight } from "lucide-react";
import { Button } from "@/components/system/button";
import { PageHeader, Section, Preview, Code, Table, Mono, Rule, BestPractices } from "../../_components/docs";

export const metadata = { title: "Button" };

export default function ButtonPage() {
  return (
    <>
      <PageHeader
        title="Button"
        lead="Everything below is the real Button — the same import the funnel uses. Change the component and this page changes with it."
      />

      <Section title="Variants" note="Primary is the only one that should appear more than once per screen sparingly.">
        <Preview>
          <Button>Get my free quote</Button>
          <Button variant="secondary">Back</Button>
          <Button variant="outline">Talk on WhatsApp</Button>
        </Preview>
        <Code>{`import { Button } from "@/components/system/button";

<Button>Get my free quote</Button>
<Button variant="secondary">Back</Button>
<Button variant="outline">Talk on WhatsApp</Button>`}</Code>
      </Section>

      <Section title="Sizes">
        <Preview>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
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
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button>
            Next <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Preview>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          Hover darkens the fill to <Mono>--brand-hover</Mono> (#9E0404) rather than dropping opacity, so the button
          keeps its weight over any background. Focus draws a 2px ring in <Mono>--selection</Mono>, not red — a red ring
          on a red button cannot be seen.
        </p>
      </Section>

      <Section title="On the hero">
        <Preview dark>
          <Button>Check availability</Button>
          <Button variant="secondary">Back</Button>
        </Preview>
      </Section>

      <Section title="The label">
        <Rule>
          <strong>12px, Bold, uppercase, +0.5px tracking.</strong> This is the only 12px uppercase style in the system
          besides the eyebrow. It was documented as 12px for months while a Tailwind override silently rendered it at
          16px — if you are touching the button, check what it actually computes to in the browser.
        </Rule>
      </Section>

      <BestPractices
        when={[
          "Use a button for something that happens — submitting the quote, advancing a step. Use <code>asChild</code> with an <code>&lt;a&gt;</code> for anything that changes the URL.",
          "Primary is the commitment. Outline is the low-friction alternative next to it (&ldquo;Talk on WhatsApp&rdquo;). Secondary is for going backwards.",
          "Never two primaries in a row. If both options are red, neither is the call to action.",
        ]}
        behavior={[
          "Hover darkens the fill to <code>--brand-hover</code> rather than dropping opacity, so the button holds its weight over the photo in the hero.",
          "Disable only when the action is genuinely impossible right now — an incomplete step, a submit already in flight. A disabled button with no explanation reads as broken.",
          "During submit the label swaps to a spinner plus &ldquo;Submitting…&rdquo; instead of the button disappearing, so the layout does not jump.",
          "Do not hand-roll one. The two CTAs that were <code>&lt;a&gt;</code> tags with copied classes drifted to 14px while every real button rendered 16px.",
        ]}
        content={[
          "Name what happens: <code>Get My Free Quote</code>, <code>Check Availability</code>. Not <code>Submit</code>, not <code>Continue</code> where something more specific is true.",
          "Labels render uppercase from the style, so write them in normal case in the JSX — <code>text-transform</code> is presentation, not content.",
          "Keep them short. At 12px uppercase with +0.5px tracking, a long label stops reading as a button and starts reading as a sentence.",
        ]}
        accessibility={[
          "Focus draws a 2px ring in <code>--selection</code>, never red. A red ring on a red button cannot be seen.",
          "An icon-only button needs an <code>aria-label</code> naming the action and its target — &ldquo;Previous reviews&rdquo;, not &ldquo;Previous&rdquo;.",
          "Do not put an <code>aria-label</code> on a button that already has visible text; it overrides the label and the screen reader says something different from what is on screen.",
          "48px tall by default, comfortably over the 44px touch minimum. <code>size=\"sm\"</code> is 36px and is desktop-only for that reason.",
        ]}
      />
    </>
  );
}
