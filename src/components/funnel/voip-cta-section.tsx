import { VoipLeadForm } from "./voip-lead-form";

/**
 * Closing form for the digital landline page. A copy of
 * hikvision-cta-section.tsx (the live Hikvision page): the form straight on
 * a dark full-width photo, without the Hikvision trade mark line.
 *
 * Photograph: Gus's Gemini render, 3 November (prompt 5): a stone cottage at
 * dusk in the Dales, a Starlink panel on the roof, one window lit. Phones get
 * a 3:4 crop of the right edge, where the cottage is.
 */
export function VoipCtaSection({ formName }: { formName: string }) {
  return (
    <section id="quote" className="scroll-mt-24 bg-background">
      <div className="relative w-full overflow-hidden bg-[#0e1013] py-20 text-center text-white md:py-28">
        <picture>
          <source media="(max-width: 767px)" srcSet="/funnel/voip-cta-phone-640.webp 640w, /funnel/voip-cta-phone-828.webp 828w" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/funnel/voip-cta-2000.webp"
            srcSet="/funnel/voip-cta-1280.webp 1280w, /funnel/voip-cta-2000.webp 2000w"
            sizes="100vw"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-bottom"
          />
        </picture>
        {/* The fields are lighter than the sky, so the band darkens towards
            the form; the lit window still shows through at the right. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block"
          style={{ background: "linear-gradient(to bottom, rgba(14,16,19,0.55), rgba(14,16,19,0.7) 50%, rgba(14,16,19,0.82))" }}
        />
        {/* Phones: darker, because the lit window lands behind the managed
            link under the form. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 md:hidden"
          style={{ background: "linear-gradient(to bottom, rgba(14,16,19,0.6), rgba(14,16,19,0.8) 45%, rgba(14,16,19,0.9))" }}
        />
        <div className="container relative mx-auto">
          <h2 className="mb-4 h2-section text-white">Keep your number. Get your price today.</h2>
          <p className="mx-auto mb-8 max-w-2xl text-body text-white/80 md:mb-10 md:text-lg">
            The phone set up for you, and your number moved. No need to cancel anything yet.
          </p>
          <div className="mx-auto w-full md:max-w-2xl">
            <VoipLeadForm formName={formName} position="final_cta" />
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
