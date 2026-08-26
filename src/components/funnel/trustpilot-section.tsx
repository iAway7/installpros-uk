"use client";

import { useEffect, useRef, useState } from "react";

const TRUSTPILOT_URL = "https://uk.trustpilot.com/review/installpros.co.uk";
const SCRIPT_SRC = "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";

/** Reserved height for the Slider TrustBox — must match data-style-height so
 *  the widget doesn't push the page down when it hydrates (CLS). */
const WIDGET_HEIGHT = 240;

/** Loads the TrustBox bootstrap once per page, reusing an in-flight load. */
function loadTrustpilotScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Trustpilot) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
  if (existing) {
    return new Promise((resolve) => existing.addEventListener("load", () => resolve(), { once: true }));
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => resolve(), { once: true }); // fail soft: the <a> fallback stays
    document.body.appendChild(script);
  });
}

/**
 * Trustpilot proof, sitting under the Google reviews.
 *
 * This is the official "Slider" TrustBox rather than our own cards. The reason
 * is data we cannot fake: Trustpilot renders the real review date and the real
 * "Verified" label per review, which is exactly what the hand-written card list
 * this replaced could never do honestly.
 *
 * There is deliberately NO rating header above the widget. The old one read
 * "Rated 4.8 / 5 from 303 reviews" from hardcoded values, so it went stale on
 * its own and quietly published a wrong number. If the aggregate is wanted back,
 * use the live Micro Star TrustBox (see `trustpilot-badge.tsx`) — never a
 * hand-typed score.
 *
 * Cost control: the third-party script is NOT loaded on page load. An
 * IntersectionObserver starts it only when the section is ~400px from the
 * viewport, so it never competes with the LCP image, and the container reserves
 * the widget's exact height so hydration causes no layout shift.
 */
export function TrustpilotSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Phase 1: only decide *when* to fetch the script.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true); // very old browser: just load it
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Phase 2: load + hydrate the TrustBox.
  useEffect(() => {
    if (!shouldLoad) return;
    let cancelled = false;
    loadTrustpilotScript().then(() => {
      if (cancelled || !widgetRef.current || !window.Trustpilot) return;
      window.Trustpilot.loadFromElement(widgetRef.current, true);
    });
    return () => {
      cancelled = true;
    };
  }, [shouldLoad]);

  return (
    <section ref={sectionRef} id="trustpilot" className="w-full bg-background pb-16 md:pb-24">
      <div className="container mx-auto max-w-6xl px-6">
        {/* Height reserved up front so the widget never shifts the layout. */}
        <div style={{ minHeight: WIDGET_HEIGHT }}>
          <div
            ref={widgetRef}
            className="trustpilot-widget"
            data-locale="en-GB"
            data-template-id="54ad5defc6454f065c28af8b"
            data-businessunit-id="68a59af06ad677c356e7b938"
            data-style-height={`${WIDGET_HEIGHT}px`}
            data-style-width="100%"
            data-token="664da81f-df30-40c0-ace4-f97eeb55b027"
            data-stars="4,5"
            data-review-languages="en"
            data-font-family="Barlow"
            data-text-color="#171717"
          >
            <a href={TRUSTPILOT_URL} target="_blank" rel="noopener noreferrer">
              Trustpilot
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
