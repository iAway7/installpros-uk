import { Check } from "lucide-react";

/**
 * Written to the son or daughter buying for a parent (voip-research, section
 * 1): the buyer is often not the user, parents aged 76 to 90, and "too
 * technical / too old" was the top worry (9 buyers). Only BT and one
 * Plexatalk article write to them; no Starlink installer does.
 *
 * Full width with the photograph as the background (Gus, 3 November; it was
 * a rounded photo beside the list). Gus's Gemini render (prompt 4): a
 * daughter showing her father the phone in a farmhouse kitchen, faces away.
 * From md up the text sits on the left, over the daughter's back, darkened;
 * the phone and his hands stay clear on the right. Phones get a square crop
 * on the hands and the phone at the top, the text below on the dark.
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
    <section id="parents" className="relative w-full scroll-mt-28 overflow-hidden bg-[#0e1013] text-white">
      <picture>
        <source media="(max-width: 767px)" srcSet="/funnel/voip-parents-phone-640.webp 640w, /funnel/voip-parents-phone-828.webp 828w" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/funnel/voip-parents-2000.webp"
          srcSet="/funnel/voip-parents-1400.webp 1400w, /funnel/voip-parents-2000.webp 2000w"
          sizes="100vw"
          alt="A daughter showing her father how to use a cordless phone at a farmhouse kitchen table"
          loading="lazy"
          decoding="async"
          className="absolute inset-x-0 top-0 h-[100vw] w-full object-cover object-center md:inset-0 md:h-full md:object-center"
        />
      </picture>
      {/* Phones: clear over the photo, dark from where the text starts. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(to bottom, rgba(14,16,19,0.1) 0px, rgba(14,16,19,0.15) 55vw, rgba(14,16,19,0.9) 88vw, #0e1013 100vw)",
        }}
      />
      {/* md up: dark on the left under the text, clear over the phone. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, rgba(14,16,19,0.9) 0%, rgba(14,16,19,0.78) 34%, rgba(14,16,19,0.25) 60%, rgba(14,16,19,0) 78%)",
        }}
      />

      <div className="container relative mx-auto pb-16 pt-[86vw] md:flex md:min-h-[640px] md:items-center md:py-24">
        <div className="max-w-xl">
          <p className="eyebrow !text-[#ff6a5f]">Buying for a parent</p>
          <h2 className="mt-4 text-balance h2-section text-white">Setting this up for mum or dad?</h2>
          <p className="mt-4 text-pretty text-body text-white/75 md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
            Most people who ask us are sorting it out for a parent. So:
          </p>
          <ul className="mt-6 space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm sm:p-5">
                <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-success-bright" />
                <span className="text-pretty text-body text-white" style={{ lineHeight: "1.5" }}>
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
