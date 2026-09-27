import { Magnet, Cable, BatteryCharging, KeyRound, Wifi, Undo2 } from "lucide-react";

type FitItem = { icon: React.ReactNode; title: string; detail: string };

/**
 * How it is fitted, on a boat.
 *
 * Built from the twelve marine conversations of 1 July to 21 September 2026
 * (superchat-analysis/marine-questions-for-will). Four raise mounting, four
 * raise cable entry, four raise 12 volts, three raise getting the engineer to
 * the boat, three raise which cabins need covering. Unlike a homeowner, a boat
 * owner usually arrives with a solution already:
 *
 *   "Hi I would not want it to be bolted down to the roof best to put as few
 *    holes in roof as possible Magnetic?"
 *   "I have a pole magnet so I only need a magnet on the roof"
 *   "The kit would fit in the dummy dome"
 *   "All cables will go the vent on frunt of boat as WiFi does now"
 *   "SKY put there cable through the window with connectors"
 *   "please confirm can work off 12 volt system"
 *   "Victron, 2 x solar panels and 4 batteries"
 *   "Can you give the engineer this code for the barrier for access to the
 *    marina please?"
 *
 * So each card confirms the customer's own answer rather than introducing
 * ours, and the sixth answers the one question in the corpus that nobody
 * replied to: what happens to the roof when the Starlink comes off again.
 *
 * Twelve volts is asked as a gate, not a detail ("please confirm ... before
 * he would go further"), so it sits third rather than at the end where the
 * vehicle page has it.
 *
 * Titles are the worry answered, not the part named, same rule as the other
 * two fit sections.
 *
 * PENDING: a photograph. Every one of these is a claim with nothing to look
 * at. Ask Will for the Tattenhall narrowboat or the Cuxton houseboat: the
 * dish on the roof, the cable going in, and the router inside.
 */
const FIT: FitItem[] = [
  {
    icon: <Magnet className="h-5 w-5" />,
    title: "No holes in the roof",
    detail:
      "Magnetic on steel, a pole or rail mount on GRP, or inside a dummy radar dome if you have one. Nothing bolted through the cabin top.",
  },
  {
    icon: <Cable className="h-5 w-5" />,
    title: "Cable in the way the last one came",
    detail:
      "Through the existing vent, a deck gland or the window with connectors, the same route your wifi or Sky cable already uses. Sealed where it enters.",
  },
  {
    icon: <BatteryCharging className="h-5 w-5" />,
    title: "Runs off 12 V, 24 V or shore power",
    detail:
      "A fused feed from the leisure batteries, alongside your solar and Victron kit. On the bank with hook-up, from 240 V. Both if you want both.",
  },
  {
    icon: <KeyRound className="h-5 w-5" />,
    title: "We come to the marina",
    detail:
      "Barriers, pontoons and gate codes are normal. Tell us the berth and how the engineer gets to it, and we fit at the boat.",
  },
  {
    icon: <Wifi className="h-5 w-5" />,
    title: "The cabins you use, covered",
    detail:
      "Router where you sit. A steel hull blocks wifi between cabins, so on a long boat we add a second point rather than promise the first reaches.",
  },
  {
    icon: <Undo2 className="h-5 w-5" />,
    title: "It comes off clean",
    detail:
      "A magnetic or clamped mount lifts off and leaves the roof as it was. If you sell the boat, the kit goes with you.",
  },
];

export function MarineFitSection() {
  return (
    <section id="how-its-fitted" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow">How it&apos;s fitted</p>
          <h2 className="mt-4 h2-section text-foreground">Fitted at the berth, without drilling the boat.</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FIT.map((f) => (
            <div key={f.title} className="border-t border-border pt-6">
              <span className="text-brand-icon" aria-hidden="true">{f.icon}</span>
              <h3 className="mt-4 text-lead font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-body-sm leading-[1.65] text-muted-foreground">{f.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
