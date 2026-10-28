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
      {/* Full width and almost black, with a photo of its own (Gus, 28
          October): a Gemini night render, a ColorVu under the soffit on the
          left with its warm light on and the rest near #0e1013, so the
          heading and form sit on black and need no overlay from md up. On
          phones a 3:4 crop from the left edge, darkened at the top where the
          heading lands on the brick. Was the hero's dusk photo, too light. */}
      <div className="relative w-full overflow-hidden bg-[#0e1013] py-20 text-center text-white md:py-28">
        <picture>
          <source media="(max-width: 767px)" srcSet="/funnel/hikvision-cta-phone-640.webp 640w, /funnel/hikvision-cta-phone-828.webp 828w" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/funnel/hikvision-cta-1920.webp"
            srcSet="/funnel/hikvision-cta-1280.webp 1280w, /funnel/hikvision-cta-1920.webp 1920w"
            sizes="100vw"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "0% 0%" }}
          />
        </picture>
        <div
          aria-hidden="true"
          className="absolute inset-0 md:hidden"
          style={{ background: "linear-gradient(to bottom, rgba(14,16,19,0.55), rgba(14,16,19,0.75) 45%, rgba(14,16,19,0.9))" }}
        />
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
