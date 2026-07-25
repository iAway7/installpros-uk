"use client";

import { QuoteForm } from "./quote-form";
import { useQuote } from "./quote-context";

export function QuoteSection() {
  const { postcode, installType } = useQuote();

  return (
    <section id="quote" className="scroll-mt-20 py-16 sm:py-20">
      <div className="container grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="lg:sticky lg:top-24">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Get your free, fixed-price quote</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Tell us about your property and we&apos;ll send a transparent, all-in price — hardware, mounting and labour.
            No obligation, no hidden extras.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">✓</span> Response within one working day
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">✓</span> Fixed price agreed before we book
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">✓</span> Accredited, insured engineers
            </li>
          </ul>
        </div>

        <QuoteForm defaultInstallType={installType} defaultPostcode={postcode} />
      </div>
    </section>
  );
}
