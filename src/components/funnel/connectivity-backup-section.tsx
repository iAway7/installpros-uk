import type { ReactNode } from "react";
import { BatteryCharging, PhoneOff, Router, ShieldCheck } from "lucide-react";

/**
 * The backup line, as a full-width dark band in the shape of
 * voip-power-section (4g-5g-fibre-research, sections 1, 3 and 5). 8 threads
 * wanted one: a server room, a listed-house project, an IT provider for two
 * car dealerships, a home worker on free Virgin. Nobody in the market says
 * what a switch feels like.
 *
 * Facts: the Starlink Gen 3 router has no SIM slot, so 4G/5G backup needs a
 * second router; plain failover moves after a few failed checks seconds
 * apart, and a call or download in progress can drop (only bonding with an
 * endpoint keeps it). So never "instant", "seamless" or "zero downtime"; the
 * WordPress network pages say "instantly" and should change too (Will's
 * question 12). Timing and the handover test wait on question 5, the battery
 * on question 7.
 */

type Item = { icon: ReactNode; title: string; detail: string };

const ICON = "h-5 w-5";

const ITEMS: Item[] = [
  {
    icon: <Router className={ICON} />,
    title: "A router that takes a SIM",
    detail: "The Starlink router has no SIM slot, so 4G/5G backup needs a second router.",
  },
  {
    icon: <PhoneOff className={ICON} />,
    title: "What you'll notice",
    detail: "A call or download in progress may drop as it switches. Then you're back online.",
  },
  {
    icon: <BatteryCharging className={ICON} />,
    title: "Power cuts",
    detail: "Your dish and routers need power too. Ask about a battery backup.",
  },
  {
    icon: <ShieldCheck className={ICON} />,
    title: "Tested before we leave",
    detail: "We unplug the main line and watch the backup take over.",
  },
];

export function ConnectivityBackupSection() {
  return (
    <section id="backup" className="w-full scroll-mt-28 bg-[#0e1013] py-16 text-white md:py-24">
      <div className="container mx-auto">
        <div data-reveal className="max-w-2xl">
          <p className="eyebrow !text-[#ff6a5f]">Backup</p>
          <h2 className="mt-4 h2-section text-white">If one line drops, the other takes over.</h2>
          <p className="mt-4 text-pretty text-body text-white/70 md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
            Starlink, fibre and 4G/5G can share one router. When the main line drops, it moves to the backup on its own,
            within seconds.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:mt-12 lg:grid-cols-4">
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
