import { ArrowDown, ArrowRight, Check, X } from "lucide-react";
import DecryptedText from "@/components/DecryptedText";
import SpotlightCard from "@/components/SpotlightCard";

/**
 * The fixed IP, explained in one picture (managed-research, section 3).
 * Starlink "does not provide static IP addresses"; even the public IP on a
 * Priority plan "may change" when the dish moves or updates. The only fixed
 * address that holds is one carried by a router on site, over a tunnel, to
 * an address someone owns. The quotes and staff notes in the chats show
 * InstallPros fits such a router (a MikroTik or EdgeRouter "first device in
 * line from the Starlink"). Only one competitor of 15 explains this.
 *
 * Before and after, on React Bits' SpotlightCard, with the addresses decoding
 * through React Bits' DecryptedText (Gus picked it from three versions, 4
 * November 2026): the one Starlink gives keeps changing, the fixed one
 * settles. Both are examples: 100.64.x.x is Starlink's shared range (CGNAT),
 * 203.0.113.x the range set aside for documentation.
 *
 * Kept prudent until Will answers question 16 (whose address it is): no
 * "stays the same if you move", no "survives the switch to 4G/5G".
 */

/** An address whose numbers decode while the dots stay put. `changing` keeps it scrambling. */
function Ip({ value, changing }: { value: string; changing?: boolean }) {
  return (
    <span aria-label={value} className="whitespace-nowrap">
      {value.split(".").map((part, i) => (
        <span key={i} aria-hidden="true">
          {i > 0 && "."}
          <DecryptedText
            text={part}
            animateOn="view"
            loop={changing}
            loopDelay={1500 + i * 120}
            sequential={!changing}
            speed={changing ? 60 : 80}
            characters="0123456789"
          />
        </span>
      ))}
    </span>
  );
}

const WITHOUT = ["The monitoring company can't connect", "The office VPN can't reach in", "No ports to open"];
const WITH = ["Cameras reachable by your monitoring company", "Your VPN connects in", "The ports you need, open"];

export function ManagedFixedIpSection() {
  return (
    <section id="fixed-ip" className="relative w-full scroll-mt-28 overflow-hidden bg-[#0e1013] py-16 text-white md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(50% 60% at 75% 100%, rgba(124,92,255,0.2), transparent 70%)" }}
      />
      <div className="container relative mx-auto">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow !text-[#ff6a5f]">Fixed IP</p>
          <h2 className="mt-4 text-balance h2-section text-white">A fixed IP, when you need one.</h2>
          <p className="mt-4 text-pretty text-body text-white/70 md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
            Starlink doesn&apos;t give fixed addresses. We fit our own router, which gives your systems one.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:mt-14 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-5">
          <div data-reveal>
            <SpotlightCard theme="dark" spotlightColor="rgba(255,106,95,0.22)" className="border border-white/10 !p-6 md:!p-8">
              <p className="text-body-sm font-medium text-white/50">Starlink on its own</p>
              <p className="mt-3 font-mono text-[28px] tabular-nums tracking-tight text-white/80 md:text-[34px]">
                <Ip value="100.64.37.112" changing />
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-body-sm text-[#ff6a5f]">
                <span className="h-1.5 w-1.5 rounded-full bg-current" /> Shared, and it changes
              </p>
              <ul className="mt-6 space-y-2.5">
                {WITHOUT.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-body text-white/70">
                    <X aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#ff6a5f]" />
                    {t}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </div>

          <span aria-hidden="true" className="flex justify-center text-white/40">
            <ArrowDown className="h-6 w-6 md:hidden" />
            <ArrowRight className="hidden h-6 w-6 md:block" />
          </span>

          <div data-reveal style={{ transitionDelay: "120ms" }}>
            <SpotlightCard
              theme="dark"
              spotlightColor="rgba(111,207,151,0.22)"
              className="border border-success-bright/30 !p-6 md:!p-8"
            >
              <p className="text-body-sm font-medium text-white/50">With our router</p>
              <p className="mt-3 font-mono text-[28px] tabular-nums tracking-tight text-white md:text-[34px]">
                <Ip value="203.0.113.24" />
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-body-sm text-success-bright">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" /> One fixed address
              </p>
              <ul className="mt-6 space-y-2.5">
                {WITH.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-body text-white/85">
                    <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-success-bright" />
                    {t}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </div>
        </div>
        <p className="mt-6 text-center font-mono text-caption text-white/40">Example addresses</p>
      </div>
    </section>
  );
}
