"use client";

import { useState } from "react";
import { Calendar } from "@/components/system/calendar";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

const inDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d; };

export default function CalendarPage() {
  const [a, setA] = useState<Date | null>(null);
  const [b, setB] = useState<Date | null>(inDays(4));

  return (
    <>
      <PageHeader
        title="Calendar"
        lead="Month grid for choosing an install date. Weeks start Monday, this is a UK product, and a Sunday-first calendar reads wrong here."
      />

      <Section title="Default">
        <Preview>
          <Calendar value={a} onChange={setA} />
        </Preview>
        <Code>{`<Calendar value={date} onChange={setDate} />`}</Code>
      </Section>

      <Section title="With availability" note="Past dates and fully-booked days blocked.">
        <Preview>
          <Calendar
            value={b}
            onChange={setB}
            minDate={new Date()}
            maxDate={inDays(60)}
            disabledDates={[inDays(2), inDays(3), inDays(9), inDays(10)]}
          />
        </Preview>
        <Code>{`<Calendar
  value={date}
  onChange={setDate}
  minDate={new Date()}
  maxDate={inDays(60)}
  disabledDates={fullyBooked}
/>`}</Code>
      </Section>

      <BestPractices
        when={[
          "Use for picking an install slot, where seeing the shape of the month matters, which week is free, whether a Saturday is available.",
          "For a date the user already knows exactly (a date of birth), a typed field is faster than navigating months.",
          "If only three or four slots are on offer, list them as Choiceboxes. A calendar to choose between Tuesday and Thursday is theatre.",
        ]}
        behavior={[
          "Weeks start Monday. <code>getDay()</code> is Sunday-based, so the offset is shifted deliberately, this is the bug to check first if the grid ever looks off by one.",
          "Dates are compared as local Y-M-D strings, never timestamps. A booking on the 3rd stays the 3rd whatever the timezone, which UTC comparison quietly breaks.",
          "Today carries a hairline ring so the month has an anchor even before anything is picked.",
          "Disabled days stay visible and greyed rather than disappearing. A gap in the grid reads as a rendering fault.",
          "Changing month does not clear the selection.",
        ]}
        accessibility={[
          "Each day is a real button with a full <code>aria-label</code> (&ldquo;3 August 2026&rdquo;), not a bare number, &ldquo;3&rdquo; alone tells a screen-reader user nothing.",
          "The month heading is <code>aria-live=\"polite\"</code>, so moving between months is announced.",
          "Disabled days are genuinely <code>disabled</code>, so they are skipped by the tab order rather than being focusable dead ends.",
          "Days are 40px tall. Below the 44px guideline, which is the compromise a seven-column grid forces on a 320px screen, worth revisiting if booking moves to mobile-first.",
        ]}
      />
    </>
  );
}
