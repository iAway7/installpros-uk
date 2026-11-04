"use client";

import { useState } from "react";
import { Tabs } from "@/components/system/tabs";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

const TABS = [
  { title: "Overview", value: "overview" },
  { title: "Leads", value: "leads", badge: 12 },
  { title: "Settings", value: "settings" },
];

export default function TabsPage() {
  const [a, setA] = useState("overview");
  const [b, setB] = useState("overview");

  return (
    <>
      <PageHeader
        title="Tabs"
        lead="Switches between sibling views inside one page. Tabs imply the views share a scope, a URL parent and a data model, for unrelated pages this is the wrong control."
      />

      <Section title="Primary" note="Underline. The default for a page's main sections.">
        <Preview className="!block">
          <Tabs tabs={TABS} selected={a} onSelect={setA} label="Sections" />
        </Preview>
        <Code>{`<Tabs
  tabs={[
    { title: "Overview", value: "overview" },
    { title: "Leads", value: "leads", badge: 12 },
    { title: "Settings", value: "settings" },
  ]}
  selected={tab}
  onSelect={setTab}
  label="Sections"
/>`}</Code>
      </Section>

      <Section title="Secondary" note="Filled pill. For a nested switch inside a panel.">
        <Preview className="!block">
          <Tabs variant="secondary" tabs={TABS} selected={b} onSelect={setB} label="Views" />
        </Preview>
      </Section>

      <Section title="Disabled tab" note="Always name the constraint.">
        <Preview className="!block">
          <Tabs
            label="Sections"
            selected={a}
            onSelect={setA}
            tabs={[
              { title: "Overview", value: "overview" },
              { title: "Leads", value: "leads" },
              { title: "Billing", value: "billing", disabled: true, tooltip: "Only visible to account owners." },
            ]}
          />
        </Preview>
      </Section>

      <BestPractices
        when={[
          "Sibling views of the same thing: <em>Overview</em>, <em>Leads</em>, <em>Settings</em> inside the dashboard.",
          "For navigation between unrelated pages, use a sub-menu. Tabs promise the views share a URL parent and a data model.",
          "Cap at 5–7 on desktop and 3–4 on mobile. Past that, consolidate or move the secondary views behind a <code>Menu</code>.",
        ]}
        behavior={[
          "Switching is instant. No network confirmation, no toast, a tab change that needs acknowledging was a navigation.",
          "Reflect the active tab in the URL as a query param, so a refresh or a shared link lands on the right view.",
          "Disable a tab only for permission or empty-state reasons, and always pair it with a tooltip naming why.",
          "The row scrolls horizontally rather than wrapping. Wrapped tabs read as two rows of unrelated things.",
        ]}
        content={[
          "Titles are Title Case, 1–2 words, and name the destination noun: <em>Overview</em>, <em>Logs</em>. Verbs belong on buttons, <em>View Logs</em> is wrong on a tab.",
          "Do not append counts to the title. Use the <code>badge</code> slot, and drop it entirely at zero rather than showing a 0.",
          "The tooltip explains the constraint, not the tab: <em>Only visible to account owners.</em>",
        ]}
        accessibility={[
          "Left and Right arrows move between tabs and skip disabled ones; only the active tab is in the tab order, which is the standard roving-tabindex pattern.",
          "<code>label</code> becomes <code>aria-label</code> on the tablist. Required whenever no visible heading sits above the row.",
          "The focus ring stays visible on the active tab. Suppressing it for polish makes the component unusable by keyboard.",
        ]}
      />
    </>
  );
}
