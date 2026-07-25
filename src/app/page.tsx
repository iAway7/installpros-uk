import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { TrustBar } from "@/components/landing/trust-bar";
import { Benefits } from "@/components/landing/benefits";
import { Process } from "@/components/landing/process";
import { CoverageMap } from "@/components/landing/coverage-map";
import { QuoteSection } from "@/components/landing/quote-section";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { StickyMobileCta } from "@/components/landing/sticky-cta";
import { QuoteProvider } from "@/components/landing/quote-context";

export default function HomePage() {
  return (
    <QuoteProvider>
      <Header />
      <main id="main">
        <Hero />
        <TrustBar />
        <Benefits />
        <Process />
        <CoverageMap />
        <QuoteSection />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyMobileCta />
    </QuoteProvider>
  );
}
