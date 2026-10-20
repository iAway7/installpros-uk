import { Camera, Footprints, PawPrint, Vibrate } from "lucide-react";
import type { LayerCard } from "./security-layers-scene";
import { LazyLayersScene } from "./security-lazy";

/**
 * How the devices protect the home, first under the hero.
 *
 * Will's first question, 13 October 2026, in his words: "How do the devices
 * work together to protect them (benefits compared to contacts vs our
 * vibration sensors, extra layers of protection we provide) and verification
 * to avoid false alarms". And his sales language: "protect vulnerable entry
 * and exit points".
 *
 * The layout is Gus's, 15 October 2026: a room at night across the full
 * width with the heading over it and a break-in played on it
 * (SecurityLayersScene), then a dark band of four cards. The cards are named
 * after the devices and features (they were the tags of the old three-layer
 * cards), in the order a break-in meets them, and each lights up when its
 * alert arrives. Pet-friendly and fewer false alarms stay visible because Gus
 * asked for both: one is a card, the other closes the photo card.
 *
 * The photograph is generated (Gemini, from Gus's prompts): no Ajax image
 * rights, no real home. It is 1376 px wide, soft at full width on large
 * retina screens; a 2K or 4K version goes in at the same paths.
 *
 * 16 October: the first two cards say where the devices go rather than what
 * they are. The buyer arriving here often names the parts before we do (Hub 2,
 * MotionCam, DoorProtect in their first message), so explaining a vibration
 * sensor talks down to them; placement is the part they cannot buy online.
 * Pet-friendly and photo verification keep their wording: they answer real
 * objections.
 *
 * Fire and leaks are a line under the cards: they are not about anyone
 * getting in.
 */

/** litAt: the scene's phase whose alert lights the card (1 window forced,
 *  3 motion, 4 photo). */
const CARDS: LayerCard[] = [
  {
    icon: <Vibrate className="h-5 w-5" />,
    title: "Vibration sensors",
    detail: "Placed on the doors and windows a break-in would try first.",
    litAt: 1,
  },
  {
    icon: <Footprints className="h-5 w-5" />,
    title: "Motion detectors",
    detail: "Installed to cover the vulnerable entry and exit points.",
    litAt: 3,
  },
  {
    icon: <PawPrint className="h-5 w-5" />,
    title: "Pet-friendly",
    detail: "Set to ignore the dog or the cat, so the pets never set the alarm off.",
    litAt: 3,
  },
  {
    icon: <Camera className="h-5 w-5" />,
    title: "Photo verification",
    detail: "A photo arrives with the alert, so you know at once if it is real. Fewer false alarms.",
    litAt: 4,
  },
];

const BAND = "#070b10";

export function SecurityLayersSection() {
  return (
    <section id="protection" className="w-full scroll-mt-28 text-white" style={{ backgroundColor: BAND }}>
      <LazyLayersScene
        band={BAND}
        cards={CARDS}
        heading={
          <>
            <p className="eyebrow !text-[#ff6a5f]">Layers of protection</p>
            <h2 className="mt-4 max-w-[640px] h2-section text-white">
              Every way in,
              <br className="hidden sm:block" /> protected in layers.
            </h2>
          </>
        }
      />

      <div className="container mx-auto py-8 md:py-10">
        <p className="max-w-3xl text-body-sm leading-[1.65] text-white/55">
          Smoke, heat and leak detectors join the same system, so the app also tells you about a fire or a burst pipe.
        </p>
      </div>
    </section>
  );
}
