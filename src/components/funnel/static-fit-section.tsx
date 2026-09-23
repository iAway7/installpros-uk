import { Anchor, Eye, PanelTop, Radio, ShieldCheck, TreePine } from "lucide-react";

type FitItem = { icon: React.ReactNode; title: string; detail: string };

/**
 * How it is fitted, on a unit that does not move.
 *
 * The headline difference from the vehicle page, and the reason this is not a
 * copy of VehicleFitSection: twenty four of the 175 static conversations raise
 * mounting and NOT ONE of the 175 mentions drilling, screws or damage to the
 * shell. On the vehicle page that worry is the first thing a prestige car
 * owner raises. Here nobody cares.
 *
 * What they worry about instead, in their words: whether it will look out of
 * place on a park where every unit is visible from every other one ("My site
 * are very particular about what and how things are seen so it has to be neat
 * etc!!"), and whether they are allowed to fix anything to the unit at all
 * ("We are in a park home .we can't fix anything to the building as it will
 * affect the builders warranty").
 *
 * The recurring frame is reuse. There is already a Sky dish, an aerial, a pole
 * or a bracket on the corner post, and several ask whether that fixing can
 * carry this instead: "Whats the difference between the weight of your
 * equipment and a satellite dish ? Its had a dish on it before".
 *
 * Titles are the worry answered, not the part named, same rule as the vehicle
 * section.
 *
 * PENDING: a photograph. Every one of these six is a claim with nothing to
 * look at, and the analysis asks for a picture of a fitted static showing what
 * it looks like from the next pitch. The vehicle page has FinishedInstallSection
 * for exactly this and it is not here, because there is no static photo to put
 * in it. Ask Will for one of each: a caravan on the old dish bracket, a park
 * home on a pole clear of the unit, and the view from a neighbouring pitch.
 */
const FIT: FitItem[] = [
  {
    icon: <Anchor className="h-5 w-5" />,
    title: "It usually reuses what is there",
    detail:
      "The old Sky bracket, the aerial pole or the corner post. A Mini is lighter than the dish that was there.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Nothing fixed to a park home",
    detail:
      "Where the warranty forbids fixings, it goes on its own pole or the decking, clear of the unit.",
  },
  {
    icon: <Eye className="h-5 w-5" />,
    title: "Neat from the next pitch",
    detail:
      "Sited where it shows least, cable clipped tight, nothing loose outside.",
  },
  {
    icon: <TreePine className="h-5 w-5" />,
    title: "It needs open sky, not height",
    detail:
      "Trees are the only thing that stops it. Send a photo of the pitch and we say yes or no.",
  },
  {
    icon: <PanelTop className="h-5 w-5" />,
    title: "Mains power, router where you sit",
    detail:
      "Run from the unit's own supply, router placed for the rooms you use.",
  },
  {
    icon: <Radio className="h-5 w-5" />,
    title: "If the park wants asking, we help",
    detail:
      "Most do not ask. Where a site wants notice, we put it in writing.",
  },
];

export function StaticFitSection() {
  return (
    <section id="how-its-fitted" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow">How it&apos;s fitted</p>
          <h2 className="mt-4 h2-section text-foreground">Fitted so the park barely notices.</h2>
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
