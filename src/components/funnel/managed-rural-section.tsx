import { Check } from "lucide-react";

/**
 * Rural homes that depend on the line (managed-research, section 1): home
 * workers and older people with little or no mobile signal, where copper
 * keeps being stolen or fibre keeps slipping (4 threads). Every competitor's
 * managed page is business only. One short section, not the whole page.
 *
 * A full-width band like the VoIP parents section. Photograph: Gus's render,
 * 4 November (prompt 4, second round): a desk by a farmhouse window on a wet
 * day, nobody there. Its left half is a plain wall, where the text sits;
 * phones get a square crop of the desk and window.
 */
const POINTS = [
  "A 4G/5G backup if the dish drops.",
  "Someone to call, not a chat line.",
  "Need your landline number too? Ask us.",
];

export function ManagedRuralSection() {
  return (
    <section id="homes" className="relative w-full scroll-mt-28 overflow-hidden bg-[#0e1013] text-white">
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet="/funnel/managed-homes-phone-640.webp 640w, /funnel/managed-homes-phone-828.webp 828w"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/funnel/managed-homes-2000.webp"
          srcSet="/funnel/managed-homes-1400.webp 1400w, /funnel/managed-homes-2000.webp 2000w"
          sizes="100vw"
          alt="A work desk by a farmhouse window on a rainy day, with sheep in the field outside"
          loading="lazy"
          decoding="async"
          className="absolute inset-x-0 top-0 h-[100vw] w-full object-cover object-center md:inset-0 md:h-full"
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
      {/* md up: dark over the wall on the left, clear over the desk. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, rgba(14,16,19,0.88) 0%, rgba(14,16,19,0.72) 34%, rgba(14,16,19,0.2) 60%, rgba(14,16,19,0) 78%)",
        }}
      />

      <div className="container relative mx-auto pb-16 pt-[86vw] md:flex md:min-h-[600px] md:items-center md:py-24">
        <div data-reveal className="max-w-xl">
          <p className="eyebrow !text-[#ff6a5f]">For homes</p>
          <h2 className="mt-4 text-balance h2-section text-white">Working from home in the countryside?</h2>
          <p className="mt-4 text-pretty text-body text-white/75 md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
            When the connection is the only line out, it needs looking after too.
          </p>
          <ul className="mt-6 space-y-3">
            {POINTS.map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm sm:p-5"
              >
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
