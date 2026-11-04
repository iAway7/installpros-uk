import { PopoverDemo, DatePopoverDemo } from "./demo";
import { PageHeader, Section, Preview, Code, BestPractices, Rule, Mono } from "../../_components/docs";

export const metadata = { title: "Popover" };

export default function PopoverPage() {
  return (
    <>
      <PageHeader
        title="Popover"
        lead="A small panel that opens next to the button that opened it, without leaving the page or dimming it. For a few related controls, or a calendar."
      />

      <Section title="With a few controls" note="Click the button. Escape or a click outside closes it.">
        <Preview>
          <PopoverDemo />
        </Preview>
        <Code>{`<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" size="sm">View options</Button>
  </PopoverTrigger>
  <PopoverContent className="w-72 p-4">...</PopoverContent>
</Popover>`}</Code>
      </Section>

      <Section title="Holding a calendar" note="How the date filter works. Picking a day closes it.">
        <Preview>
          <DatePopoverDemo />
        </Preview>
        <Code>{`<PopoverContent className="w-auto border-0 p-0">
  <Calendar value={date} onChange={pick} />
</PopoverContent>`}</Code>
        <Rule>
          The calendar brings its own border and padding, so the popover drops both
          (<Mono>border-0 p-0</Mono>). Otherwise there would be two borders, one inside the other.
        </Rule>
      </Section>

      <BestPractices
        when={[
          "A few controls that belong to one button: view options, a date, a short filter.",
          "Not for a message the user must deal with before carrying on. That is a Modal.",
          "Not for a list of actions. That is a Menu, which has its own keyboard behaviour.",
        ]}
        behavior={[
          "Opens 6px below the button, lined up with its left edge, and moves to stay on screen.",
          "Focus goes into the panel when it opens and back to the button when it closes.",
          "Escape or a click outside closes it. Nothing behind it is blocked.",
        ]}
        accessibility={[
          "The button that opens it says what it opens: &ldquo;View options&rdquo;, not &ldquo;More&rdquo;.",
          "Every control inside has its own label; the panel title is not enough on its own.",
        ]}
      />
    </>
  );
}
