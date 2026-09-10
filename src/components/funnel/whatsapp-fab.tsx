"use client";

import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { track, EVENTS } from "@/lib/analytics";
import { WHATSAPP_URL } from "@/lib/funnel/contact";

/**
 * Floating WhatsApp button. Will asked for the WhatsApp CTA to be more
 * obvious on every landing page.
 *
 * The alternative was making the in-section WhatsApp button louder, in
 * WhatsApp green. That was tried and reverted: it puts a second saturated
 * fill next to the red primary and the row stops having a first choice.
 * Visibility here is bought with availability instead of with weight. Most
 * of the traffic is mobile, where the in-section buttons are on screen for
 * a couple of seconds each and then gone.
 *
 * Two rules, and both are IntersectionObservers rather than scroll
 * listeners, so nothing runs on the main thread while the page scrolls:
 *
 *  1. It appears only once the reader is past whatever sits above this
 *     component in the tree. That is what the zero-height sentinel is for:
 *     it stays in normal flow where the component is mounted, so mounting
 *     it directly after <HeroSection /> is the whole configuration. No
 *     magic viewport fraction, no querying for someone else's DOM node.
 *  2. It hides while the quote form is on screen. A floating button that
 *     sends people off-site while they are filling the form is competing
 *     with the thing the page is for.
 *
 * Deliberately not a library. react-floating-whatsapp and friends ship
 * 30-40kb to draw a circle; this is one <a>, one inline SVG and two
 * observers, which costs a few hundred bytes and no network request. It is
 * position:fixed, so it cannot move the layout and cannot register CLS.
 *
 * Icon only, in WhatsApp green with a white glyph. That is the brand
 * pairing and it also sidesteps the wordmark casing rules: there is no
 * wordmark here. The accessible name comes from aria-label, so it is
 * announced even though nothing is drawn as text.
 */
export function WhatsAppFab({ ctaLocation = "float" }: { ctaLocation?: string } = {}) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [pastSentinel, setPastSentinel] = useState(false);
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        // Not simply !isIntersecting: the sentinel is also off screen before
        // the reader gets to it, at the very top of the page. Scrolled past
        // means its top edge is above the viewport.
        setPastSentinel(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { rootMargin: "0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const form = document.getElementById("quote");
    if (!form) return;
    const io = new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting));
    io.observe(form);
    return () => io.disconnect();
  }, []);

  const visible = pastSentinel && !formInView;

  return (
    <>
      <div ref={sentinel} aria-hidden className="h-0" />
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onClick={() => track(EVENTS.WHATSAPP_CLICKED, { channel: "whatsapp", cta_location: ctaLocation })}
        // aria-hidden and tabIndex track `visible` together with opacity:
        // opacity alone leaves an invisible link that keyboard and screen
        // reader users still land on. pointer-events-none stops it eating
        // taps meant for whatever is underneath.
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        // motion-reduce drops the fade and the lift, not the button.
        className={`focus-ring-solid fixed bottom-5 right-5 z-40 flex h-control-lg w-control-lg items-center justify-center rounded-full bg-whatsapp text-white shadow-popover transition-all duration-card ease-ds motion-reduce:transition-none md:bottom-6 md:right-6 ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0 motion-reduce:translate-y-0"
        }`}
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </>
  );
}
