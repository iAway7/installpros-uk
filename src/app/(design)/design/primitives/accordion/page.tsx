import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/system/accordion";
import { PageHeader, Section, Preview, Code, Table, Mono, BestPractices } from "../../_components/docs";

export const metadata = { title: "Accordion" };

export default function AccordionPage() {
  return (
    <>
      <PageHeader
        title="Accordion"
        lead="Collapsible sections for content people scan rather than read. Built on Radix, so keyboard navigation and the ARIA wiring come for free, what this adds is the type scale and the Plus that rotates into a close."
      />

      <Section
        title="Single"
        note="One open at a time. The default for an FAQ, where two open answers just push the rest off screen."
      >
        <Preview className="!block">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="a">
              <AccordionTrigger>How much does Starlink installation cost?</AccordionTrigger>
              <AccordionContent>
                Every property is different, so we quote after a virtual or physical survey, same day,
                fixed price, no call-out fee.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>How quickly can you install?</AccordionTrigger>
              <AccordionContent>
                Typically within the week. The install itself takes two to five hours.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Preview>
        <Code>{`<Accordion type="single" collapsible>
  <AccordionItem value="cost">
    <AccordionTrigger>How much does installation cost?</AccordionTrigger>
    <AccordionContent>Every property is different…</AccordionContent>
  </AccordionItem>
</Accordion>`}</Code>
      </Section>

      <Section
        title="Multiple"
        note="Several open at once. Use it when someone is comparing answers, not reading one."
      >
        <Preview className="!block">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="a">
              <AccordionTrigger>Residential</AccordionTrigger>
              <AccordionContent>Roof, wall or pole mount, cable run and router placement.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Commercial</AccordionTrigger>
              <AccordionContent>Offices, farms, marinas and sites, with mesh where the span needs it.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Preview>
      </Section>

      <Section title="Anatomy">
        <Table
          head={["Part", "Renders", "Notes"]}
          rows={[
            [<Mono key="r">Accordion</Mono>, "Radix Root", <>Takes <Mono>type</Mono> and <Mono>collapsible</Mono>. Nothing is styled here.</>],
            [<Mono key="i">AccordionItem</Mono>, "Radix Item", <>Adds <Mono>border-b border-border</Mono>. The rule between rows is the item&rsquo;s, not the list&rsquo;s.</>],
            [<Mono key="t">AccordionTrigger</Mono>, "Header + Trigger", <>20px semibold, <Mono>py-5</Mono>, with the Plus icon on the right.</>],
            [<Mono key="c">AccordionContent</Mono>, "Radix Content", <>18px, <Mono>--muted-foreground</Mono>, animated open and closed.</>],
          ]}
        />
      </Section>

      <BestPractices
        when={[
          "Content people scan and sample: FAQs, service breakdowns, spec detail. The value is that the list of questions stays visible.",
          "Not for anything most visitors need. If the majority opens a panel, it was never optional, put it on the page. Collapsing it just adds a click and hides it from anyone who does not think to look.",
          "Not for sequential steps. A form that must be completed in order wants a stepper with a progress indicator, not panels that can be opened in any order.",
          "Not for navigation. Links that go somewhere belong in <code>Menu</code> or <code>Tabs</code>; an accordion promises the answer is right here.",
        ]}
        behavior={[
          "<code>type=\"single\"</code> keeps one panel open. <code>type=\"multiple\"</code> allows several. Add <code>collapsible</code> so the last open panel can also be closed, without it the user can never get back to a clean list.",
          "The trigger icon is one Plus that rotates 45&deg; into a close. Same glyph, same position, so the target never moves under the finger mid-transition.",
          "Open and close run at 550ms on the design-system easing. Under <code>prefers-reduced-motion</code> the global rule cuts the duration and the panel simply appears.",
          "Closed panels are unmounted, not hidden. Anything inside is out of the DOM until opened, which matters for the point below.",
        ]}
        content={[
          "Write the trigger as the question the visitor actually asks, in their words: <em>How much does installation cost?</em>, not <em>Pricing information</em>. A label is not a question and cannot be answered.",
          "Front-load the distinguishing word. People read the first two or three words of each row and stop, so <em>Cost</em>, <em>Timing</em> and <em>Coverage</em> should land early rather than after a shared preamble.",
          "Open the answer with the answer. Context afterwards, if at all, the panel is already a reward for a click, do not spend it on a run-up.",
          "Keep each answer to a short paragraph. If one needs three, it deserves a page of its own and a link from here.",
        ]}
        accessibility={[
          "Radix supplies the roles, <code>aria-expanded</code>, <code>aria-controls</code> and arrow-key movement between triggers. Do not re-implement any of it.",
          "The trigger is a real <code>&lt;button&gt;</code> inside a heading element. Check that the heading level Radix emits fits the surrounding document outline, an accordion under an <code>h2</code> should not produce another <code>h2</code>.",
          "The Plus is decorative. Open and closed state is announced through <code>aria-expanded</code>, never through the icon alone.",
          "Because closed panels are unmounted, search engines and in-page browser search will not find that copy. Where the answers matter for SEO, the landing FAQ, for one, pair the accordion with <code>FAQPage</code> structured data so the content is machine-readable regardless of which panel is open.",
        ]}
      />
    </>
  );
}
