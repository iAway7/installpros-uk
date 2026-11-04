import type { ReactNode } from "react";
import { ArrowRight, House, PackageCheck, RadioTower, Truck, UserRound } from "lucide-react";
import { ManagedHorizonGlow } from "./managed-horizon-glow";

/**
 * What's included, the full-width dark band with the violet horizon. Built
 * for /digital-landline on 3 November, taken off when Will asked for two
 * pages, and kept because Gus liked it; this is its page.
 *
 * The cards are InstallPros' own "What's Included" template (18 chats,
 * managed-research, section 1), minus what the research says not to promise:
 * no "subscription included" (Starlink's bundling clause, question 15), no
 * uptime figure, no "24/7", no "unlimited relocations" (the templates say
 * one), no "free dish upgrade" until its terms are known (11). "One team to
 * call" and the fixed IP have sections of their own above.
 *
 * Every card waits on Will's question 11 for its limits; the account card on
 * question 15.
 */

type Item = { icon: ReactNode; title: string; detail: string };

const ICON = "h-5 w-5";

const ITEMS: Item[] = [
  {
    icon: <RadioTower className={ICON} />,
    title: "Backup when the dish drops",
    detail: "Switches to 4G/5G automatically, if your site needs it.",
  },
  {
    icon: <Truck className={ICON} />,
    title: "No call-out fees",
    detail: "If something needs looking at, we come out.",
  },
  { icon: <PackageCheck className={ICON} />, title: "Kit replaced if it fails", detail: "We handle the swap." },
  {
    icon: <House className={ICON} />,
    title: "One move in the UK",
    detail: "Moving site? We move the dish and set it up again.",
  },
  {
    icon: <UserRound className={ICON} />,
    title: "Your account, in your name",
    detail: "You stay the Starlink customer. We look after the rest.",
  },
];

export function ManagedIncludedSection() {
  return (
    <section id="included" className="w-full scroll-mt-28 overflow-hidden bg-[#0e1013] py-16 text-white md:py-24">
      <div className="container mx-auto">
        {/* Above the glow, which is positioned and comes later. */}
        <div data-reveal className="relative z-10 max-w-2xl">
          <p className="eyebrow !text-[#ff6a5f]">Managed service</p>
          <h2 className="mt-4 h2-section text-white">What&apos;s included.</h2>
          <p className="mt-4 text-pretty text-body text-white/70 md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
            Everything after the install, from the team that fitted it.
          </p>
        </div>

        {/* A glowing horizon behind the cards (Gus, 3 November), at the
            middle of the grid: between the two rows on desktop, and between
            the third and fourth card on phones. The cards are opaque and sit
            in front of it; the light shows in the gaps. */}
        <div className="relative mt-10 md:mt-12">
          <ManagedHorizonGlow y="50%" />
          <ul className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {ITEMS.map((i, n) => (
              <li
                key={i.title}
                data-reveal
                style={{ transitionDelay: `${n * 80}ms` }}
                className="flex flex-col rounded-2xl border border-white/10 bg-[#16181b] p-5 sm:p-6"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white"
                >
                  {i.icon}
                </span>
                <h3 className="mt-4 text-lg font-bold leading-tight text-white">{i.title}</h3>
                <p className="mt-1.5 text-pretty text-body-sm text-white/70" style={{ lineHeight: "1.55" }}>
                  {i.detail}
                </p>
              </li>
            ))}
            {/* The sixth slot of the grid, so the button sits with the cards
                (Gus, 3 November). */}
            <li
              data-reveal
              style={{ transitionDelay: `${ITEMS.length * 80}ms` }}
              className="flex flex-col rounded-2xl border border-primary/40 bg-[#0e1013] bg-gradient-to-b from-primary/10 to-primary/10 p-5 sm:p-6"
            >
              <h3 className="text-lg font-bold leading-tight text-white">Tell us what you run</h3>
              <p className="mt-1.5 flex-1 text-pretty text-body-sm text-white/70" style={{ lineHeight: "1.55" }}>
                We&apos;ll say what you need, and what you don&apos;t.
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
      </div>
    </section>
  );
}
