import { whatsappLink } from "@/lib/site-config";
import { CtaButton, WhatsAppButton } from "./cta-button";

export function FinalCta() {
  return (
    <section className="bg-primary py-16 text-primary-foreground sm:py-20">
      <div className="container max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to get connected?</h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-primary-foreground/80">
          Join 2,400+ UK homes and businesses already online with professionally installed Starlink. Get your free quote
          today.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaButton
            ctaId="final_quote"
            ctaLabel="Get my free quote"
            ctaLocation="final_cta"
            href="#quote"
            size="xl"
            variant="secondary"
          >
            Get my free quote
          </CtaButton>
          <WhatsAppButton href={whatsappLink()} ctaLocation="final_cta" size="xl">
            WhatsApp us now
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}
