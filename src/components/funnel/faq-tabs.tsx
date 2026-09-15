"use client";

import { useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Faq } from "@/lib/funnel/faqs";

/**
 * Tabbed FAQ list for the /faqs hub. Groups FAQs by either their `category`
 * (landing section) or `service` (install type). Only one group shows at a
 * time, keeping the page short. Tabs with no FAQs yet render a friendly
 * "coming soon" state.
 *
 * The rows are the landing accordion, not the generic system one: thin rules
 * top and bottom, a 30px circular outline holding a + that rotates into an ×
 * on open. That markup is duplicated from faq-section-alt.tsx on purpose. The
 * alternative was to extract a shared row component, which would touch the FAQ
 * block on every landing page; this file is the only place FaqTabs is used, so
 * the duplication is cheaper than that risk. If you restyle one, restyle both.
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
                "rounded-full border px-4 py-2 text-body font-semibold transition-colors",
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
          <AccordionPrimitive.Root
            type="single"
            collapsible
            className="w-full border-t border-border"
            /* Remount on tab change so an item left open on one tab does not
               leave its index open on the next. */
            key={active}
          >
            {visible.map((f, i) => (
              <AccordionPrimitive.Item key={`${active}-${i}`} value={`${active}-${i}`} className="border-b border-border">
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="group flex flex-1 items-center justify-between gap-6 py-6 text-left text-lead font-medium text-foreground transition-colors duration-quick hover:text-brand-hover">
                    {f.q}
                    <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-panel ease-ds group-data-[state=open]:rotate-45">
                      <Plus className="h-4 w-4" />
                    </span>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content className="overflow-hidden text-body leading-relaxed text-muted-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <div className="max-w-2xl pb-7 pr-10">{f.a}</div>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            ))}
          </AccordionPrimitive.Root>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-10 text-center">
            <p className="font-semibold text-foreground">FAQs coming soon</p>
            <p className="mx-auto mt-1 max-w-md text-body text-muted-foreground">
              We&apos;re adding {active} questions shortly. In the meantime, check availability or get in touch and
              we&apos;ll answer anything.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
