"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Trustpilot?: { loadFromElement: (el: HTMLElement, forceReload?: boolean) => void };
  }
}

/**
 * Trustpilot reviews via the official free TrustBox "Grid" widget, sitting
 * directly under the Google reviews (no separate heading — the widget carries
 * its own "Excellent · 4.8 · N reviews" header). Auto-updating, free.
 */
export function TrustpilotSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.Trustpilot && ref.current) window.Trustpilot.loadFromElement(ref.current, true);
  }, []);

  return (
    <section id="trustpilot" className="w-full bg-background pb-16 md:pb-24">
      <Script
        src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="afterInteractive"
      />
      <div className="container mx-auto max-w-6xl">
        {/* TrustBox widget — Grid */}
        <div
          ref={ref}
          className="trustpilot-widget"
          data-locale="en-GB"
          data-template-id="539adbd6dec7e10e686debee"
          data-businessunit-id="68a59af06ad677c356e7b938"
          data-style-height="500px"
          data-style-width="100%"
          data-token="fe78cba8-3c85-4899-bc7d-14337819acab"
          data-stars="5"
          data-review-languages="en"
        >
          <a href="https://uk.trustpilot.com/review/installpros.co.uk" target="_blank" rel="noopener noreferrer">
            Trustpilot
          </a>
        </div>
      </div>
    </section>
  );
}
