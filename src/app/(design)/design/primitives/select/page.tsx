"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/system/select";
import { PageHeader, Section, Preview, Code, BestPractices, Rule, Mono } from "../../_components/docs";

export default function SelectPage() {
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  return (
    <>
      <PageHeader
        title="Select"
        lead="Picks one value from a short list. The plain picker — for anything long enough to need searching, reach for Combobox instead."
      />

      <Section title="Default" note="Editorial density: 48px trigger, 16px text.">
        <Preview>
          <div className="theme-editorial w-full max-w-xs">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="new">New lead</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="installed">Installed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Preview>
        <Code>{`<Select value={status} onValueChange={setStatus}>
  <SelectTrigger><SelectValue /></SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All statuses</SelectItem>
  </SelectContent>
</Select>`}</Code>
      </Section>

      <Section title="Product density" note="Same component, 44px trigger, one rung tighter.">
        <Preview>
          <div className="theme-product w-full max-w-xs">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="score">Highest score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Preview>
        <Rule>
          Nothing is passed to make that happen. The trigger is <Mono>h-control</Mono>, which is 48px
          under <Mono>.theme-editorial</Mono> and 44px under <Mono>.theme-product</Mono>.
        </Rule>
      </Section>

      <Section title="Select or Combobox">
        <Rule>
          Select for a list you can read at a glance — two to about eight options. Combobox filters
          as you type, which earns its keep on a long list and gets in the way on four. Picking the
          wrong one is the most common mistake with both: a search box over four options is friction,
          and a plain picker over two hundred is a scroll.
        </Rule>
      </Section>

      <BestPractices
        when={[
          "One value out of a short, known list. For two or three options that are all worth seeing at once, radio buttons are faster than opening a menu.",
          "Not for a list the user has to search. That is Combobox.",
        ]}
        behavior={[
          "Always render a selected value. A picker showing nothing looks broken; give it a sensible default like 'All statuses'.",
          "The tick sits in reserved space, so the label does not shift sideways when the value changes.",
          "The menu shadow is shadow-popover, the layer for dropdowns with nothing behind them. It is the only thing separating the menu from the page.",
        ]}
        content={[
          "Options read as values, not instructions. 'Newest first', not 'Sort by newest first' — the trigger already says what it is.",
          "Keep labels short enough not to truncate at the trigger width.",
        ]}
        accessibility={[
          "The focus ring appears on keyboard focus only, matching every other control. Clicking does not draw it.",
          "A Select needs a Label or an aria-label. The current value is not a name — it changes.",
          "Arrow keys move, Enter picks, Escape closes, and typing a letter jumps. That comes from Radix; do not intercept those keys.",
        ]}
      />
    </>
  );
}
