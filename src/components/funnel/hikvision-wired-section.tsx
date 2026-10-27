import type { ReactNode } from "react";
import { ArrowRight, BatteryCharging, HardDrive, Moon, PlugZap, ShieldCheck, Wrench } from "lucide-react";
import { Gap } from "./hikvision-gap";

/**
 * "Why not Wi-Fi cameras?", in the slot where the draft had "What the fitting
 * includes" (four benefit cards copied from the Ajax page; Gus, 27 October:
 * he did not like it, free to change or remove).
 *
 * Why this instead (hikvision-research/analisis-secciones.md): 16 camera
 * chats raised wired against wireless ("i dont need NVR or HDD, lots of
 * cameras come with hd cards"), staff sent 7 buyers off to self-bought Wi-Fi
 * or battery cameras because wired cost more, and one customer had plug-in
 * cameras anyone could pull out. Price ends more lost quotes than anything
 * else, and this is what the installation buys. Six of the ten general CCTV
 * pages reviewed compare against DIY Wi-Fi cameras.
 *
 * Why one dark card and no comparison column: on the Ajax page Jordan took
 * the DIY column out (20 October) and kept a single dark card. So the
 * question is in the eyebrow, each item answers it from our side, and
 * nothing names another brand. The honest line under the heading (Wi-Fi is
 * fine for a spot or two) is what the cost guides tell homeowners anyway.
 *
 * What the old cards said lives on: tested and handed over in How it works
 * (step 4), the warranty here and in the FAQ, cable routes in How it works.
 */

type Item = { icon: ReactNode; title: string; detail: ReactNode };

const ICON = "h-5 w-5";

const ITEMS: Item[] = [
  {
    icon: <BatteryCharging className={ICON} />,
    title: "No batteries to charge",
    detail: "One cable carries the power and the picture, so there is nothing to recharge and no socket at each camera.",
  },
  {
    icon: <HardDrive className={ICON} />,
    title: "Keeps recording without Wi-Fi",
    detail: "Every camera records to the recorder in your home. If the broadband drops, the recording doesn't.",
  },
  {
    icon: <PlugZap className={ICON} />,
    title: "Nothing to unplug",
    // The quotes list a deep base with concealed cable termination per camera.
    detail: "The cable is sealed into the base behind each camera, so there is no plug to pull out at the door.",
  },
  {
    icon: <Moon className={ICON} />,
    title: "Colour at night",
    detail: <Gap q="Q2" tone="dark">ColorVu cameras, not a grey picture after dark.</Gap>,
  },
  {
    icon: <Wrench className={ICON} />,
    title: "Fitted and set up for you",
    detail: "Every camera aimed with you, tested and played back, and the app on every phone in the house.",
  },
  {
    icon: <ShieldCheck className={ICON} />,
    title: "Warranty on the fitting too",
    detail: <Gap q="Q5" tone="dark">The maker&apos;s warranty on the kit, plus [X] years on our work.</Gap>,
  },
];

export function HikvisionWiredSection() {
  return (
    // Full width, like the hero and the night section (Gus, 27 October: same
    // content, the dark background edge to edge instead of a card).
    <section id="wired" className="w-full scroll-mt-28 bg-[#0d1b2a] py-16 text-white md:py-24">
      <div className="container mx-auto">
        <div>
          <div className="max-w-2xl">
            <p className="eyebrow !text-[#ff6a5f]">Why not Wi-Fi cameras?</p>
            <h2 className="mt-4 h2-section text-white">Wired, so it keeps working.</h2>
            <p className="mt-4 text-pretty text-body text-white/70 md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
              A Wi-Fi camera is fine for one spot. For the front, the drive and the back on one system, wired is what keeps
              recording, night after night.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2 md:mt-12 lg:grid-cols-3 lg:gap-y-9">
            {ITEMS.map((i) => (
              <li key={i.title} className="flex gap-4">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                  {i.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold leading-tight text-white">{i.title}</h3>
                  <p className="mt-1.5 text-pretty text-body-sm text-white/70" style={{ lineHeight: "1.55" }}>
                    {i.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 md:mt-12">
            <a
              href="#quote"
              className="focus-ring-solid flex h-control-lg w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover sm:w-auto sm:inline-flex"
            >
              Get my free quote
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
