import { ManagedLeadForm } from "./managed-lead-form";

/**
 * Closing form for the managed service page. A copy of voip-cta-section.tsx.
 *
 * No photograph yet: Gus is generating it (managed-research/
 * prompts-imagenes.md, prompt 5, a dairy farm at sunset with the dish on the
 * barn). Until then the band is the dark surface.
 */
export function ManagedCtaSection({ formName }: { formName: string }) {
  return (
    <section id="quote" className="scroll-mt-24 bg-background">
      <div className="relative w-full overflow-hidden bg-[#0e1013] py-20 text-center text-white md:py-28">
        <div className="container relative mx-auto">
          <h2 className="mb-4 h2-section text-white">Tell us what you run. We&apos;ll check first.</h2>
          <p className="mx-auto mb-8 max-w-2xl text-body text-white/80 md:mb-10 md:text-lg">
            We&apos;ll tell you what you need, and what you don&apos;t.
          </p>
          <div className="mx-auto w-full md:max-w-2xl">
            <ManagedLeadForm formName={formName} position="final_cta" />
          </div>
        </div>
      </div>

      <div className="container mx-auto py-10 md:py-12">
        <p className="mx-auto max-w-4xl text-center text-body leading-relaxed text-muted-foreground">
          © 2024 Install Pros® is a registered trade mark of Install Pros Group Ltd (UK). registered in the United
          Kingdom. Company No. 14896859. VAT No. GB456635174. Registered office: 4 Imperial Square, Cheltenham,
          GL50 1QB Tel: 020 3397 7003 | Email: admin@installpros.co.uk | All rights reserved
        </p>
        <p className="mx-auto mt-3 max-w-4xl text-center text-body-sm leading-relaxed text-muted-foreground">
          We are independent installers of Starlink™ and Amazon LEO™ &amp; have no affiliation to Starlink™,
          SpaceX™ or Amazon™
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/funnel/payment-methods.svg" alt="Accepted payment methods" className="mx-auto mt-6 h-5" />
      </div>
    </section>
  );
}
