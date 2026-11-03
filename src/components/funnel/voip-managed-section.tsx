import type { ReactNode } from "react";
import { ArrowRight, Globe, Headset, PackageCheck, RadioTower, Truck } from "lucide-react";

/**
 * Managed service, a full-width dark band (voip-research, sections 2 and 3).
 * What business customers asked for: a static IP for monitored CCTV, a VPN
 * or port forwarding (8 chats), and someone to call when it breaks. What
 * they complained about: "It's just a chat line".
 *
 * The fixed IP is honest about how it works (our router, not Starlink: its
 * "truly static IPs are not available"). Kept off until Will answers:
 * "Starlink subscription included" (question 15, Starlink's bundling
 * clause), any uptime figure, "24/7" (Starlink already offers it), real
 * support hours (12). The extras assume question 11.
 */

type Item = { icon: ReactNode; title: string; detail: string };

const ICON = "h-5 w-5";

const ITEMS: Item[] = [
  { icon: <Globe className={ICON} />, title: "A fixed IP that stays put", detail: "Through our router, so it doesn't change if you move." },
  { icon: <RadioTower className={ICON} />, title: "Backup when the dish drops", detail: "Switches to 4G/5G automatically." },
  { icon: <Headset className={ICON} />, title: "One team to call", detail: "A UK number with real people on the end." },
  { icon: <Truck className={ICON} />, title: "No call-out fees", detail: "If something needs looking at, we come out." },
  { icon: <PackageCheck className={ICON} />, title: "Kit replaced if it fails", detail: "We handle the swap." },
];

export function VoipManagedSection() {
  return (
    <section id="managed" className="w-full scroll-mt-28 bg-[#0e1013] py-16 text-white md:py-24">
      <div className="container mx-auto">
        <div className="max-w-2xl">
          <p className="eyebrow !text-[#ff6a5f]">Managed service</p>
          <h2 className="mt-4 h2-section text-white">Starlink for business, looked after.</h2>
          <p className="mt-4 text-pretty text-body text-white/70 md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
            Starlink blocks incoming connections, so monitored CCTV, an office VPN and port forwarding don&apos;t work out
            of the box. We fix that, and we stay on the end of the phone.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:mt-12 lg:grid-cols-3">
          {ITEMS.map((i) => (
            <li key={i.title} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                {i.icon}
              </span>
              <h3 className="mt-4 text-lg font-bold leading-tight text-white">{i.title}</h3>
              <p className="mt-1.5 text-pretty text-body-sm text-white/70" style={{ lineHeight: "1.55" }}>
                {i.detail}
              </p>
            </li>
          ))}
          {/* The sixth slot of the grid, so the button sits with the cards
              instead of floating at the right edge under them (Gus, 3
              November). Many camera apps work without a fixed IP (cloud
              relay, outbound VPNs), so the page offers to check instead of
              selling one to everyone. */}
          <li className="flex flex-col rounded-2xl border border-primary/40 bg-primary/10 p-5 sm:p-6">
            <h3 className="text-lg font-bold leading-tight text-white">Not sure you need a fixed IP?</h3>
            <p className="mt-1.5 flex-1 text-pretty text-body-sm text-white/70" style={{ lineHeight: "1.55" }}>
              Many camera apps work without one. Tell us what you&apos;re connecting and we&apos;ll check.
            </p>
            <a
              href="#quote"
              className="focus-ring-solid mt-5 flex h-control-lg w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover"
            >
              Talk to us
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
