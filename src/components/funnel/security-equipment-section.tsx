/**
 * "The hardware, handled." for the Ajax landing. A copy of equipment-section.tsx,
 * which renders on /install-quote and is not changed for another page: same
 * cards, same tile, same warranty strip, with the Ajax kit and wording.
 *
 * The kit is what InstallPros actually quotes: 90 itemised PDF quotes in
 * Superchat (ajax-research/superchat-security-insights.md, section 6) and
 * Jordan's answers of 15 October 2026 (Hub 2 as standard; Ajax cameras with
 * an Ajax alarm). The keypad and the key fob are left out because the section
 * above, "Easy for the whole family", already shows them.
 *
 * Descriptions follow equipment-section.tsx's rules: two lines at most (under
 * about 50 characters) and no full stop.
 *
 * Warranty: Jordan, 15 October: the manufacturer's warranty on the devices,
 * and 2 or 5 years on the workmanship. The strip reads it the way the Starlink
 * page already does (2 years, option to extend to 5).
 *
 * IMAGES are Ajax's own product shots, gathered by Gus on 15 October, so they
 * share the hero's open question: confirm with the distributor or Ajax that
 * they can be used. White and black pairs where Ajax publishes them; the
 * camera pair is two shots put together here. The siren is white only until
 * a black StreetSiren is found.
 */

type Item = { t: string; badge: string; d: string; img: string; alt: string };

const ITEMS: Item[] = [
  {
    t: "Ajax Hub 2",
    badge: "Standard",
    d: "Runs through power cuts on its own battery",
    img: "/funnel/ajax-eq-hub.webp",
    alt: "Ajax Hub 2 control panel, in white and black",
  },
  {
    t: "Detectors",
    badge: "Every way in",
    d: "Door, window, motion and photo detectors",
    img: "/funnel/ajax-eq-detectors.webp",
    alt: "Ajax MotionCam motion detector with a camera, in black and white",
  },
  {
    t: "Sirens",
    badge: "Inside & out",
    d: "Loud inside, and a deterrent on the wall outside",
    img: "/funnel/ajax-eq-sirens.webp",
    alt: "Ajax StreetSiren outdoor siren, in white",
  },
  {
    t: "Cameras",
    badge: "CCTV",
    // Ajax only. Hikvision is fitted too (every camera-only quote), but it
    // has its own page on installpros.co.uk; this one is the Ajax page (Gus,
    // 15 October).
    d: "Ajax cameras, on the same app as the alarm",
    img: "/funnel/ajax-eq-cameras.webp",
    alt: "Ajax TurretCam cameras, in white and black",
  },
];

export function SecurityEquipmentSection() {
  return (
    <section id="equipment" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <p className="eyebrow">Equipment</p>
          <h2 className="mt-4 h2-section text-foreground">The hardware, handled.</h2>
          <p className="mx-auto mt-5 max-w-xl text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            We supply, fit and set up every Ajax device. Nothing for you to buy or pair.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((e) => (
            <div
              key={e.t}
              className="rounded-xl border border-border bg-secondary/50 p-6 transition-all duration-card ease-ds hover:-translate-y-[5px] hover:border-brand-soft/35"
            >
              <div
                className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border"
                style={{ background: "var(--eq-img-grad)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.img} alt={e.alt} loading="lazy" className="h-full w-full object-contain p-[8%]" />
              </div>

              <div className="pt-5">
                <span className="inline-flex whitespace-nowrap rounded-full border border-brand-deep px-2.5 py-1 text-micro font-semibold uppercase tracking-[0.14em] text-brand-deep">
                  {e.badge}
                </span>
                <h3 className="mt-3 text-lg font-bold leading-tight text-foreground">{e.t}</h3>
                <p className="mt-2.5 text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                  {e.d}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-xl border border-border bg-secondary p-4 text-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand-icon" aria-hidden="true"><path d="M12 3 5 6v5.5c0 4.3 2.9 8.2 7 9.5 4.1-1.3 7-5.2 7-9.5V6l-7-3z" /><path d="m9 12 2 2 4-4" /></svg>
          <p className="text-body text-muted-foreground">
            <span className="font-semibold text-foreground">Manufacturer&apos;s warranty on every device, plus 2 years on our fitting.</span>{" "}
            Option to extend to 5 years.
          </p>
        </div>
      </div>
    </section>
  );
}
