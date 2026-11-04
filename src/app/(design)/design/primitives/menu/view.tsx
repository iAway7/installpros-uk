"use client";

import { Menu } from "@/components/system/menu";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

const ITEMS = [
  { label: "View lead", onSelect: () => {} },
  { label: "Resolve address", onSelect: () => {} },
  { label: "Open in maps", href: "#" },
  { label: "Mark as lost", destructive: true, onSelect: () => {} },
];

export default function MenuPage() {
  return (
    <>
      <PageHeader
        title="Menu"
        lead="Dropdown opened by a button. Built for the dashboard, row actions on the leads table are the reason it exists."
      />

      <Section title="Default">
        <Preview>
          <Menu label="Actions" items={ITEMS} />
        </Preview>
        <Code>{`<Menu
  label="Actions"
  items={[
    { label: "View lead", onSelect: openLead },
    { label: "Open in maps", href: mapsUrl },
    { label: "Mark as lost", destructive: true, onSelect: markLost },
  ]}
/>`}</Code>
      </Section>

      <Section title="With chevron and right-aligned" note="Right-align when it sits at the end of a row.">
        <Preview className="!justify-end">
          <Menu label="Actions" items={ITEMS} chevron align="end" />
        </Preview>
      </Section>

      <Section title="Disabled item">
        <Preview>
          <Menu
            label="Actions"
            chevron
            items={[
              { label: "View lead", onSelect: () => {} },
              { label: "Resolve address", disabled: true },
              { label: "Mark as lost", destructive: true, onSelect: () => {} },
            ]}
          />
        </Preview>
      </Section>

      <BestPractices
        when={[
          "Row actions in a table, or a set of related commands that would crowd the layout as buttons.",
          "Two actions or fewer: show them as buttons. A menu that hides two items costs a click and saves nothing.",
          "For choosing a value rather than running a command, use <code>Combobox</code> or a select. A menu performs; a select picks.",
        ]}
        behavior={[
          "↑/↓ move, Enter picks, Escape closes and returns focus to the trigger, Tab closes without acting.",
          "Focus moves into the list rather than being tracked with <code>aria-activedescendant</code>, there is no text input to keep focus in, so the simpler model is also the correct one.",
          "Destructive items render in <code>--error</code> and go last, separated from what came before by position. Never make one the first item.",
          "Selecting closes the menu. It never stays open for a second action, that is a toolbar, not a menu.",
        ]}
        content={[
          "Items are verb-first: <em>View lead</em>, <em>Resolve address</em>, <em>Mark as lost</em>. Not nouns, not sentences.",
          "The trigger names the category, not an action: <em>Actions</em>, <em>Export</em>. If the trigger is itself a verb, it should probably be a button.",
          "A disabled item needs its reason nearby. Greyed with no explanation reads as broken.",
        ]}
        accessibility={[
          "The trigger carries <code>aria-haspopup=\"menu\"</code>, <code>aria-expanded</code> and <code>aria-controls</code>; the list is <code>role=\"menu\"</code> with <code>role=\"menuitem\"</code> children.",
          "Escape returns focus to the trigger. Leaving focus stranded on a closed menu is the most common keyboard bug in this pattern.",
          "Items that navigate render as <code>&lt;a&gt;</code>, items that act render as <code>&lt;button&gt;</code>. Middle-click and open-in-new-tab keep working.",
        ]}
      />
    </>
  );
}
