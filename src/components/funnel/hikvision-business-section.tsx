"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Beer,
  Building2,
  Car,
  Cat,
  Cctv,
  FileText,
  Fish,
  LayoutGrid,
  Pill,
  Pizza,
  ReceiptPoundSterling,
  ShoppingBasket,
  Store,
  Tractor,
  UtensilsCrossed,
  Warehouse,
  WashingMachine,
} from "lucide-react";
import { track, EVENTS } from "@/lib/analytics";
import { LazyHikvisionQuoteForm } from "./hikvision-lazy";
import s from "./hikvision-business.module.css";

/**
 * For businesses, in the slot "Already have cameras?" had (Gus, 5 November:
 * "we also sell to businesses"). Dark, with a site plan of a pub (Gus picked
 * it over the light version the same day).
 *
 * Top: the kinds of business from the chats in two rows drifting in
 * opposite ways, after React Bits Pro bento-33 (rebuilt by hand, no Pro
 * licence). Middle: Gus's Gemini render of a pub from above with the roof
 * off (prompt 12 in hikvision-research/prompts-imagenes.md) and the
 * proposed cameras drawn over it in code, as the home planner does with its
 * aerial photo: the till, the front door, the lounge, the cellar, the stock
 * room, the beer garden and the car park. None points at the toilets: the
 * stock-room cone is kept short and aimed away from them. A scan line, a
 * grid and corner marks make it read as a survey tool; the plan steps
 * through the cameras on its own, and hovering or tapping one (on the plan
 * or in the list) holds it. Bottom: four points, two columns on phones.
 *
 * What it says comes from the chats and Jordan. 16 of 81 camera buyers were
 * businesses (pubs, shops, a market unit, takeaways, a restaurant, a
 * laundrette, a car wash, a cattery, an office, a pharmacy group, a depot, a
 * fishery, a farm, a kiosk; hikvision-research/superchat-cctv-insights.md),
 * against 57 homes, so the page stays about homes and this is its one
 * business section. They wanted cameras inside (till, stock, kitchen),
 * several sites on one app, the make and model on the quote and an invoice
 * to the company. Jordan, 5 November: homes and businesses, and commercial
 * sites get a survey, hence "We visit before we quote". "Invoiced to the
 * company" is assumed (Install Pros Group Ltd). No recognition claims.
 *
 * The button opens the form right here (dark), intent new, form_name
 * hikvision_business, so Will can tell these leads apart; the label in
 * Zapier and Superchat stays "Hikvision CCTV". Owners keep "Add to mine" in
 * the form's first step.
 */

const ICON = "h-5 w-5";

const POINTS: { icon: ReactNode; title: string; detail: string }[] = [
  { icon: <Cctv className={ICON} />, title: "Inside and out", detail: "The till, the stock room and the car park" },
  { icon: <LayoutGrid className={ICON} />, title: "Every site, one app", detail: "Two shops or three branches on one phone" },
  { icon: <FileText className={ICON} />, title: "Make and model on the quote", detail: "So whoever signs it off knows what it is" },
  { icon: <ReceiptPoundSterling className={ICON} />, title: "Invoiced to the company", detail: "In the business's name, one quote per site" },
];

type Kind = { icon: ReactNode; label: string };

const KINDS_1: Kind[] = [
  { icon: <Beer className="h-4 w-4" />, label: "Pubs" },
  { icon: <Store className="h-4 w-4" />, label: "Shops" },
  { icon: <UtensilsCrossed className="h-4 w-4" />, label: "Restaurants" },
  { icon: <Building2 className="h-4 w-4" />, label: "Offices" },
  { icon: <Pill className="h-4 w-4" />, label: "Pharmacies" },
  { icon: <Car className="h-4 w-4" />, label: "Car washes" },
  { icon: <Pizza className="h-4 w-4" />, label: "Takeaways" },
];
const KINDS_2: Kind[] = [
  { icon: <Warehouse className="h-4 w-4" />, label: "Depots" },
  { icon: <Tractor className="h-4 w-4" />, label: "Farms" },
  { icon: <WashingMachine className="h-4 w-4" />, label: "Laundrettes" },
  { icon: <ShoppingBasket className="h-4 w-4" />, label: "Market stalls" },
  { icon: <Cat className="h-4 w-4" />, label: "Catteries" },
  { icon: <Fish className="h-4 w-4" />, label: "Fisheries" },
  { icon: <Store className="h-4 w-4" />, label: "Kiosks" },
];

