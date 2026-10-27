import type { ReactNode } from "react";
import { Cable, Cctv, HardDrive, Smartphone } from "lucide-react";
import { Gap } from "./hikvision-gap";

/**
 * The exact camera and the box it records to. Started as a copy of the Ajax
 * equipment cards (security-equipment-section.tsx, the live Ajax page);
 * reworked 27 October from the chats (hikvision-research/
 * conversaciones-decision.md, sections 2 and 5), Gus approving.
 *
 *   - What people asked to see was the actual camera: model, make and a
 *     photo (9 threads: "Are you okay to show me the camera the exact ones
 *     we'll get with the purchase"). In 2 purchases the yes came within a day
 *     of staff sending a picture of the exact camera.
 *   - The recorder puzzled people ("What is nvr", "So does it come with a
 *     recording box??", "Do I need a monitor?"), so it is "the box", where it
 *     goes, and no screen needed.
 *   - The Wi-Fi line that sat under the cards moved to the wired card.
 *
 * PHOTOS: Hikvision product shots only if InstallPros is an authorised
 * partner (question 12), unaltered from Hikvision's portal; otherwise a
 * render with no logo, or InstallPros's own photo of the camera it fits.
 * "The make and model are on your quote" holds only once the quote template
 * names them (24 of 63 camera quotes never say Hikvision): a team change.
 */

type Item = { icon: ReactNode; title: string; detail: ReactNode; photo?: string };

const ICON = "h-12 w-12";

const ITEMS: Item[] = [
  {
    icon: <Cctv className={ICON} strokeWidth={1.25} />,
    title: "The camera",
    detail: <Gap q="Q2">Hikvision ColorVu [model], in white or black, for outside and in.</Gap>,
    photo: "Product photo of the standard camera (Q12)",
  },
  {
    icon: <HardDrive className={ICON} strokeWidth={1.25} />,
    title: "The box",
    detail: "The recorder. It sits by your router, in a cupboard or the loft, and records every camera to a hard drive.",
    photo: "Photo of the recorder",
  },
  {
    icon: <Cable className={ICON} strokeWidth={1.25} />,
    title: "One cable per camera",
    detail: "Power and picture down the same cable, from the box to each camera.",
  },
  {
    icon: <Smartphone className={ICON} strokeWidth={1.25} />,
    title: "No screen needed",
    detail: "The Hik-Connect app on your phone is the screen. A monitor is optional.",
  },
];

export function HikvisionEquipmentSection() {
  return (
    <section id="equipment" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow">What you get</p>
          <h2 className="mt-4 h2-section text-foreground">
            The exact camera,
            <br className="hidden sm:block" /> and the box it records to.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((e) => (
            <div key={e.title} className="rounded-xl border border-border bg-background p-6">
              <div
                className="relative flex aspect-[4/3] items-center justify-center rounded-lg border border-border text-brand-icon"
                style={{ background: "var(--eq-img-grad)" }}
              >
                <span aria-hidden="true">{e.icon}</span>
                {e.photo && (
                  <span className="absolute inset-x-2 bottom-2 text-center text-[11px] leading-tight text-foreground/70">
                    <Gap q="Q8">{e.photo}</Gap>
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-lg font-bold leading-tight text-foreground">{e.title}</h3>
              <p className="mt-2.5 text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                {e.detail}
              </p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-body text-muted-foreground">
          <Gap q="Team: quote template">The make and model of every camera are on your quote, so you know exactly what you are getting.</Gap>
        </p>
      </div>
    </section>
  );
}
