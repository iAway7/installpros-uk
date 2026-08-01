"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { LANDING_FAQS } from "@/lib/funnel/faqs";

/**
 * FAQ section styled like the /starlink-installations landing: red "FAQ"
 * eyebrow, "Questions, answered." heading, and an accordion whose toggle is a
 * circular outline that rotates the + into an × on open.
 */
export function FaqSectionAlt() {
  return (
    <section id="faq" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-4xl">
        <p className="text-center eyebrow">FAQ</p>
        <h2
          className="mb-12 mt-4 text-center h2-section text-foreground"
        >
          Questions, answered.
        </h2>

        <AccordionPrimitive.Root type="single" collapsible className="w-full border-t border-border">
          {LANDING_FAQS.map((f, i) => (
            <AccordionPrimitive.Item key={i} value={`faq-${i}`} className="border-b border-border">
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger className="group flex flex-1 items-center justify-between gap-6 py-6 text-left text-[18px] font-medium text-foreground transition-colors duration-200 hover:text-brand-hover">
                  {f.q}
                  <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-550 ease-ds group-data-[state=open]:rotate-45">
                    <Plus className="h-4 w-4" />
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="overflow-hidden text-[17px] leading-relaxed text-muted-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="max-w-2xl pb-7 pr-10">{f.a}</div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </section>
  );
}
