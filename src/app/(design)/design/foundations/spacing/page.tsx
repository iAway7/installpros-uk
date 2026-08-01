import { PageHeader, Section, Table, Mono, Rule } from "../../_components/docs";

export const metadata = { title: "Spacing & radius" };

const RADII = [
  { token: "radius/sm", px: 8, use: "—" },
  { token: "radius/md", px: 10, use: "Input, checkbox" },
  { token: "radius/lg", px: 12, use: "Button, FormOption — the base radius" },
  { token: "radius/xl", px: 16, use: "Review card" },
  { token: "radius/icon", px: 13, use: "Card icon chip" },
  { token: "radius/card", px: 22, use: "Feature card" },
  { token: "radius/equipment", px: 26, use: "Equipment card" },
  { token: "radius/panel", px: 30, use: "Before/after comparison" },
  { token: "radius/cta", px: 32, use: "CTA block" },
  { token: "radius/full", px: 999, use: "Pills, avatars, round buttons" },
];

export default function SpacingPage() {
  return (
    <>
      <PageHeader
        title="Spacing & radius"
        lead="The vertical rhythm is one pair of values repeated down the page. The radius scale is longer than it should be — that is documented honestly below rather than tidied away."
      />

      <Section
        title="Vertical rhythm"
        note="Eight of the eleven sections use the same pair. Anything new should too."
      >
        <Table
          head={["Context", "Mobile", "Desktop"]}
          rows={[
            ["Section padding", "64px", "96px"],
            ["Container max width", "1152px", "1152px"],
            ["Container side padding", "24px", "24px"],
            ["Grid gap between cards", "14px", "14px"],
            ["Card padding", "28px", "28px"],
            ["Lead form width", "448px", "448px"],
          ]}
        />
      </Section>

      <Section title="Control heights" note="Two heights cover every interactive control.">
        <Table
          head={["Control", "Height", "Notes"]}
          rows={[
            [<Mono key="a">h-12</Mono>, "48px", "Button — comfortably above the 44px touch-target minimum"],
            [<Mono key="b">h-14</Mono>, "56px", "Lead form input, so the field is the biggest thing on the step"],
            [<Mono key="c">h-9</Mono>, "36px", "Small button. Below the touch minimum — desktop only"],
          ]}
        />
      </Section>

      <Section title="Radius">
        <div className="mb-6 flex flex-wrap gap-5">
          {RADII.filter((r) => r.px < 100).map((r) => (
            <div key={r.token} className="w-[128px]">
              <div
                className="h-20 border border-neutral-300 bg-neutral-100"
                style={{ borderRadius: r.px }}
              />
              <div className="mt-2 font-mono text-[12px] text-neutral-900">{r.px}px</div>
              <div className="text-[12px] text-neutral-500">{r.token.replace("radius/", "")}</div>
            </div>
          ))}
        </div>
        <Table
          head={["Token", "Value", "Where it is used"]}
          rows={RADII.map((r) => [<Mono key={r.token}>{r.token}</Mono>, `${r.px}px`, r.use])}
        />
        <div className="mt-6">
          <Rule>
            <strong>Ten radii is too many.</strong> Only three derive from <Mono>--radius</Mono>; the rest were chosen
            per card, one section at a time. They are documented because they are real, not because they are right — new
            surfaces should reach for <Mono>radius/card</Mono> (22px) before inventing an eleventh.
          </Rule>
        </div>
      </Section>
    </>
  );
}
