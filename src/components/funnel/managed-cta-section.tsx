import { ManagedLeadForm } from "./managed-lead-form";

/**
 * Closing form for the managed service page. A copy of voip-cta-section.tsx.
 *
 * Photograph: Gus's render, 4 November (managed-research/prompts-imagenes.md,
 * prompt 5): a dairy farm on a grey evening, the dish on the old barn, like
 * one of the real buyers. Phones get a 3:4 crop of the right edge, where the
 * farm is.
 */
export function ManagedCtaSection({ formName }: { formName: string }) {
  return (
    <section id="quote" className="scroll-mt-24 bg-background">
      <div className="relative w-full overflow-hidden bg-[#0e1013] py-20 text-center text-white md:py-28">
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/funnel/managed-cta-phone-640.webp 640w, /funnel/managed-cta-phone-828.webp 828w"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/funnel/managed-cta-2000.webp"
            srcSet="/funnel/managed-cta-1280.webp 1280w, /funnel/managed-cta-2000.webp 2000w"
            sizes="100vw"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-bottom"
          />
        </picture>
        {/* The sky is light grey, so the band darkens towards the form; the
            lit shed still shows at the bottom right. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(14,16,19,0.72), rgba(14,16,19,0.78) 50%, rgba(14,16,19,0.6))",
          }}
        />
        <div data-reveal className="container relative mx-auto">
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
          Kingdom. Company No. 14896859. VAT No. GB456635174. Registered office: 4 Imperial Square, Cheltenham, GL50 1QB
          Tel: 020 3397 7003 | Email: admin@installpros.co.uk | All rights reserved
        </p>
        <p className="mx-auto mt-3 max-w-4xl text-center text-body-sm leading-relaxed text-muted-foreground">
          We are independent installers of Starlink™ and Amazon LEO™ &amp; have no affiliation to Starlink™, SpaceX™ or
          Amazon™
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/funnel/payment-methods.svg" alt="Accepted payment methods" className="mx-auto mt-6 h-5" />
      </div>
    </section>
  );
}
