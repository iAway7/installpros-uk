import { SecurityQuoteForm } from "./security-quote-form";

/**
 * Closing form for the Ajax landing. A copy of cta-section.tsx, which renders
 * on /install-quote and is not changed for another page.
 *
 * Changed from the original: the heading and line under it (the old Ajax page
 * closed on "Ready To Get Your CCTV Installed?", the Starlink template's line
 * with one word swapped), the Starlink disclaimer, and both badges, which are a
 * Starlink accreditation and a digital TV one. "Peace of mind" is Will's own
 * sales language, and the monthly bill is his main selling point.
 *
 * Not an Ajax partner yet (Will, 13 October: "we can apply asap"), so the
 * trade mark line says only that Ajax is Ajax's. When the partnership comes
 * through, the badge goes where the Starlink one was.
 */
export function SecurityCtaSection({ defaultService, formName }: { defaultService: string; formName: string }) {
  return (
    <section id="quote" className="scroll-mt-24 bg-background py-12 md:py-20">
      <div className="container mx-auto">
        <div className="rounded-3xl bg-secondary px-4 py-16 text-center min-[350px]:px-8 md:p-16">
          <h2 className="mb-4 h2-section text-foreground">Peace of mind, without the monthly bill.</h2>
          <p className="mb-8 text-body text-foreground md:text-lg">
            Tell us about your home and you will have one upfront price for the kit and the fitting the same day.
          </p>
          <div className="mx-auto max-w-xl">
            <SecurityQuoteForm defaultService={defaultService} skipServiceStep formName={formName} />
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-4xl text-center text-body leading-relaxed text-muted-foreground">
          © 2024 Install Pros® is a registered trade mark of Install Pros Group Ltd (UK). registered in the United
          Kingdom. Company No. 14896859. VAT No. GB456635174. Registered office: 4 Imperial Square, Cheltenham,
          GL50 1QB Tel: 020 3397 7003 | Email: admin@installpros.co.uk | All rights reserved
        </p>
        <p className="mx-auto mt-3 max-w-4xl text-center text-body-sm leading-relaxed text-muted-foreground">
          Ajax™ is a trade mark of Ajax Systems. Install Pros is an independent installer.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/funnel/payment-methods.svg" alt="Accepted payment methods" className="mx-auto mt-6 h-5" />
      </div>
    </section>
  );
}
