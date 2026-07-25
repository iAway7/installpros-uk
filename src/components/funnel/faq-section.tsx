import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/funnel-accordion";
import { LANDING_FAQS } from "@/lib/funnel/faqs";

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 bg-background py-12 md:py-20">
      <div className="container mx-auto max-w-4xl">
        <h2
          className="mb-8 text-center text-[2.5rem] font-bold text-foreground md:text-[3.25rem]"
          style={{ fontWeight: 600, lineHeight: "1.06em", letterSpacing: "-0.035em" }}
        >
          FAQ&apos;s
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {LANDING_FAQS.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
