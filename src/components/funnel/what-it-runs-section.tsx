import { Camera, CreditCard, Lock, Network, Phone, Wifi } from "lucide-react";

type SystemItem = {
  icon: React.ReactNode;
  title: string;
  detail: string;
};

/**
 * Every line here answers something a commercial customer actually typed into
 * the chat. Nobody asks how many megabits they will get. They ask whether the
 * equipment they already own will keep working.
 *
 * Two of these are written narrower than they could be, on purpose.
 *
 * CCTV. Starlink's upload is a fraction of its download, and one of the sites
 * in the chat log is a poultry farm with forty cameras. "CCTV works" is the
 * kind of promise that falls apart on install day, so this says we size the
 * upload against the camera count and the retention instead. It is a better
 * line anyway: no competitor is telling anyone that.
 *
 * VPN and phone numbers. Same treatment as the FAQs. What is true always goes
 * on the page; the part that depends on the customer's own kit is settled at
 * survey rather than promised here.
 */
const SYSTEMS: SystemItem[] = [
  {
    icon: <CreditCard className="h-5 w-5" />,
    // Will floated "POS systems" and hedged on it. Kept the plain title,
    // because a barber says "the card machine" and "the till", not "POS", and
    // this section exists to use their words. EPOS goes in the body instead, so
    // whoever does think in trade terms still finds themselves here.
    title: "Taking payments",
    // "So we can connect payment devices", "connecting our till systems".
    detail: "Card terminals, cloud tills, EPOS and your booking system, on their own network away from the WiFi you hand to customers.",
  },
  {
    icon: <Wifi className="h-5 w-5" />,
    // Was "Customers on site", which Will read as something else before the
    // body corrected him. If the title needs the body to explain it, it is the
    // wrong title.
    title: "Guest WiFi",
    // "to be able to offer WiFi to customers as well as connecting our till systems".
    detail: "Coverage where your customers actually sit, with access points placed around the building rather than where the cable happens to arrive.",
  },
  {
    icon: <Camera className="h-5 w-5" />,
    title: "Cameras and access",
    // "the internet is connected to our access gates for customers", and a
    // poultry farm running forty cameras.
    detail: "Gates, barriers and CCTV, including remote viewing. We size the upload against how many cameras you run and how long you keep the footage.",
  },
  {
    icon: <Phone className="h-5 w-5" />,
    title: "Phones",
    // "how would you run a phone off this and could I keep my buisness phone
    // number". Portability depends on the number and the current provider.
    detail: "Handsets over the connection, and we check whether your existing number can move before you commit to anything.",
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: "Working off-site",
    // "apparently they said this would not work with Starlink, looking at what
    // the workaround is". The blocker is CGNAT.
    detail: "Cloud apps, remote desktops and VPNs. The standard service uses shared addressing, which some VPNs will not cross, and a static IP fixes it.",
  },
  {
    icon: <Network className="h-5 w-5" />,
    // Will's wording, and better than "More than one building": it covers the
    // yard as well as the second unit, and several sites in the chat log are a
    // yard.
    title: "Full site coverage",
    // "Would the one satellite give internet coverage for the properties
    // surrounding our building ?"
    detail: "Outbuildings, yards and neighbouring units linked back to the main dish, which usually costs less than a second subscription.",
  },
];

/**
 * What the connection actually runs.
 *
 * The commercial page answers speed, price, coverage and paperwork, and until
 * now it answered nothing about the equipment already sitting in the building.
 * That is the gap the chat log is loudest about: across roughly eighty
 * commercial conversations, the questions are card machines, tills, gates,
 * cameras, phones, VPNs and how many people can be on at once. Not megabits.
 *
 * Placed straight after the sectors grid. "Who this is for" running into "what
 * it keeps working for you" reads as one thought, and it puts the answer well
 * above the FAQ, where only a determined reader would find it.
 *
 * Deliberately flatter than the sector cards directly above it: an icon, a
 * title, a line, and a rule. Two six-card grids in a row would make the page
 * feel like it was repeating itself.
 */
export function WhatItRunsSection() {
  return (
    <section id="what-it-runs" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow">Your systems</p>
          <h2 className="mt-4 h2-section text-foreground">Everything on site keeps running.</h2>
          <p className="mt-5 text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            Businesses do not ask us how many megabits they will get. They ask whether the kit they
            already have will still work. It does, and this is how we set it up.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {SYSTEMS.map((s) => (
            <div key={s.title} className="border-t border-border pt-6">
              <span className="text-brand-icon" aria-hidden="true">{s.icon}</span>
              <h3 className="mt-3 text-lead font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-body-sm leading-[1.65] text-muted-foreground">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
