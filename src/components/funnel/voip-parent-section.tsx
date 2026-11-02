import { Check } from "lucide-react";

/**
 * Written to the son or daughter buying for a parent (voip-research, section
 * 1): the buyer is often not the user, parents aged 76 to 90, and "too
 * technical / too old" was the top worry (9 buyers). Only BT and one
 * Plexatalk article write to them; no Starlink installer does.
 *
 * Photograph: Gus's Gemini render, 3 November (prompt 4): a daughter showing
 * her father the phone in a farmhouse kitchen, faces away. On phones it sits
 * between the heading and the list; from md up, on the left.
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
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-center md:gap-14">
          <div className="md:order-2">
            <p className="eyebrow">Buying for a parent</p>
            <h2 className="mt-4 text-balance h2-section text-foreground">Setting this up for mum or dad?</h2>
            <p className="mt-4 text-pretty text-body text-muted-foreground md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
              Most people who ask us are sorting it out for a parent. So:
            </p>
            <ul className="mt-6 hidden space-y-3 md:block">
              {POINTS.map((p) => (
                <Point key={p} text={p} />
              ))}
            </ul>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/funnel/voip-parents-1400.webp"
            srcSet="/funnel/voip-parents-900.webp 900w, /funnel/voip-parents-1400.webp 1400w"
            sizes="(min-width: 768px) 50vw, 100vw"
            alt="A daughter showing her father how to use a cordless phone at a farmhouse kitchen table"
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full rounded-3xl object-cover md:order-1 md:aspect-[4/3]"
          />
          <ul className="space-y-3 md:hidden">
            {POINTS.map((p) => (
              <Point key={p} text={p} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Point({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-secondary p-5">
      <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-success" />
      <span className="text-pretty text-body text-foreground" style={{ lineHeight: "1.5" }}>
        {text}
      </span>
    </li>
  );
}
