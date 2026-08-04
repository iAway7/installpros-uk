import { PageHeader, Section, Table, Mono, Rule, Code } from "../_components/docs";

export const metadata = { title: "Accessibility" };

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader
        title="Accessibility"
        lead="Target is WCAG 2.1 AA. This page records what the system guarantees, and — just as usefully — what it currently does not."
      />

      <Section title="Contrast" note="Measured against the surface each colour actually sits on.">
        <Table
          head={["Pair", "Ratio", "Verdict"]}
          rows={[
            ["--foreground #171717 on white", "17.3:1", "✅ AAA"],
            ["--muted-foreground #666666 on white", "5.6:1", "✅ AA"],
            ["--primary #C70505 on white", "5.9:1", "✅ AA"],
            ["White on --primary", "6.1:1", "✅ AA"],
            ["--error #DC2626 on white", "4.8:1", "✅ AA"],
            ["--success #15803D on white", "4.9:1", "✅ AA"],
            ["--brand-soft #FF5A5A on white", "2.9:1", "❌ decorative only — never text"],
          ]}
        />
        <div className="mt-6">
          <Rule>
            <Mono>--brand-soft</Mono> exists for borders and glows. It fails badly as text on light, which is exactly
            why it is named &quot;soft&quot; and not &quot;light&quot; — a name should make the wrong use feel wrong.
          </Rule>
        </div>
      </Section>

      <Section title="Focus" note="One treatment, everywhere.">
        <Code>{`focus-visible:outline-none
focus-visible:ring-2 focus-visible:ring-ring
focus-visible:ring-offset-2`}</Code>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          <Mono>--ring</Mono> resolves to <Mono>--selection</Mono> (#1A1512), not brand red. A red ring on a red button
          is invisible. <Mono>focus-visible</Mono> rather than <Mono>focus</Mono>, so mouse users do not see a ring they
          did not ask for.
        </p>
      </Section>

      <Section title="Forms">
        <ul className="space-y-3 text-[15px] leading-[1.7] text-neutral-600">
          <li>
            <strong className="text-neutral-900">Error is never colour alone.</strong>{" "}
            <Mono>state=&quot;error&quot;</Mono> sets <Mono>aria-invalid</Mono>, the message carries{" "}
            <Mono>role=&quot;alert&quot;</Mono>, and the field points at it with <Mono>aria-describedby</Mono>.
          </li>
          <li>
            <strong className="text-neutral-900">Consent is never pre-ticked</strong> and blocks submit until checked.
          </li>
          <li>
            <strong className="text-neutral-900">Selection cards use <Mono>aria-pressed</Mono></strong>, since each one
            commits the step rather than belonging to a radio group.
          </li>
        </ul>
      </Section>

      <Section title="Touch targets">
        <Table
          head={["Control", "Height", "Verdict"]}
          rows={[
            ["Button — default", "48px", "✅"],
            ["Input — lg", "56px", "✅"],
            ["Consent checkbox", "20px box, 44px+ label row", "✅ via the label"],
            ["Button — sm", "36px", "⚠️ desktop only"],
          ]}
        />
      </Section>

      <Section title="Motion">
        <p className="max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          <Mono>prefers-reduced-motion: reduce</Mono> collapses every animation and transition to 0.01ms globally and
          disables smooth scrolling. The counting stats and the live speed meters check it individually and render their
          final value straight away.
        </p>
      </Section>

      <Section title="Known gaps" note="Recorded rather than quietly ignored.">
        <ul className="space-y-3 text-[15px] leading-[1.7] text-neutral-600">
          <li>
            The FAQ accordion trigger has no <Mono>focus-visible</Mono> treatment of its own — it falls back to the
            browser outline.
          </li>
          <li>
            The before/after comparison is drag-only on desktop. There is no keyboard equivalent for moving the divider.
          </li>
          <li>
            Trust-bar microcopy runs to 8.5px (&quot;As featured in&quot;). It is decorative, but it is genuinely small.
          </li>
        </ul>
      </Section>
    </>
  );
}
