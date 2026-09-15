import { Cable, Magnet, MapPin, Navigation, Plug, Sparkles } from "lucide-react";
import { PermanentOrRemovable } from "./permanent-or-removable";

type FitItem = {
  icon: React.ReactNode;
  title: string;
  detail: string;
};

/**
 * How it is fitted.
 *
 * The vehicle conversations in the Superchat corpus (32 vehicles, 4 boats in
 * four weeks) are not lost on price. Two of fourteen quotes were. They are
 * lost on process: fifteen of thirty-six are still open, waiting for a photo
 * of the roof, a mounting proposal that never came, or the vehicle itself.
 * Seven customers asked to see a finished install before deciding.
 *
 * Titles are the customer's fear answered, not the part named: "The mount"
 * became "No drilling, no suction cups" because that is the question ("Do you
 * need to drill a hole in the ceiling or will it be done by suction?"), and
 * the same for the rest. "The finish" was vague; the fear behind it is a white
 * dish on a black car and height on the van.
 *
 * So this section answers, in the order they ask them, the questions the team
 * currently answers one WhatsApp message at a time: what holds it on, where the
 * cable goes, what powers it, what it looks like, whether it works while you
 * drive, and what changes on a boat. Every line comes from what the engineers
 * already say in the chat or from the cars page on installpros.co.uk.
 *
 * Same flat layout as WhatItRunsSection on the commercial page: an icon, a
 * title, a line, a rule. It carries facts, not claims, so it should not look
 * like a feature grid.
 *
 * Each detail is capped at three lines in the desktop three-column grid,
 * roughly 135 characters (Gus, 14 September). The facts that were cut to get
 * there (side-curtain airbags, headlinings, 240 V, OEM-style, campsites) are
 * still in the FAQ and in the comments below; the title carries the promise.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT THIS SECTION IS MISSING, AND WHY IT MATTERS MORE THAN THE COPY.
 *
 * Real photographs. "Can you send me some reviews/pics of motorhome installs??",
 * "Any pictures what it would look like on top of my motorhome?", "Ok do you
 * have any pictures of any completed work as my request?". Neither WordPress
 * page has one, and this one does not yet either. Will has said in the chat
 * that the team has done "a number of Klassen Mercedes Benz and Private hire
 * vehicles", so the photos exist on someone's phone. When they arrive they go
 * in a gallery directly above this section, one motorhome, one van, one car,
 * one boat, with the mount, the power and the finish in the caption.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const FIT: FitItem[] = [
  {
    icon: <Magnet className="h-5 w-5" />,
    title: "No drilling, no suction cups",
    // "Do you need to drill a hole in the ceiling or will it be done by
    // suction?", "we do not have roof rails but would like it fixed". Will, in
    // the chat: "Suction is ill advised", "we used heavy duty magnets".
    detail:
      "Heavy-duty magnets on a steel roof, clamps on rails or seams, a bonded plate where there is nothing to grip. Low profile, all metal.",
  },
  {
    icon: <Cable className="h-5 w-5" />,
    title: "Hidden cable, no leaks",
    // From the cars page: concealed routing that avoids airbags and water
    // entry points. Will: "The cable was then brought into the vehicle via the
    // boot."
    detail:
      "Routed inside the vehicle, clear of airbags and drainage channels, in through an existing grommet or the boot seal. Weatherproof.",
  },
  {
    icon: <Plug className="h-5 w-5" />,
    title: "Off grid and on hook-up",
    // "The most important thing is converting from 230V to the car's system.",
    // "We will be on EHU unless travelling to another site, what would you
    // suggest?". The Mini takes 12 to 48 V DC; no conversion.
    detail:
      "Runs on 12 to 48 V from a fused feed off your leisure battery. Works off grid and on hook-up, and never flattens the starter battery.",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Low profile and discreet",
    // The "InstallPros Vehicle Standard" block the team sends with vehicle
    // quotes, and "Is there anything we can do to account for the car being
    // black whilst the Starlink mini is white?".
    detail:
      "Black hardware on dark vehicles, colour-matched fixings where available, the dish placed where it shows least. Tested before handover.",
  },
  {
    icon: <Navigation className="h-5 w-5" />,
    title: "Nothing to fold away to drive",
    // "Can it be retractable when driving?", "Also want to just pull up at a
    // destination and it does all the work of finding g signal".
    detail:
      "Fixed in place and working while you drive on a Roam plan. Pull up and it has found the sky. Tunnels, car parks and dense trees cut it.",
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    // 8 of 30 conversations, the second most asked question in the segment:
    // "When I'm going to do it where will I bring the motorhome to get it
    // installed", "Come to me would be easier it's a big bus", "Please provide
    // quotes for engineer come out to our location". No town, no call-out
    // figure: an ad that named a town lost a sale ("No good to me it's a 4.5hr
    // drive. Advertised as Cheltenham"). Replaced the boats item on 14
    // September; boats get their own Marine landing.
    title: "Bring it to us, or we come to you",
    detail:
      "Motorhomes, campervans and cars usually come to us. Fleets and anything off the road, we come to. Any travel charge is in the quote.",
  },
];

export function VehicleFitSection() {
  return (
    <section id="how-its-fitted" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow">How it&apos;s fitted</p>
          {/* No intro paragraph. The one that was here told the reader what
              other customers ask, which is analyst voice, not customer voice,
              and it opened on "megabits", planting the speed question in the
              one section that does not answer it. The item titles below carry
              the promise on their own. */}
          <h2 className="mt-4 h2-section text-foreground">Fitted like it came with the vehicle.</h2>
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

        {/* Inside this section rather than its own, so it reads as the last
            question about the fit and the page keeps its grey/white rhythm. */}
        <PermanentOrRemovable />
      </div>
    </section>
  );
}
