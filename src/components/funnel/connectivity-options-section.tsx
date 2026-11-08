import type { ReactNode } from "react";
import { ArrowRight, RadioTower, Router, Satellite } from "lucide-react";

/**
 * "What we fit", straight after the hero (4g-5g-fibre-research, sections 1
 * and 4). The page sells the connection that works at an address, not a
 * technology: nobody in the chats asks for a 4G/5G install or for fibre, and
 * no competitor recommends across Starlink, a 4G/5G antenna and fibre at one
 * address (National Broadband's checker dead-ends at "satellite may be your
 * only option").
 *
 * Three setups, each with the place it suits, so the reader can find their
 * own house in one of them. "Both" is the backup line: the 8 threads that
 * wanted one, and Will's stack on the commercial page. What InstallPros fits
 * for 4G/5G waits on Will's question 1.
 */

type Option = { icon: ReactNode; title: string; where: string; detail: string };

const ICON = "h-5 w-5";

const OPTIONS: Option[] = [
  {
    icon: <Satellite className={ICON} />,
    title: "Starlink",
    where: "Where there's no fibre and little signal.",
    detail: "A dish with a clear view of the sky, wired to a router inside.",
  },
  {
    icon: <RadioTower className={ICON} />,
    title: "A 4G/5G antenna",
    where: "Where a mast is in reach.",
    detail: "An antenna outside, facing the mast, with the router beside it.",
  },
  {
    icon: <Router className={ICON} />,
    title: "Both, with a backup",
    where: "Where you can't be offline.",
    detail: "Starlink and 4G/5G on one router. If one drops, it switches to the other on its own.",
  },
];

export function ConnectivityOptionsSection() {
  return (
    <section id="options" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">What we fit</p>
          <h2 className="mt-4 text-balance h2-section text-foreground">The right connection for your address.</h2>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-3 md:mt-12 md:grid-cols-3 md:gap-4">
          {OPTIONS.map((o, i) => (
            <li
              key={o.title}
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
              className="flex gap-4 rounded-2xl bg-secondary p-5 md:flex-col md:gap-0 md:p-6"
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"
              >
                {o.icon}
              </span>
              <div>
                <h3 className="text-lg font-bold leading-tight text-foreground md:mt-4">{o.title}</h3>
                <p className="mt-1.5 text-body-sm font-semibold text-foreground">{o.where}</p>
                <p className="mt-1.5 text-pretty text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                  {o.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div data-reveal className="mt-8 text-center md:mt-10">
          <a
            href="#fibre"
            className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-md text-body font-semibold text-primary underline-offset-4 hover:underline"
          >
            Fibre on the way? We&apos;ll connect it when it arrives
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
