import { Check } from "lucide-react";

/**
 * Written to the son or daughter buying for a parent (voip-research, section
 * 1): the buyer is often not the user, parents aged 76 to 90, and "too
 * technical / too old" was the top worry (9 buyers). Only BT and one
 * Plexatalk article write to them; no Starlink installer does.
 *
 * "Or our engineer does it" waits on Will (question 6).
 */

const POINTS = [
  "It arrives ready. They plug it in, or our engineer does it.",
  "Same number, a phone that works like the old one.",
  "Calls can go to your mobile too, if they don't pick up.",
  "You can message us on WhatsApp for them.",
];

export function VoipParentSection() {
  return (
    <section id="parents" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center md:gap-14">
          <div>
            <p className="eyebrow">Buying for a parent</p>
            <h2 className="mt-4 text-balance h2-section text-foreground">Setting this up for mum or dad?</h2>
            <p className="mt-4 text-pretty text-body text-muted-foreground md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
              Most people who ask us are sorting it out for a parent. So:
            </p>
          </div>
          <ul className="space-y-4">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-2xl bg-secondary p-5">
                <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <span className="text-pretty text-body text-foreground" style={{ lineHeight: "1.5" }}>
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
