import { Anchor, Waves, Navigation } from "lucide-react";

type Mooring = { icon: React.ReactNode; title: string; who: string; detail: string };

/**
 * Moored, mostly moored, or cruising. The first section under the hero.
 *
 * Eight of the twelve marine conversations (1 July to 21 September 2026,
 * superchat-analysis/marine-questions-for-will) volunteer their mooring status
 * before anyone asks, usually in the first or second message:
 *
 *   "I'm permanently moored here. Don't move. I'm connected to electricity on
 *    the bank"
 *   "Moored 98% odd weekend out done 2 days out this year but do need to be
 *    able to turn boat around for cleaning"
 *   "Not moored in a marina as yet, just cruising ..."
 *
 * They are right that it decides the answer, so the page splits on it in
 * their own frame. Three short answers, in the order the traffic arrives:
 * most of the twelve are the first two, and both customers who bought were
 * moored.
 *
 * The third column is written with care. Not one of the twelve reports
 * Starlink in use on a moving boat, so it promises the plan and the mount and
 * nothing about being under way at sea. Canals and rivers is the evidence
 * ("we do go cruising on the canals"); open water is not.
 *
 * The base is twelve conversations. No number from that corpus appears in the
 * copy, on purpose. The report says: directions, not statistics.
 */
const MOORINGS: Mooring[] = [
  {
    icon: <Anchor className="h-5 w-5" />,
    title: "Moored, and it stays put",
    who: "Houseboats, liveaboards, a berth you never leave.",
    // The houseboat at Cuxton: six rooms, Sky, a Ring camera, a child doing
    // homework. A household with an access problem, not a vessel.
    detail:
      "Treated like a home that happens to float. Residential plan, router where you sit, shore power if you have it. The easiest install we do.",
  },
  {
    icon: <Waves className="h-5 w-5" />,
    title: "Moored, out a few days at a time",
    who: "A marina berth or a club mooring, weekends and holidays away.",
    // Wroxham: "we take it out, usually for a few days at a time but for
    // installation purposes we can easily arrange for it to be at the Yacht
    // club". And the boat that has to be turned round for cleaning.
    detail:
      "Fitted at the berth. The mount holds when you go out and when the boat is turned in its berth, and the plan can be paused for the months it sits.",
  },
  {
    icon: <Navigation className="h-5 w-5" />,
    title: "Cruising the canals and rivers",
    who: "Narrowboats on the network, no fixed mooring yet.",
    // "It is a 58ft narrowboat and we do go cruising on the canals". Roam is
    // the plan; nothing here claims it works at speed or offshore.
    detail:
      "A Roam plan that follows the boat, on 12 V so it runs off the leisure batteries. We meet you where the boat is that week.",
  },
];

export function MarineMooringSection() {
  return (
    <section id="moored-or-cruising" className="w-full scroll-mt-28 bg-background py-20 md:py-32">
      <div className="container mx-auto">
        <div className="mb-16 max-w-2xl">
          <p className="eyebrow">Start here</p>
          <h2 className="mt-4 h2-section text-foreground">Does the boat move? That decides most of it.</h2>
          <p className="mt-5 text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            Tell us which of these you are and the plan, the power and the mount follow from it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-14 gap-y-14 md:grid-cols-3">
          {MOORINGS.map((m) => (
            <div key={m.title}>
              <span className="text-brand-icon" aria-hidden="true">{m.icon}</span>
              <h3 className="mt-4 text-lead font-semibold text-foreground">{m.title}</h3>
              <p className="mt-1 text-body-sm font-medium text-foreground">{m.who}</p>
              <p className="mt-2 text-body-sm leading-[1.65] text-muted-foreground">{m.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