const PHOTO_W = 2000;
const PHOTO_H = 1342;

type Cam = {
  n: string;
  name: string;
  detail: string;
  /** Position on the 2000 x 1342 photo. */
  x: number;
  y: number;
  /** Direction the camera faces, degrees clockwise from east. */
  dir: number;
  /** Half the field of view, degrees. */
  half: number;
  /** How far the cone reaches, photo pixels. */
  reach: number;
};

const CAMS: Cam[] = [
  { n: "01", name: "Till", detail: "Every payment at the bar", x: 1222, y: 522, dir: 148, half: 26, reach: 330 },
  { n: "02", name: "Front door", detail: "Everyone who comes in", x: 1005, y: 972, dir: -90, half: 30, reach: 300 },
  { n: "03", name: "Lounge", detail: "The tables and the booths", x: 588, y: 528, dir: 52, half: 30, reach: 330 },
  { n: "04", name: "Cellar", detail: "Kegs and deliveries", x: 733, y: 270, dir: 118, half: 24, reach: 215 },
  { n: "05", name: "Stock room", detail: "Stock, out of hours too", x: 1465, y: 272, dir: 150, half: 26, reach: 190 },
  { n: "06", name: "Beer garden", detail: "In colour after dark", x: 545, y: 700, dir: 180, half: 32, reach: 290 },
  { n: "07", name: "Car park", detail: "Cars coming and going", x: 1518, y: 330, dir: 20, half: 32, reach: 300 },
];

const CORAL = "#ff6a5f";

