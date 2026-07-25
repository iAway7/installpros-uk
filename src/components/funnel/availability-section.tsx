"use client";

import { useState, useEffect, useRef } from "react";
import { ukRegions, UK_MAP_VIEWBOX } from "@/lib/funnel/uk-regions";
import { ServiceQuoteForm } from "./service-quote-form";

/** Split a region name into 1–2 balanced lines for the on-map label. */
function labelLines(name: string): string[] {
  const words = name.split(" ");
  if (words.length === 1 || name.length <= 10) return [name];
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(" ").length - words.slice(i).join(" ").length);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

/** Count-up number that animates when scrolled into view (comma-formatted). */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;
        const duration = 2000;
        const start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1);
          const eased = p * (2 - p);
          setCount(Math.floor(eased * target));
          if (p < 1) requestAnimationFrame(tick);
          else setCount(target);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="mb-2 text-4xl font-bold">
      {count.toLocaleString("en-GB")}
      {suffix}
    </div>
  );
}

export function AvailabilitySection() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="coverage" className="w-full scroll-mt-28 bg-background py-12 md:py-20">
      <div className="container mx-auto max-w-7xl">
        <div className="animate-fade-in-up mb-12 text-center">
          <h2 className="mb-4 text-[2.5rem] font-bold text-foreground md:text-[3.25rem]" style={{ fontWeight: 600, lineHeight: "1.06em", letterSpacing: "-0.035em" }}>
            Nationwide Starlink Installation Coverage
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            Professional installation services available across the UK. Check if we service your area.
          </p>
        </div>

        <div className="animate-fade-in-up animate-delay-100 mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { node: <AnimatedCounter target={12} />, label: "Regions Covered", color: "text-foreground" },
            { node: <AnimatedCounter target={310} suffix="+" />, label: "Towns & Cities Served", color: "text-primary" },
            { node: <AnimatedCounter target={9163} suffix="+" />, label: "Installations Completed", color: "text-foreground" },
            { node: <AnimatedCounter target={99} suffix="%" />, label: "UK Coverage", color: "text-foreground" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-secondary p-6 text-center">
              <div className={s.color}>{s.node}</div>
              <div className="text-sm font-medium text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
          {/* Full quote funnel, inline — no scroll-jump to the bottom form. */}
          <div className="order-2 w-full max-w-xl">
            <ServiceQuoteForm />
          </div>

          {/* UK regions map (on top) */}
          <div className="order-1 w-full">
            <div className="relative mx-auto w-full max-w-2xl">
              <svg viewBox={UK_MAP_VIEWBOX} className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
                {/* Region shapes */}
                <g>
                  {Object.entries(ukRegions).map(([id, r]) => (
                    <path
                      key={id}
                      d={r.dimensions}
                      fill={hovered === id ? "#86efac" : "#bbf7d0"}
                      stroke="#ffffff"
                      strokeWidth="1.4"
                      className="transition-colors duration-200"
                      onMouseEnter={() => setHovered(id)}
                      onMouseLeave={() => setHovered(null)}
                    />
                  ))}
                </g>
                {/* Region labels (rendered on top) */}
                <g style={{ pointerEvents: "none" }}>
                  {Object.entries(ukRegions).map(([id, r]) => {
                    const lines = labelLines(r.name);
                    return (
                      <text
                        key={id}
                        x={r.labelX}
                        y={r.labelY}
                        textAnchor="middle"
                        fontSize={14}
                        fontWeight={700}
                        fill="#14532d"
                        style={{ paintOrder: "stroke", stroke: "#ffffff", strokeWidth: 3, strokeLinejoin: "round" }}
                      >
                        {lines.map((ln, i) => (
                          <tspan key={i} x={r.labelX} dy={i === 0 ? (lines.length > 1 ? "-0.25em" : "0.32em") : "1.1em"}>
                            {ln}
                          </tspan>
                        ))}
                      </text>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
