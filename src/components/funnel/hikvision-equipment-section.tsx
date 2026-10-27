import type { ReactNode } from "react";
import { Cable, Cctv, HardDrive, Smartphone } from "lucide-react";
import { Gap } from "./hikvision-gap";

/**
 * The kit, in the place of the Ajax equipment cards
 * (security-equipment-section.tsx, the live Ajax page, so a copy).
 *
 * Icons instead of product shots on purpose: Hikvision's brand guidelines
 * want written permission (or authorised partner status, Jordan's question
 * 12) for its product images and logo. If InstallPros is a VASP partner, the
 * shots come unaltered from Hikvision's marketing portal; otherwise generic
 * renders with no logo (prompts-imagenes.md).
 *
 * The line under the cards answers "What's the difference between wireless
 * Bluetooth and hardwired please" and "do I even need a recorder", asked in
 * several forms; it is close to the one good staff answer in the chats. True
 * of a local recorder: it records without the internet, and only viewing
 * from outside waits for it to come back.
 */

type Item = { icon: ReactNode; title: string; detail: ReactNode };

const ITEMS: Item[] = [
  {
    icon: <Cctv className="h-12 w-12" strokeWidth={1.25} />,
    title: "Cameras",
    detail: <Gap q="Q2">Hikvision ColorVu, in white or black, for outside and in.</Gap>,
  },
  {
    icon: <HardDrive className="h-12 w-12" strokeWidth={1.25} />,
    title: "The recorder",
    detail: "Records every camera to a hard drive in your home, tucked away in a cupboard or the loft.",
  },
  {
    icon: <Cable className="h-12 w-12" strokeWidth={1.25} />,
    title: "One cable per camera",
    detail: "Power and picture down the same cable, so no batteries to charge and no Wi-Fi to drop.",
  },
  {
    icon: <Smartphone className="h-12 w-12" strokeWidth={1.25} />,
    title: "The app",
    detail: "Hik-Connect, on every phone you choose.",
  },
];

export function HikvisionEquipmentSection() {
  return (
    <section id="equipment" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <p className="eyebrow">Wired, so it doesn&apos;t drop out</p>
          <h2 className="mt-4 h2-section text-foreground">The kit, chosen and fitted for you.</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((e) => (
            <div key={e.title} className="rounded-xl border border-border bg-background p-6">
              <div
                className="flex aspect-[4/3] items-center justify-center rounded-lg border border-border text-brand-icon"
                style={{ background: "var(--eq-img-grad)" }}
                aria-hidden="true"
              >
                {e.icon}
              </div>
              <h3 className="mt-5 text-lg font-bold leading-tight text-foreground">{e.title}</h3>
              <p className="mt-2.5 text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                {e.detail}
              </p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-body text-muted-foreground">
          Wireless cameras still need a plug or a battery, and several on Wi-Fi can drop out. Wired cameras keep recording
          even when the broadband is down.
        </p>
      </div>
    </section>
  );
}
