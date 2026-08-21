"use client";

import { useState } from "react";
import { Combobox } from "@/components/system/combobox";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

const SERVICES = [
  { value: "starlink", label: "Starlink installation", description: "Dish, router and mounting" },
  { value: "mesh", label: "Mesh Wi-Fi", description: "Whole-property coverage" },
  { value: "marine", label: "Marine install", description: "Boats and pontoons" },
  { value: "commercial", label: "Commercial", description: "Offices, farms and sites" },
  { value: "survey", label: "Site survey", description: "Obstruction scan before booking" },
];

export default function ComboboxPage() {
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>("mesh");

  return (
    <>
      <PageHeader
        title="Combobox"
        lead="Filters a long list down to what matches. The address autocomplete in the lead form is this pattern wired to Google Places, this is the same keyboard model with no data source baked in."
      />

      <Section title="Empty">
        <Preview className="!block">
          <div className="max-w-md"><Combobox options={SERVICES} value={a} onChange={setA} placeholder="Search services…" /></div>
        </Preview>
        <Code>{`<Combobox
  options={SERVICES}
  value={value}
  onChange={setValue}
  placeholder="Search services…"
/>`}</Code>
      </Section>

      <Section title="With a selection" note="Clearable once something is chosen.">
        <Preview className="!block">
          <div className="max-w-md"><Combobox options={SERVICES} value={b} onChange={setB} /></div>
        </Preview>
      </Section>

      <BestPractices
        when={[
          "Use past roughly ten options, or whenever the list is fetched rather than fixed.",
          "Below ten fixed options, a Select is less machinery and does not make people type.",
          "For two to six options that need explaining, use a Choicebox instead, no typing at all.",
        ]}
        behavior={[
          "↑ and ↓ move the active option, Enter picks it, Escape closes. Clicking outside closes without changing the value.",
          "Filtering matches the label and the description, so people can search by what a service does rather than its name.",
          "Selecting fills the field and closes the list. Focusing again clears the query so typing starts a fresh search instead of editing the selection.",
          "The list is capped at 18rem and scrolls. It never pushes the page around.",
        ]}
        content={[
          "The placeholder is an inline hint naming the scope: <code>Search services…</code>, <code>Start typing your address…</code>. Never a bare <code>Search…</code>, and never the label restated.",
          "Option text matches canonical naming, <em>Starlink</em>, <em>Wi-Fi 6</em>, and keeps one register across the list.",
          "The empty state names the query: <em>No services match &ldquo;marine&rdquo;</em> reads better than <em>No results</em> and tells the user their typing was received.",
        ]}
        accessibility={[
          "<code>role=\"combobox\"</code> with <code>aria-expanded</code> and <code>aria-controls</code> on the input, <code>role=\"listbox\"</code> on the list.",
          "The active option is reported with <code>aria-activedescendant</code> rather than by moving focus, so focus stays in the input and typing never breaks.",
          "Options are chosen on <code>mousedown</code> with the default prevented, on <code>click</code> the input blurs first and the list closes before the selection lands.",
          "The empty state is a real message, not an empty box: an invisible dropdown reads as a broken control.",
        ]}
      />
    </>
  );
}
