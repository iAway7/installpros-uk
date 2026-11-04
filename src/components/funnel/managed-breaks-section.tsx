import { Cctv, Network, Router, Store } from "lucide-react";
import { whatsappUrl } from "@/lib/funnel/contact";
import { WhatsAppIcon } from "./ui/whatsapp-icon";

/**
 * What Starlink breaks, straight after the hero (managed-research, sections
 * 1 to 3). Starlink puts every home and business behind shared addresses
 * (CGNAT) and "blocks all inbound ports", so anything that has to be reached
 * from outside stops working. The four cards are the jobs people asked about
 * in the chats: monitored CCTV and alarms (7 threads), an office VPN or
 * remote access (4), port forwarding (1), shop systems and printers (5). No
 * competitor names them.
 *
 * Then the check: 3 of 4 VPN cases and several CCTV ones needed no fixed IP
 * at all (section 1.2), so the page offers to look first instead of selling
 * one to everyone.
 */

const ICON = "h-5 w-5";

const ITEMS = [
  { icon: <Cctv className={ICON} />, title: "Monitored CCTV and alarms", detail: "The monitoring company can't reach your recorder." },
  { icon: <Network className={ICON} />, title: "Office VPN", detail: "Nobody can connect in to the office from outside." },
  { icon: <Router className={ICON} />, title: "Port forwarding", detail: "Remote desktop, servers, anything you open a port for." },
  { icon: <Store className={ICON} />, title: "Shop and business systems", detail: "Tills, printers and suppliers that expect a fixed address." },
];

export function ManagedBreaksSection() {
  return (
    <section id="problem" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Why it stops working</p>
          <h2 className="mt-4 text-balance h2-section text-foreground">Starlink blocks incoming connections.</h2>
          <p className="mt-4 text-pretty text-body text-muted-foreground md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
            It shares one address between many customers, so nothing outside can connect in. That breaks:
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
          {ITEMS.map((i, n) => (
            <li key={i.title} data-reveal style={{ transitionDelay: `${n * 80}ms` }} className="flex flex-col rounded-2xl bg-secondary p-6">
              <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {i.icon}
              </span>
              <h3 className="mt-4 text-lg font-bold leading-tight text-foreground">{i.title}</h3>
              <p className="mt-2 text-pretty text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                {i.detail}
              </p>
            </li>
          ))}
        </ul>

        <div data-reveal className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-5 text-center md:mt-12">
          <p className="text-balance text-body text-muted-foreground">
            <strong className="text-foreground">Not sure you need a fixed IP?</strong> Many systems work without one.
            Tell us what you run and we&apos;ll check first.
          </p>
          <a
            href={whatsappUrl("Hi, can you check if I need a fixed IP on Starlink? What I run: ")}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring-solid flex h-control-lg w-full items-center justify-center gap-2 rounded-lg border border-foreground/20 bg-transparent px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-foreground transition-colors duration-quick ease-ds hover:bg-secondary sm:w-auto"
          >
            <WhatsAppIcon className="h-[19px] w-[19px]" />
            Ask us to check
          </a>
        </div>
      </div>
    </section>
  );
}
