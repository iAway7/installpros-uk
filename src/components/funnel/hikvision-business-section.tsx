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
 * "we also sell to businesses"). Built by hand after React Bits Pro bento-33,
 * logo rows drifting in opposite ways (no Pro licence): the kinds of
 * business from the chats in two rows, then four points and the button.
 * Gus picked it from four versions on a preview page (the others: three
 * sites flowing into one app, alerts stacking, and this one with the sites
 * added), shorter than the rest and speaking to every business, not only
 * the ones with several sites.
 *
 * What it says comes from the chats and Jordan. 16 of 81 camera buyers were
 * businesses (pubs, shops, a market unit, takeaways, a restaurant, a
 * laundrette, a car wash, a cattery, an office, a pharmacy group, a depot, a
 * fishery, a farm, a kiosk; hikvision-research/superchat-cctv-insights.md),
 * wanting cameras inside (till, stock, kitchen), several sites on one app,
 * the make and model on the quote and an invoice to the company. Jordan, 5
 * November: homes and businesses, and commercial sites get a survey, hence
 * "We visit before we quote". "Invoiced to the company" is assumed (Install
 * Pros Group Ltd).
 *
 * A first "For businesses" block sat elsewhere on the page and Gus removed it
 * on 30 October; this one replaces the owners' section instead, which had
 * shrunk to "Add to mine" once Jordan said repairs don't pay. Owners still
 * get "Add to mine" in the form's first step.
 *
 * The button opens the form right here, intent new, form_name
 * hikvision_business, so Will can tell these leads apart; the label in
 * Zapier and Superchat stays "Hikvision CCTV".
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

const CTA =
  "focus-ring-solid inline-flex h-control-lg w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover sm:w-auto";

/** One row, repeated four times so it never runs out while it drifts; only
 *  the first copy is read out. */
function Row({ kinds, dir }: { kinds: Kind[]; dir: "left" | "right" }) {
  return (
    <div className={`overflow-hidden ${s.fadeEdges}`}>
      <ul className={`flex w-max gap-3 ${dir === "left" ? s.rowLeft : s.rowRight}`}>
        {[...kinds, ...kinds, ...kinds, ...kinds].map((k, i) => (
          <li
            key={i}
            aria-hidden={i >= kinds.length}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-background px-4 py-2.5 text-body-sm font-semibold text-foreground"
          >
            <span aria-hidden="true" className="text-brand-icon">{k.icon}</span>
            {k.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HikvisionBusinessSection() {
  const [open, setOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // Keep the heading in view when the form replaces the content.
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
    <section ref={sectionRef} id="business" className="w-full scroll-mt-28 overflow-hidden bg-background py-16 md:py-24">
      <div
        key={open ? "form" : "intro"}
        className={`container mx-auto ${open ? "animate-[slideInRight_0.3s_ease-out] motion-reduce:animate-none" : ""}`}
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">For businesses</p>
          <h2 className="mt-4 text-balance h2-section text-foreground">
            {open ? "Let's plan your site." : "Shops, pubs and offices too."}
          </h2>
          <p className="mt-5 text-balance text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            {open
              ? "We visit before we quote, and the quote goes in the business's name."
              : "Cameras inside and out, every site on one app. We visit before we quote."}
          </p>
        </div>

        {open && (
          <div className="mx-auto mt-8 max-w-md md:mt-10">
            <LazyHikvisionQuoteForm
              tone="light"
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
            <Row kinds={KINDS_1} dir="left" />
            <Row kinds={KINDS_2} dir="right" />
          </div>
          <div className="container mx-auto mt-12 md:mt-16">
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {POINTS.map((p) => (
                <li key={p.title} className="text-center">
                  <span
                    aria-hidden="true"
                    className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-brand-icon"
                  >
                    {p.icon}
                  </span>
                  <h3 className="mt-3 text-base font-bold leading-tight text-foreground">{p.title}</h3>
                  <p className="mt-1 text-body-sm text-muted-foreground" style={{ lineHeight: "1.5" }}>
                    {p.detail}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex justify-center md:mt-12">
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
