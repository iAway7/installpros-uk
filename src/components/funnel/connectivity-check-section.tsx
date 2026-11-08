import type { ReactNode } from "react";
import { Cable, RadioTower, Sun } from "lucide-react";

/**
 * "First, we check", as a full-width dark band (4g-5g-fibre-research,
 * sections 4 and 8). The gap in the market: only Dragon WiFi tests the
 * networks on site, and nobody recommends across the options. Staff already
 * do a virtual survey from photos before every Starlink quote.
 *
 * What each card may say: fibre is looked up, not promised (Openreach and the
 * altnets decide where it goes); mobile networks "reach you" from a
 * direction, never "5G in your area"; the sky from photos or a visit. How
 * InstallPros checks mobile signal waits on Will's question 3.
 */

type Item = { icon: ReactNode; title: string; detail: string };

const ICON = "h-5 w-5";

const ITEMS: Item[] = [
  {
    icon: <Cable className={ICON} />,
    title: "Fibre at your postcode",
    detail: "Whether it's built, planned or nowhere near.",
  },
  {
    icon: <RadioTower className={ICON} />,
    title: "Mobile networks",
    detail: "Which ones reach you, and from which direction.",
  },
  {
    icon: <Sun className={ICON} />,
    title: "The sky",
    detail: "A clear view for Starlink, from your photos or a visit.",
  },
];

export function ConnectivityCheckSection() {
  return (
    <section id="check" className="w-full scroll-mt-28 bg-[#0e1013] py-16 text-white md:py-24">
      <div className="container mx-auto">
        <div data-reveal className="max-w-2xl">
          <p className="eyebrow !text-[#ff6a5f]">Before we quote</p>
          <h2 className="mt-4 h2-section text-white">First, we check what reaches you.</h2>
          <p className="mt-4 text-pretty text-body text-white/70 md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
            Then we recommend one setup, not the dearest one.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-3 sm:gap-4 md:mt-12 lg:grid-cols-3">
          {ITEMS.map((i, n) => (
            <li
              key={i.title}
              data-reveal
              style={{ transitionDelay: `${n * 80}ms` }}
              className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 lg:flex-col lg:gap-0"
            >
              <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                {i.icon}
              </span>
              <div>
                <h3 className="text-lg font-bold leading-tight text-white lg:mt-4">{i.title}</h3>
                <p className="mt-1.5 text-pretty text-body-sm text-white/70" style={{ lineHeight: "1.55" }}>
                  {i.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
