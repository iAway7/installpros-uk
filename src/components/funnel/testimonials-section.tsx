"use client";

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";

const TRUSTINDEX_WIDGET_ID = "46a004658dde06656c56ed086fe";

/** Reviews — injects the Trustindex review widget for InstallPros. */
export function TestimonialsSection() {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.innerHTML = "";
    const node = document.createElement("div");
    node.setAttribute("data-widget-id", TRUSTINDEX_WIDGET_ID);
    node.setAttribute("data-type", "trustindex");
    el.appendChild(node);
    const script = document.createElement("script");
    script.src = `https://cdn.trustindex.io/loader.js?${TRUSTINDEX_WIDGET_ID}`;
    script.async = true;
    el.appendChild(script);
    return () => {
      if (el) el.innerHTML = "";
    };
  }, []);

  return (
    <section className="bg-background py-12 md:py-20">
      <div className="container mx-auto max-w-[1280px]">
        <div className="mb-4 flex justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-6 w-6 fill-yellow-500 text-yellow-500" />
          ))}
        </div>
        <h2
          className="mb-12 text-center text-[2.5rem] font-bold text-foreground md:text-[3.25rem]"
          style={{ fontWeight: 600, lineHeight: "1.06em", letterSpacing: "-0.035em" }}
        >
          Top-Rated by Our Clients
        </h2>
        <div className="mx-auto">
          <div ref={carouselRef} className="trustindex-widget-container" />
        </div>
      </div>
    </section>
  );
}
