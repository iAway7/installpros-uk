import { Globe, Navigation, PauseCircle, Gauge } from "lucide-react";

type Plan = { name: string; price: string; per: string; data: string; detail: string };

/**
 * The two Roam prices are Starlink's, copied from the text the team sends in
 * the chat: "£50/month, 50GB (extra data £1/GB); £96/month, Unlimited data.
 * Plans can be paused at any time and are billed every 30 days. Roam supports
 * mobile and temporary use, including travel and vehicle-based connections (up
 * to 2 months abroad). Service is deprioritised; typical speeds range from 30
 * to 250 Mbps." They are on this page because customers ask for the monthly
 * cost in the same breath as the install, and because Starlink publishes them.
 * They are not our prices and they will drift: check starlink.com before
 * touching the figures here.
 */
const PLANS: Plan[] = [
  {
    name: "Roam 50GB",
    price: "£50",
    per: "a month",
    data: "50GB, then £1 per GB",
    detail: "Weekends and holidays. Top up by the gigabyte, or step up to unlimited.",
  },
  {
    name: "Roam Unlimited",
    price: "£96",
    per: "a month",
    data: "Unlimited data",
    detail: "Full-timers, remote workers and anyone who does not want to count gigabytes.",
  },
];

type Fact = { icon: React.ReactNode; title: string; detail: string };

const FACTS: Fact[] = [
  {
    icon: <Navigation className="h-5 w-5" />,
    title: "Works while you drive",
    // "Will it work when the vehicle is in motion?" is asked in nearly every
    // motorhome conversation. Roam is the plan that allows it.
    detail: "Passengers are online on the road, not just when you park up.",
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Up to two months abroad",
    detail: "Across the Channel and beyond, for two months at a time.",
  },
  {
    icon: <PauseCircle className="h-5 w-5" />,
    title: "Pause it when parked up",
    // The standby charge Starlink applies to a paused plan is quoted four
    // different ways in the chat log, so no figure here until Will confirms one.
    detail: "Billed every 30 days. Pause from the app for the months it sits on the drive.",
  },
  {
    icon: <Gauge className="h-5 w-5" />,
    title: "Honest about speed",
    // Roam is deprioritised behind fixed-site plans. A page that promises the
    // residential number to a motorhome would be the first thing the customer
    // catches us out on.
    detail: "Expect 30 to 250 Mbps: enough for calls and streaming, less than a dish on a house.",
  },
];

/**
 * The plan on the road.
 *
 * "Which plan do I need?" and "what does it cost a month?" come up in the
 * vehicle conversations as often as the install itself, and the current pages
 * on installpros.co.uk answer with a paragraph. This section answers with the
 * two Starlink prices and the four things people actually ask about them:
 * motion, abroad, pausing and speed.
 *
 * It also makes the two payments explicit. A recurring source of friction in
 * the chat log is the customer who thought the install price included the
 * subscription, or the subscription included the install. Neither does, and
 * saying so here costs nothing.
 *
 * The install price itself is not on this page, by Will's decision.
 */
export function RoadPlansSection() {
  return (
    <section id="roam-plans" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow">The plan on the road</p>
          <h2 className="mt-4 h2-section text-foreground">Roam is the Starlink plan built for vehicles.</h2>
          <p className="mt-5 text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            You pay Starlink for the plan and us for the fitting. Two payments, not one. Change
            plan any time from the Starlink app.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {PLANS.map((p) => (
            <div key={p.name} className="rounded-xl border border-border bg-background p-6 md:p-8">
              <p className="text-label font-semibold uppercase tracking-[0.14em] text-muted-foreground">{p.name}</p>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="stat-xl text-foreground">{p.price}</span>
                <span className="text-body text-muted-foreground">{p.per}</span>
              </p>
              <p className="mt-2 text-lead font-semibold text-foreground">{p.data}</p>
              <p className="mt-3 text-body-sm leading-[1.65] text-muted-foreground">{p.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.title} className="border-t border-border pt-6">
              <span className="text-brand-icon" aria-hidden="true">{f.icon}</span>
              <h3 className="mt-3 text-lead font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-body-sm leading-[1.65] text-muted-foreground">{f.detail}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-3xl text-caption leading-[1.6] text-muted-foreground">
          Starlink&apos;s prices, paid to Starlink, and they can change. If the vehicle mostly stays
          at one address, ask us about a Residential plan instead.
        </p>
      </div>
    </section>
  );
}