function cone(c: Cam) {
  const a = (c.dir * Math.PI) / 180;
  const h = (c.half * Math.PI) / 180;
  const x1 = c.x + c.reach * Math.cos(a - h);
  const y1 = c.y + c.reach * Math.sin(a - h);
  const x2 = c.x + c.reach * Math.cos(a + h);
  const y2 = c.y + c.reach * Math.sin(a + h);
  return `M ${c.x} ${c.y} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${c.reach} ${c.reach} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
}

function SitePlan({ active, held, onPick }: { active: number | null; held: boolean; onPick: (i: number | null) => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black" style={{ aspectRatio: `${PHOTO_W} / ${PHOTO_H}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/funnel/hikvision-business-pub-2000.webp"
        srcSet="/funnel/hikvision-business-pub-1200.webp 1200w, /funnel/hikvision-business-pub-2000.webp 2000w"
        sizes="(min-width: 1024px) 720px, 100vw"
        alt="A pub seen from above with the roof off at night: the bar, the lounge, the kitchen, the cellar, the stock room, the beer garden and the car park."
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden="true" className={`absolute inset-0 ${s.grid}`} />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgb(0 0 0 / 0.55) 100%)" }}
      />

      <svg viewBox={`0 0 ${PHOTO_W} ${PHOTO_H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          {CAMS.map((c) => (
            <radialGradient key={c.n} id={`cone-${c.n}`} gradientUnits="userSpaceOnUse" cx={c.x} cy={c.y} r={c.reach}>
              <stop offset="0%" stopColor={CORAL} stopOpacity="0.85" />
              <stop offset="100%" stopColor={CORAL} stopOpacity="0.12" />
            </radialGradient>
          ))}
        </defs>
        {CAMS.map((c, i) => {
          // While the plan steps through on its own the others stay readable;
          // once someone points at a camera they fall back further.
          const opacity = active === null || active === i ? 1 : held ? 0.2 : 0.5;
          return (
            <g key={c.n} className="transition-opacity duration-500" style={{ opacity }}>
              <g className={s.sweep} style={{ transformOrigin: `${c.x}px ${c.y}px`, animationDelay: `${i * -1.1}s` }}>
                <path d={cone(c)} fill={`url(#cone-${c.n})`} stroke={CORAL} strokeOpacity="0.85" strokeWidth="4" />
              </g>
            </g>
          );
        })}
      </svg>

      {/* The cameras: a numbered dot each, a name beside it from sm up. */}
      {CAMS.map((c, i) => (
        <button
          key={c.n}
          type="button"
          onMouseEnter={() => onPick(i)}
          onMouseLeave={() => onPick(null)}
          onFocus={() => onPick(i)}
          onBlur={() => onPick(null)}
          onClick={() => onPick(i)}
          aria-label={`Camera ${c.n}, ${c.name}`}
          className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
          style={{ left: `${(c.x / PHOTO_W) * 100}%`, top: `${(c.y / PHOTO_H) * 100}%` }}
        >
          <span aria-hidden="true" className={`absolute inset-0 rounded-full bg-[#ff3b30] ${s.ping}`} style={{ animationDelay: `${i * 0.3}s` }} />
          <span
            className={`relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-white font-mono text-[9px] font-bold leading-none text-white shadow-[0_0_12px_rgba(255,59,48,0.8)] transition-transform duration-300 sm:h-6 sm:w-6 sm:text-[10px] ${
              active === i ? "scale-125 bg-[#ff3b30]" : "bg-[#d71820]"
            }`}
          >
            {c.n.replace(/^0/, "")}
          </span>
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute left-full top-1/2 ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded border border-white/15 bg-black/70 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-opacity duration-300 sm:block ${
              active === null || active === i ? "opacity-100" : "opacity-50"
            }`}
          >
            {c.name}
          </span>
        </button>
      ))}

      {/* The survey look: a scan line, corner marks and two read-outs. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[9%]">
        <div className={`h-full w-full ${s.scan}`} style={{ background: `linear-gradient(to bottom, transparent, rgba(255,106,95,0.12) 85%, rgba(255,106,95,0.7))`, height: "100%" }} />
      </div>
      {["left-3 top-3 border-l-2 border-t-2", "right-3 top-3 border-r-2 border-t-2", "left-3 bottom-3 border-l-2 border-b-2", "right-3 bottom-3 border-r-2 border-b-2"].map((p) => (
        <span key={p} aria-hidden="true" className={`pointer-events-none absolute h-5 w-5 border-white/50 ${p}`} />
      ))}
      <div aria-hidden="true" className="pointer-events-none absolute left-6 top-5 hidden rounded bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/85 sm:block">
        Site plan · Pub
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute right-6 top-5 flex items-center gap-1.5 rounded bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/85">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff3b30]" />
        {CAMS.length} cameras
      </div>
    </div>
  );
}

function DarkRow({ kinds, dir }: { kinds: Kind[]; dir: "left" | "right" }) {
  return (
    <div className={`overflow-hidden ${s.fadeEdges}`}>
      <ul className={`flex w-max gap-3 ${dir === "left" ? s.rowLeft : s.rowRight}`}>
        {[...kinds, ...kinds, ...kinds, ...kinds].map((k, i) => (
          <li
            key={i}
            aria-hidden={i >= kinds.length}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-body-sm font-semibold text-white/85"
          >
            <span aria-hidden="true" className="text-[#ff6a5f]">{k.icon}</span>
            {k.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

const CTA =
  "focus-ring-solid inline-flex h-control-lg w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover sm:w-auto";

export function HikvisionBusinessSection() {
  const [open, setOpen] = useState(false);
  const [held, setHeld] = useState<number | null>(null);
  const [auto, setAuto] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // Step through the cameras on its own while nobody is pointing at one.
  useEffect(() => {
    if (held !== null) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setAuto((n) => (n + 1) % CAMS.length), 2400);
    return () => clearInterval(t);
  }, [held]);
  const active = held ?? auto;

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = sectionRef.current;
    if (!el || el.getBoundingClientRect().top >= 0) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [open]);

  function start() {
    track(EVENTS.CTA_CLICKED, { cta_id: "business_quote", cta_label: "Get a business quote", cta_location: "business" });
    setOpen(true);
  }

  return (
    <section ref={sectionRef} id="business" className="w-full scroll-mt-28 overflow-hidden bg-[#0e1013] py-16 text-white md:py-24">
      <div
        key={open ? "form" : "intro"}
        className={`container mx-auto ${open ? "animate-[slideInRight_0.3s_ease-out] motion-reduce:animate-none" : ""}`}
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow !text-[#ff6a5f]">For businesses</p>
          <h2 className="mt-4 text-balance h2-section text-white">
            {open ? "Let's plan your site." : "Shops, pubs and offices too."}
          </h2>
          <p className="mt-5 text-balance text-body text-white/70 md:text-lg" style={{ lineHeight: "1.6" }}>
            {open
              ? "We visit before we quote, and the quote goes in the business's name."
              : "Cameras inside and out, every site on one app. We visit before we quote."}
          </p>
        </div>

        {open && (
          <div className="mx-auto mt-8 max-w-md md:mt-10">
            <LazyHikvisionQuoteForm
              tone="dark"
              presetIntent="new"
              onBack={() => setOpen(false)}
              showStepLabels={false}
              defaultService="security"
              skipServiceStep
              formName="hikvision_business"
            />
          </div>
        )}
      </div>

      {!open && (
        <>
          <div className="mt-10 space-y-3 md:mt-12">
            <DarkRow kinds={KINDS_1} dir="left" />
            <DarkRow kinds={KINDS_2} dir="right" />
          </div>

          {/* The plan and its list from md up. On phones the photo is too
              small to read the cameras on (Gus, 5 November), so the section
              goes from the rows straight to the four points and the button. */}
          <div className="container mx-auto mt-16 hidden items-center gap-8 md:grid lg:grid-cols-[1.75fr_1fr] lg:gap-12">
            <SitePlan active={active} held={held !== null} onPick={setHeld} />

            <div>
              <h3 className="text-xl font-bold leading-tight text-white md:text-2xl">Where we&apos;d put them in a pub</h3>
              <p className="mt-2 text-body-sm text-white/60">Every way in, the till and the stock, inside and out.</p>
              <ol className="mt-5 space-y-1.5">
                {CAMS.map((c, i) => (
                  <li key={c.n}>
                    <button
                      type="button"
                      onMouseEnter={() => setHeld(i)}
                      onMouseLeave={() => setHeld(null)}
                      onFocus={() => setHeld(i)}
                      onBlur={() => setHeld(null)}
                      onClick={() => setHeld(i)}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors duration-300 ${
                        active === i ? "border-[#ff6a5f]/50 bg-white/[0.06]" : "border-transparent hover:bg-white/[0.03]"
                      }`}
                    >
                      <span className={`font-mono text-[11px] font-bold tracking-[0.1em] ${active === i ? "text-[#ff6a5f]" : "text-white/40"}`}>{c.n}</span>
                      <span className="text-body-sm font-semibold text-white">{c.name}</span>
                      <span className="ml-auto text-right text-[12px] text-white/50">{c.detail}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <div className="mt-6">
                <button type="button" onClick={start} className={CTA}>
                  Get a business quote
                  <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
                </button>
              </div>
            </div>
          </div>

          <div className="container mx-auto mt-10 md:mt-20">
            <ul className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
              {POINTS.map((p) => (
                <li key={p.title} className="p-3 text-left sm:p-4">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#ff6a5f]"
                  >
                    {p.icon}
                  </span>
                  <h3 className="mt-3 text-base font-bold leading-tight text-white">{p.title}</h3>
                  <p className="mt-1 text-body-sm text-white/60" style={{ lineHeight: "1.5" }}>
                    {p.detail}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-8 md:hidden">
              <button type="button" onClick={start} className={CTA}>
                Get a business quote
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
