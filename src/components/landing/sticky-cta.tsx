"use client";

import * as React from "react";
import { MessageCircle, ArrowRight } from "lucide-react";
import { whatsappLink } from "@/lib/site-config";
import { track, EVENTS } from "@/lib/analytics";

/**
 * Mobile-only sticky bar. Appears after the hero scrolls out of view so the
 * primary quote CTA always outranks navigation — directly addressing the audit
 * finding that the hamburger menu was out-clicking the quote CTA on mobile.
 */
export function StickyMobileCta() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-3 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="flex gap-2">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track(EVENTS.WHATSAPP_CLICKED, { channel: "whatsapp", cta_location: "sticky" })}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#25D366] text-white"
          aria-label="WhatsApp us"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
        <a
          href="#quote"
          onClick={() => track(EVENTS.CTA_CLICKED, { cta_id: "sticky_quote", cta_label: "Get a free quote", cta_location: "sticky" })}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary font-bold text-primary-foreground"
        >
          Get a free quote <ArrowRight className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
