"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/system/funnel-accordion";
import { cn } from "@/lib/utils";
import type { Faq } from "@/lib/funnel/faqs";

/**
 * Tabbed FAQ list. Groups FAQs by either their `category` (landing section) or
 * `service` (the /faqs hub). Only one group shows at a time, keeping the page
 * short. Tabs with no FAQs yet render a friendly "coming soon" state.
 */
export function FaqTabs({
  faqs,
  tabs,
  groupBy,
}: {
  faqs: Faq[];
  tabs: readonly string[];
  groupBy: "category" | "service";
}) {
  const [active, setActive] = useState(tabs[0]);
  const visible = faqs.filter((f) => f[groupBy] === active);

  return (
    <div>
      {/* Tab pills */}
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="FAQ categories">
        {tabs.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary hover:text-primary",
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Accordion for the active tab */}
      <div className="mt-8">
        {visible.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {visible.map((f, i) => (
              <AccordionItem key={`${active}-${i}`} value={`${active}-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-10 text-center">
            <p className="font-semibold text-foreground">FAQs coming soon</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              We&apos;re adding {active} questions shortly. In the meantime, check availability or get in touch and
              we&apos;ll answer anything.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
