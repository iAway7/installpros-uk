import { ConnectivityLeadForm } from "./connectivity-lead-form";

/**
 * Closing form for the 4G/5G and fibre page. A copy of voip-cta-section.tsx:
 * the form straight on a dark full-width band, with the company lines under
 * it.
 *
 * No photograph yet (prompt 5 in 4g-5g-fibre-research/prompts-imagenes.md:
 * a farm business unit at blue hour), so the band is the page's dark with
 * the hero's radial light. Swap in a <picture> like voip-cta-section's when
 * the render arrives.
 */
export function ConnectivityCtaSection({ formName }: { formName: string }) {
  return (
    <section id="quote" className="scroll-mt-24 bg-background">
      <div className="relative w-full overflow-hidden bg-[#0e1013] py-20 text-center text-white md:py-28">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "radial-gradient(120% 70% at 50% 0%, #22262c 0%, #0e1013 48%, #050607 100%)" }}
        />
        <div className="container relative mx-auto">
          <h2 data-reveal className="mb-4 text-balance h2-section text-white">Tell us what you have. We&apos;ll check what works.</h2>
          <p data-reveal style={{ transitionDelay: "80ms" }} className="mx-auto mb-8 max-w-2xl text-body text-white/80 md:mb-10 md:text-lg">
            Starlink, 4G/5G or both, priced the same day.
          </p>
          <div className="mx-auto w-full md:max-w-2xl">
            <ConnectivityLeadForm formName={formName} position="final_cta" />
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
