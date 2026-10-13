"use client";

import { ArrowRight, Check } from "lucide-react";
import { track, EVENTS } from "@/lib/analytics";

/**
 * Flat, house, business: the three properties the old Ajax page names ("from
 * flats to warehouses", "homes and businesses"), each with what usually goes
 * in it.
 *
 * Two jobs. A visitor finds their own property in one glance and pictures the
 * kit, which is what a quote for an alarm is actually made of. And it is the
 * slot the price goes into: the old page has no figure anywhere, and question 1
 * for Will is whether there is a "from" price, packages, or quote only.
 *
 * NO PRICES, BECAUSE NONE EXIST YET. Each card ends on "Fitted price on your
 * quote". If Will gives packages, that line becomes "From £X fitted" and the
 * kit lists become his; if he gives one "from" figure, it goes in the intro.
 *
 * THE KIT LISTS ARE ASSUMED. They are typical Ajax specifications for each kind
 * of property, written so Will has something to correct rather than a blank:
 * no counts, because a count would be a promise. Confirm before paid traffic.
 *
 * The cards are anchors to the closing form, like the commercial sector cards,
 * and log which one was tapped. With no lead data for this product yet, which
 * card people pick is the first read on who this page is for.
 */

type Pack = { key: string; name: string; who: string; kit: string[] };

const PACKS: Pack[] = [
  {
    key: "flat",
    name: "Flat",
    who: "A flat or a small home on one floor.",
    kit: ["Hub", "Motion detectors for the hall and living room", "A contact on the front door", "Keypad by the door", "Indoor siren", "Smoke detector"],
  },
  {
    key: "house",
    name: "House",
    who: "A house over one or more floors, pets included.",
    kit: ["Hub", "Pet-friendly motion detectors downstairs", "Contacts on the front, back and patio doors", "Keypad and key fobs", "Indoor and outdoor sirens", "Smoke and leak detectors"],
  },
  {
    key: "business",
    name: "Business",
    who: "A shop, office, yard or warehouse.",
    kit: ["Hub with SIM backup", "Detectors for every zone", "Contacts on every entrance", "Keypad with a code per member of staff", "Outdoor siren", "Cameras on the doors and the yard"],
  },
];

export function SecurityPackagesSection() {
  return (
    <section id="systems" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-7">
          <div>
            <p className="eyebrow">Sized to the property</p>
            <h2 className="mt-4 max-w-[640px] h2-section text-foreground">From a flat to a warehouse.</h2>
          </div>
          <p className="max-w-[420px] text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            Every system is specified for the doors, rooms and floors you actually have. These are the usual starting
            points.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-3">
          {PACKS.map((p) => (
            <a
              key={p.key}
              href="#quote"
              onClick={() =>
                track(EVENTS.CTA_CLICKED, {
                  cta_id: `ajax_${p.key}`,
                  cta_label: p.name,
                  cta_location: "systems",
                })
              }
              className="group flex flex-col rounded-xl border border-border bg-background p-6 transition-all duration-card ease-ds hover:-translate-y-[5px] hover:border-brand-soft/35 focus-visible:-translate-y-[5px] focus-visible:border-brand-soft/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:p-8"
            >
              <h3 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-foreground">{p.name}</h3>
              <p className="mt-2 text-body-sm leading-[1.6] text-muted-foreground">{p.who}</p>

              <p className="mt-6 text-label font-semibold uppercase tracking-[0.14em] text-muted-foreground">Usually includes</p>
              <ul className="mt-3 space-y-2.5">
                {p.kit.map((k) => (
                  <li key={k} className="flex items-start gap-2.5 text-body-sm text-foreground">
                    <Check aria-hidden="true" className="mt-[3px] h-4 w-4 shrink-0 text-success" />
                    {k}
                  </li>
                ))}
              </ul>

              {/* mt-auto pins the footer to the bottom so the three cards line
                  up however long each list runs. */}
              <div className="mt-auto pt-8">
                {/* Both halves nowrap and the row wraps, so on a phone or a
                    three-up tablet card each drops to its own line whole
                    instead of breaking "Get a / quote". */}
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border pt-5">
                  <span className="whitespace-nowrap text-body-sm text-muted-foreground">Fitted price on your quote</span>
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-body-sm font-semibold text-primary">
                    Get a quote
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-quick ease-ds group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
