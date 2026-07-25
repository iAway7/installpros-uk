import { ServiceQuoteForm } from "./service-quote-form";

export function CtaSection({ addressMode = false }: { addressMode?: boolean } = {}) {
  return (
    <section id="quote" className="scroll-mt-24 bg-background py-12 md:py-20">
      <div className="container mx-auto" style={{ maxWidth: "1140px" }}>
        <div className="rounded-[32px] bg-secondary px-8 py-16 text-center">
          <h2
            className="mb-4 text-[2.5rem] font-bold text-foreground md:text-[3.25rem]"
            style={{ fontWeight: 600, lineHeight: "1.06em", letterSpacing: "-0.035em" }}
          >
            Ready To Get Your Starlink Installed?
          </h2>
          <p className="mb-8 text-base text-foreground md:text-lg">
            Let&apos;s make your Starlink setup stress-free, fast, and fully optimized.
          </p>
          <div className="mx-auto max-w-xl">
            <ServiceQuoteForm addressMode={addressMode} />
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-4xl text-center text-base leading-relaxed text-muted-foreground">
          © 2024 Install Pros® is a registered trade mark of InstallPros Group Ltd (UK), registered in the United
          Kingdom. Company No. 14896859. VAT No. GB456635174. Registered office: Rotunda Buildings, Montpellier
          Exchange, Cheltenham, GL50 1SX. Tel: 020 3397 7003 | Email: admin@installpros.co.uk | All rights reserved
        </p>
      </div>
    </section>
  );
}
