import { LazyHikvisionQuoteForm } from "./hikvision-lazy";

/**
 * Closing form for the Hikvision landing. A copy of security-cta-section.tsx
 * (the live Ajax page), with its own heading and trade mark line.
 *
 * The heading is its own, not the Ajax line rephrased (Gus, 28 October):
 * the brand and the same-day price, which the chats say decide it; the
 * subline adds nothing to pay monthly (8 camera buyers asked), true while
 * nothing records to a paid cloud plan. The form sits straight on the photo
 * in the hero's dark style; a white card here looked out of place.
 */
export function HikvisionCtaSection({ defaultService, formName }: { defaultService: string; formName: string }) {
  return (
    <section id="quote" className="scroll-mt-24 bg-background">
      {/* Full width and dark, with the hero's photo behind it (Gus, 28
          October: the plain dark band looked bare). The same files as the
          hero, so already cached, under the hero's overlay; the drive render
          was tried and read busier behind the heading. */}
      <div className="relative w-full overflow-hidden bg-[#0e1013] py-20 text-center text-white md:py-28">
        <picture>
          <source media="(max-width: 767px)" srcSet="/funnel/hikvision-hero-phone-640.webp 640w, /funnel/hikvision-hero-phone-828.webp 828w" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/funnel/hikvision-hero-1620.webp"
            srcSet="/funnel/hikvision-hero-1280.webp 1280w, /funnel/hikvision-hero-1620.webp 1620w"
            sizes="100vw"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "50% 40%" }}
          />
        </picture>
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(14,16,19,0.6), rgba(14,16,19,0.7), rgba(0,0,0,0.85))" }} />
        <div className="container relative mx-auto">
          <h2 className="mb-4 h2-section text-white">Hikvision cameras, priced the same day.</h2>
          <p className="mx-auto mb-8 max-w-2xl text-body text-white/80 md:mb-10 md:text-lg">
            One upfront price for the cameras and the fitting. Nothing to pay monthly.
          </p>
          <div className="mx-auto w-full md:max-w-2xl">
            <LazyHikvisionQuoteForm defaultService={defaultService} skipServiceStep formName={formName} />
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
          Hikvision is a trade mark of Hangzhou Hikvision Digital Technology Co., Ltd. Install Pros is an independent
          installer.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/funnel/payment-methods.svg" alt="Accepted payment methods" className="mx-auto mt-6 h-5" />
      </div>
    </section>
  );
}
