import type { ReactNode } from "react";
import { BatteryCharging, Phone, Siren } from "lucide-react";

/**
 * Power cuts and 999, as a full-width dark band (voip-research, sections 3
 * and 4). Only 6 of 12 competitor pages answer it, and neither Starlink
 * installer does. In the chats a buyer was told "Starlink has a 99% uptime"
 * and replied "That's not the answer to my questions".
 *
 * What it can say: the phone, router and dish all need power; Ofcom expects
 * the voice provider to give at least an hour of emergency calling to
 * customers who rely on the landline; 999 sends the address on record.
 * Never "works in a power cut" or an uptime figure.
 *
 * The backup and forwarding are on Will's WordPress page (question 5); the
 * "8 hours" there stays off until he confirms it. The third card is Pine
 * Media's idea, the only competitor that asks what else uses the line.
 */

type Item = { icon: ReactNode; title: string; detail: string };

const ICON = "h-5 w-5";

const ITEMS: Item[] = [
  {
    icon: <BatteryCharging className={ICON} />,
    title: "If you rely on your landline",
    detail: "Tell us. We'll add a battery backup and send calls to your mobile when the line is down.",
  },
  {
    icon: <Siren className={ICON} />,
    title: "999 calls",
    detail: "Work whenever you have power and internet. We register your address, so emergency services know where you are.",
  },
  {
    icon: <Phone className={ICON} />,
    title: "Anything else on your line?",
    detail: "A careline alarm, a burglar alarm, a card machine, a gate intercom. Tell us before you switch and we'll check it first.",
  },
];

export function VoipPowerSection() {
  return (
    <section id="power" className="w-full scroll-mt-28 bg-[#0e1013] py-16 text-white md:py-24">
      <div className="container mx-auto">
        <div data-reveal className="max-w-2xl">
          <p className="eyebrow !text-[#ff6a5f]">Power cuts and 999</p>
          <h2 className="mt-4 h2-section text-white">What if the power goes off?</h2>
          <p className="mt-4 text-pretty text-body text-white/70 md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
            Your phone, your router and your Starlink all need power. In a power cut the phone stops until the power comes back.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-3 sm:gap-4 md:mt-12 lg:grid-cols-3">
          {ITEMS.map((i, n) => (
            <li key={i.title} data-reveal style={{ transitionDelay: `${n * 80}ms` }} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                {i.icon}
              </span>
              <h3 className="mt-4 text-lg font-bold leading-tight text-white">{i.title}</h3>
              <p className="mt-1.5 text-pretty text-body-sm text-white/70" style={{ lineHeight: "1.55" }}>
                {i.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
