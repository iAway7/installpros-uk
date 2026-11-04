import { ArrowDown, ArrowRight, Globe, Router, Satellite } from "lucide-react";

/**
 * The fixed IP, explained in one picture (managed-research, section 3).
 * Starlink "does not provide static IP addresses"; even the public IP on a
 * Priority plan "may change" when the dish moves or updates. The only fixed
 * address that holds is one carried by a router on site, over a tunnel, to
 * an address someone owns. The quotes and staff notes in the chats show
 * InstallPros fits such a router (a MikroTik or EdgeRouter "first device in
 * line from the Starlink"). Only one competitor of 15 explains this.
 *
 * Kept prudent until Will answers question 16 (whose address it is): no
 * "stays the same if you move", no "survives the switch to 4G/5G". Gus
 * doubted the fixed IP promise on 3 November; it goes in once Will confirms.
 */

const STEPS = [
  { icon: <Satellite className="h-6 w-6" />, title: "Your Starlink", detail: "Its own address can change." },
  { icon: <Router className="h-6 w-6" />, title: "Our router", detail: "Fitted next to it, set up by us." },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Your fixed IP",
    detail: "One address your cameras or VPN can be reached on.",
  },
];

export function ManagedFixedIpSection() {
  return (
    <section id="fixed-ip" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Fixed IP</p>
          <h2 className="mt-4 text-balance h2-section text-foreground">A fixed IP, when you need one.</h2>
          <p
            className="mt-4 text-pretty text-body text-muted-foreground md:mt-5 md:text-lg"
            style={{ lineHeight: "1.6" }}
          >
            Starlink doesn&apos;t give fixed addresses. We fit our own router, which gives your systems one.
          </p>
        </div>

        <ol className="mx-auto mt-10 flex max-w-4xl flex-col items-stretch gap-3 md:mt-12 md:flex-row md:items-center md:gap-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="contents">
              {/* Phones: a row each, icon at the left, so the three fit in one
                  screen. md up: three columns, centred. */}
              <div
                data-reveal
                style={{ transitionDelay: `${i * 120}ms` }}
                className="flex flex-1 items-center gap-4 rounded-2xl bg-background p-5 text-left shadow-raised md:flex-col md:gap-0 md:p-6 md:text-center"
              >
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                >
                  {s.icon}
                </span>
                <div>
                  <h3 className="text-lg font-bold leading-tight text-foreground md:mt-4">{s.title}</h3>
                  <p
                    className="mt-1 text-pretty text-body-sm text-muted-foreground md:mt-1.5"
                    style={{ lineHeight: "1.55" }}
                  >
                    {s.detail}
                  </p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <span aria-hidden="true" className="flex shrink-0 items-center justify-center text-muted-foreground">
                  <ArrowDown className="h-5 w-5 md:hidden" />
                  <ArrowRight className="hidden h-5 w-5 md:block" />
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
