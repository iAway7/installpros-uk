import { ConnectivityLeadForm } from "./connectivity-lead-form";

/**
 * Closing form for the 4G/5G and fibre page. A copy of voip-cta-section.tsx:
 * the form straight on a dark full-width photo, with the company lines under
 * it.
 *
 * Photograph: Gus's Gemini render, 9 November (prompt 5): a farm business
 * unit at blue hour, lit windows, a dish on the roof, an antenna and a camera
 * on the gable, a van in the yard. Phones get a 3:4 crop of the right edge,
 * where the unit and the van are.
 */
export function ConnectivityCtaSection({ formName }: { formName: string }) {
  return (
    <section id="quote" className="scroll-mt-24 bg-background">
      <div className="relative w-full overflow-hidden bg-[#0e1013] py-20 text-center text-white md:py-28">
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/funnel/connectivity-cta-phone-640.webp 640w, /funnel/connectivity-cta-phone-828.webp 828w"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/funnel/connectivity-cta-2000.webp"
            srcSet="/funnel/connectivity-cta-1280.webp 1280w, /funnel/connectivity-cta-2000.webp 2000w"
            sizes="100vw"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-right"
          />
        </picture>
        {/* The lit windows are bright, so the band darkens towards the form
            and stays lighter at the right, where the unit is. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block"
          style={{ background: "linear-gradient(to right, rgba(14,16,19,0.82), rgba(14,16,19,0.72) 55%, rgba(14,16,19,0.45))" }}
        />
        {/* Phones: darker, because the windows land behind the form. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 md:hidden"
          style={{ background: "linear-gradient(to bottom, rgba(14,16,19,0.65), rgba(14,16,19,0.82) 45%, rgba(14,16,19,0.9))" }}
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
