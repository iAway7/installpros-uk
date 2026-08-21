import { PageHeader, Section, Code, Mono, Rule, Table } from "../_components/docs";

export const metadata = { title: "Patterns" };

export default function PatternsPage() {
  return (
    <>
      <PageHeader
        title="Patterns"
        lead="Decisions about how something works, not what it looks like. A pattern survives a redesign, these are the parts of the funnel that would be rebuilt the same way even if every colour changed."
      />

      <Section title="Progressive lead capture" note="The most important pattern on the site. One question per screen.">
        <Code>{`0  Postcode      → validated live against postcodes.io
1  Name          → autofocus
2  Phone         → formatted as you type, tick on valid
3  Email         → tick on valid
4  Install type  → cards + GDPR consent → submit`}</Code>
        <ul className="mt-5 space-y-3 text-[15px] leading-[1.7] text-neutral-600">
          <li>
            <strong className="text-neutral-900">Coverage before commitment.</strong> Step 0 asks for a postcode, not
            contact details, and answers a question the visitor actually has (&quot;do you even cover me?&quot;) before
            asking for anything.
          </li>
          <li>
            <strong className="text-neutral-900">Echo the answer back.</strong>{" "}
            <em>&quot;Great! We&apos;re available in Westminster.&quot;</em> Naming their area proves the check was real.
          </li>
          <li>
            <strong className="text-neutral-900">Enter advances.</strong> A keypress listener moves to the next step, so
            the form can be completed without touching the mouse.
          </li>
          <li>
            <strong className="text-neutral-900">Every step is tracked.</strong>{" "}
            <Mono>FORM_STEP_VIEWED</Mono> fires per step, which is what makes drop-off visible per question rather than
            per form.
          </li>
        </ul>
        <div className="mt-6">
          <Rule>
            The consent checkbox lives on the last step and is never pre-ticked. Submission is blocked twice, once in{" "}
            <Mono>canProceed()</Mono> and again in <Mono>submit()</Mono>.
          </Rule>
        </div>
      </Section>

      <Section title="Two entry points, one form" note="The same wizard appears twice per page.">
        <Table
          head={["Placement", "Component", "Surface"]}
          rows={[
            ["Hero", <Mono key="a">ZipAvailabilityChecker</Mono>, "Dark, tone=\"dark\""],
            ["CTA section", <Mono key="b">ServiceQuoteForm</Mono>, "Light card"],
          ]}
        />
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          They are separate components with near-identical logic, which is duplication worth knowing about: a fix to one
          usually needs applying to both.
        </p>
      </Section>

      <Section title="Proof stacking" note="Credibility is delivered in layers rather than one block.">
        <Code>{`Hero trust bar   Google 5.0 · Trustpilot · 9,163 installs · The Times
Customer stories live Google reviews, topped up with curated ones
Trustpilot grid  the official widget, auto-updating
Track record     four numbers, counted up on scroll`}</Code>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          The reviews section never renders empty: if fewer than three live reviews pass the 4★ filter, curated ones top
          it up. An empty proof section is worse than no proof section.
        </p>
      </Section>

      <Section title="Demonstrate, don't claim" note="The before/after comparison.">
        <p className="max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          Instead of claiming Starlink is faster, the section runs a real Cloudflare speed test against the visitor&apos;s
          own line and puts the result next to a typical installed figure. It is the one place on the page where the
          proof is generated live rather than asserted, and on mobile it becomes two stacked cards, because the drag
          comparison cannot survive a 375px viewport.
        </p>
      </Section>

      <Section title="CTA pairing" note="Every CTA moment offers one commitment and one low-friction alternative.">
        <Code>{`[ CHECK AVAILABILITY ]   [ TALK ON WHATSAPP ]
   primary, red             outline, WhatsApp green icon`}</Code>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          Never two primaries. The second option exists for people who are not ready to fill in a form, and it must not
          compete visually with the one that is.
        </p>
      </Section>
    </>
  );
}
