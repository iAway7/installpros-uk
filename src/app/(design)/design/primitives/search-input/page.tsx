"use client";

import { useState } from "react";
import { SearchInput } from "@/components/system/search-input";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

const LEADS = ["Westminster · SW1A 1AA", "Cheltenham · GL50 1SX", "Inverness · IV1 1AA", "Cardiff · CF10 1AA"];

export default function SearchInputPage() {
  const [q, setQ] = useState("");
  const hits = LEADS.filter((l) => l.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader
        title="Search input"
        lead="Filters what is already on screen. It does not navigate — if pressing Enter takes you somewhere, that is a form, not this."
      />

      <Section title="Default" note="Type to filter. Escape clears.">
        <Preview className="!block">
          <div className="max-w-md">
            <SearchInput value={q} onValueChange={setQ} placeholder="Search leads" />
            <ul className="mt-4 space-y-1 text-[15px] text-muted-foreground">
              {hits.length ? hits.map((l) => <li key={l}>{l}</li>) : <li>No leads match &ldquo;{q}&rdquo;</li>}
            </ul>
          </div>
        </Preview>
        <Code>{`<SearchInput
  value={query}
  onValueChange={setQuery}
  placeholder="Search leads"
/>`}</Code>
      </Section>

      <BestPractices
        when={[
          "Filtering a list already on the page — the leads table, the FAQ hub.",
          "When the value must come from a known list and be selected, use <code>Combobox</code>. Search filters; a combobox picks.",
          "Below about ten items, skip it. A search box over a list you can already see is furniture.",
        ]}
        behavior={[
          "Escape clears the field. It is the shortcut people already expect, and the reason this exists rather than an Input with an icon glued on.",
          "Filter as you type, debounced if the source is a network call. Do not require Enter — this is a filter, not a submit.",
          "The clear button appears only when there is something to clear.",
          "The native WebKit clear affordance is suppressed, because it is not keyboard-reachable and looks different in every browser.",
        ]}
        content={[
          "The placeholder names the scope: <em>Search leads</em>, <em>Search FAQs</em>. A bare <em>Search</em> makes people guess what they are searching.",
          "The empty state repeats the query back — <em>No leads match &ldquo;marine&rdquo;</em> — so it is clear the typing registered.",
        ]}
        accessibility={[
          "<code>type=\"search\"</code> with <code>role=\"searchbox\"</code>. The placeholder doubles as the accessible name when there is no visible label, which is why the scope has to be in it.",
          "The clear button has an <code>aria-label</code> and is a real button, so it can be tabbed to.",
          "Result counts should live in a polite live region so filtering is audible, not just visible.",
        ]}
      />
    </>
  );
}
