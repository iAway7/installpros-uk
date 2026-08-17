import { ServiceQuoteForm } from "./service-quote-form";

export function CtaSection({ addressMode = false }: { addressMode?: boolean } = {}) {
  return (
    <section id="quote" className="scroll-mt-24 bg-background py-12 md:py-20">
      <div className="container mx-auto" style={{ maxWidth: "1140px" }}>
        {/* 64px of padding only from md up: at 375px it would leave the postcode
            field about 250px wide, which is narrower than the placeholder it has
            to show. Mobile keeps the 32px it had. */}
        <div className="rounded-3xl bg-secondary px-8 py-16 text-center md:p-16">
          <h2
            className="mb-4 h2-section text-foreground"
          >
            Ready To Get Your Starlink Installed?
          </h2>
          <p className="mb-8 text-body text-foreground md:text-lg">
            Let&apos;s make your Starlink setup stress-free, fast, and fully optimised.
          </p>
          <div className="mx-auto max-w-xl">
            <ServiceQuoteForm addressMode={addressMode} />
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-4xl text-center text-body leading-relaxed text-muted-foreground">
          © {new Date().getFullYear()} Install Pros® is a registered trade mark of InstallPros Group Ltd (UK), registered in the United
          Kingdom. Company No. 14896859. VAT No. GB456635174. Registered office: Rotunda Buildings, Montpellier
          Exchange, Cheltenham, GL50 1SX. Tel: 020 3397 7003 | Email: admin@installpros.co.uk | All rights reserved
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/funnel/payment-methods.svg" alt="Accepted payment methods" className="mx-auto mt-6 h-5" />
      </div>
    </section>
  );
}
