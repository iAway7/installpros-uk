import { LazyHikvisionQuoteForm } from "./hikvision-lazy";

/**
 * Closing form for the Hikvision landing. A copy of security-cta-section.tsx
 * (the live Ajax page), with its own heading and trade mark line.
 *
 * The heading answers the two things the chats say decide it: the price the
 * same day, and nothing to pay monthly (8 camera buyers asked). "No monthly
 * bill" holds only while nothing is recorded to a paid cloud plan (Jordan's
 * question 2).
 */
export function HikvisionCtaSection({ defaultService, formName }: { defaultService: string; formName: string }) {
  return (
    <section id="quote" className="scroll-mt-24 bg-background py-12 md:py-20">
      <div className="container mx-auto">
        <div className="rounded-3xl bg-secondary px-4 py-16 text-center min-[350px]:px-8 md:p-16">
          <h2 className="mb-4 h2-section text-foreground">Clear cameras, without the monthly bill.</h2>
          <p className="mb-8 text-body text-foreground md:text-lg">
            Tell us what you want to cover and you will have one upfront price for the cameras and the fitting the same day.
          </p>
          <div className="mx-auto max-w-xl">
            <LazyHikvisionQuoteForm defaultService={defaultService} skipServiceStep formName={formName} />
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-4xl text-center text-body leading-relaxed text-muted-foreground">
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
