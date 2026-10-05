import { Suspense } from "react";
import { DateFilter, SelectFilter } from "@/components/system/filters";
import { PageHeader, Section, Preview, Code, BestPractices, Rule, Mono } from "../../_components/docs";

export const metadata = { title: "Filters" };

export default function FiltersPage() {
  return (
    <>
      <PageHeader
        title="Filters"
        lead="URL-backed controls for a read-only view. Each one writes to the query string, so there is no Apply button and every filtered view is a link you can send."
      />

      <Section title="A filter row" note="Targets: a date window and a traffic source. Try them — this page's URL changes.">
        <Preview>
          {/* useSearchParams needs a Suspense boundary, or the static build of this page fails. */}
          <Suspense>
            <div className="theme-product flex flex-wrap items-end gap-3">
              <DateFilter name="from" value="" label="From" placeholder="Launch day" clearable />
              <DateFilter name="to" value="" label="To" placeholder="Today" clearable />
              <SelectFilter
                name="source"
                value=""
                label="Traffic source"
                options={[
                  ["", "All sources"],
                  ["paid", "Google Ads"],
                  ["organic", "Organic search"],
                  ["direct", "Direct"],
                ]}
              />
            </div>
          </Suspense>
        </Preview>
        <Code>{`<DateFilter name="from" value={filters.from} label="From" clearable />
<SelectFilter
  name="source"
  value={filters.source}
  label="Traffic source"
  options={[["", "All sources"], ["paid", "Google Ads"], ["organic", "Organic search"]]}
/>`}</Code>
        <Rule>
          Both are the small field — <Mono>h-control-sm</Mono>, <Mono>rounded-md</Mono>, the 1.5px{" "}
          <Mono>border-field</Mono> — because they sit side by side. The date trigger used to be a 1px{" "}
          <Mono>border-border</Mono> box at <Mono>rounded-md</Mono> next to a Select at{" "}
          <Mono>rounded-lg</Mono>. The calendar opens in <Mono>Popover</Mono>, also in{" "}
          <Mono>system/</Mono> now: shadcn&apos;s, pasted and put on the tokens.
        </Rule>
      </Section>

      <BestPractices
        when={[
          "Read-only views that a teammate might want to share filtered: Targets, Funnel, Landings.",
          "Not inside a form. A form collects values and submits once; these push to the URL on every change.",
        ]}
        behavior={[
          "Changing a filter re-renders the server page; the control disables itself while that is in flight.",
          "&ldquo;All&rdquo; options write nothing to the URL. Radix Select forbids an empty value, so they use a sentinel internally.",
          "The date picker caps at today unless a max is given, and closes on pick.",
        ]}
        content={[
          "Label every filter, above the control, naming the dimension: &ldquo;Traffic source&rdquo;, not &ldquo;Filter&rdquo;.",
          "The empty state of a date says what it means: &ldquo;Launch day&rdquo;, &ldquo;Today&rdquo;, not &ldquo;Select date&rdquo;.",
        ]}
        accessibility={[
          "Each trigger carries its label as <code>aria-label</code>; the clear button says what it clears.",
          "Keyboard: Select is Radix&apos;s, the calendar is the system Calendar inside a Radix Popover with focus management.",
        ]}
      />
    </>
  );
}
