import { ArrowRight, Check } from "lucide-react";

/**
 * For businesses, short, in the shape of voip-business-section
 * (4g-5g-fibre-research, sections 1, 2 and 4). The backup buyers in the
 * chats were mostly businesses: a care company's server room, an IT provider
 * for two car dealerships, Will's own quote with a 5G multi-SIM antenna and a
 * dual-WAN router. The order (current line first, Starlink next, then
 * 4G/5G) is Will's stack, from the live commercial page.
 *
 * "IT company?" is Will's B2B outreach line ("We handle the install, you
 * handle the IT"); no competitor page speaks to IT providers.
 *
 * Businesses that need a fixed IP and a person to call go to
 * /managed-starlink, so the two pages don't sell the same thing. That page
 * is a 404 in production too until it launches; check the link then.
 * Waits on Will's question 6.
 */

const POINTS = [
  "Your current line stays first",
  "Starlink next, then 4G/5G",
  "One router, the switch tested on the day",
  "IT company? We do the install, you do the IT.",
];

export function ConnectivityBusinessSection() {
  return (
    <section id="business" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center md:gap-14">
          <div data-reveal>
            <p className="eyebrow">For businesses</p>
            <h2 className="mt-4 text-balance h2-section text-foreground">A backup line for your business.</h2>
            <p className="mt-4 text-pretty text-body text-muted-foreground md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
              Keep your fibre or leased line. We add Starlink and 4G/5G behind it, on one router, and test the switch.
            </p>
            <a
              href="/managed-starlink"
              className="focus-ring mt-6 inline-flex min-h-[44px] items-center gap-1.5 rounded-md text-body font-semibold text-primary underline-offset-4 hover:underline"
            >
              Need a fixed IP and a person to call?
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
          <ul className="space-y-3">
            {POINTS.map((p, i) => (
              <li
                key={p}
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
                className="flex items-start gap-3 rounded-2xl bg-secondary p-5"
              >
                <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <span className="text-pretty text-body text-foreground" style={{ lineHeight: "1.5" }}>
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
