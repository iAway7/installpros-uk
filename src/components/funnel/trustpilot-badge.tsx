"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Trustpilot?: { loadFromElement: (el: HTMLElement, force?: boolean) => void };
  }
}

const SCRIPT_SRC = "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";

/**
 * Live Trustpilot "Micro Star" TrustBox. Loads the bootstrap loader once, then
 * renders the configured widget for installpros.co.uk. Falls back to a plain
 * Trustpilot link until the script hydrates the widget.
 */
export function TrustpilotBadge({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const render = () => {
      if (ref.current && window.Trustpilot) window.Trustpilot.loadFromElement(ref.current, true);
    };
    if (window.Trustpilot) {
      render();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", render);
      return () => existing.removeEventListener("load", render);
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", render);
    document.body.appendChild(script);
    return () => script.removeEventListener("load", render);
  }, []);

  return (
    <div
      ref={ref}
      className={`trustpilot-widget ${className}`}
      data-locale="en-GB"
      data-template-id="5419b732fbfb950b10de65e5"
      data-businessunit-id="68a59af06ad677c356e7b938"
      data-style-height="72px"
      data-style-width="100%"
      data-theme="dark"
      data-token="f4f0ba85-aa32-45de-ac64-b791ebd9cc5e"
    >
      <a href="https://uk.trustpilot.com/review/installpros.co.uk" target="_blank" rel="noopener noreferrer">
        Trustpilot
      </a>
    </div>
  );
}
