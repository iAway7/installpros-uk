import { Check } from "lucide-react";

/**
 * "And if fibre arrives next year?" (4g-5g-fibre-research, sections 1 and
 * 3). The objection that loses sales: 8 threads ask what happens to the kit
 * when fibre comes, and 18 were lost to fibre or a repaired line. No
 * competitor answers it.
 *
 * The three figures, with their sources (re-check before launch: Ofcom's
 * annual report is due around 19 November 2026):
 *   - 8 in 10 UK homes can get full fibre: 82%, Ofcom Connected Nations
 *     Spring 2026 (January 2026 data, published 13 May 2026).
 *   - 6 in 10 in rural Wales: 59%, Ofcom Wales, November 2025.
 *   - The Gigabit Broadband Voucher Scheme closed to new projects on
 *     31 August 2026 (gov.uk).
 * "A neighbour's permission" is the Openreach wayleave, needed before a
 * cable crosses someone else's land.
 *
 * Never "we can get you fibre" or a fibre date. Connecting fibre to the same
 * router and keeping the old line as backup wait on Will's questions 4 and
 * 10. The Starlink plan is between the customer and Starlink.
 */

const FIGURES: { value: string; label: string }[] = [
  { value: "8 in 10", label: "UK homes can get full fibre" },
  { value: "6 in 10", label: "rural homes in Wales can" },
  { value: "Closed", label: "gigabit vouchers, since 31 August 2026" },
];

const POINTS = [
  "Don't wait without internet. Starlink or 4G/5G works now.",
  "When fibre comes, we connect it to the same router.",
  "Keep the old line as your backup, or stop it. Your Starlink plan is with Starlink, not with us.",
];

export function ConnectivityFibreSection() {
  return (
    <section id="fibre" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Waiting for fibre?</p>
          <h2 className="mt-4 text-balance h2-section text-foreground">And if fibre arrives next year?</h2>
        </div>

        {/* One row at every width: stacked on phones the three cards took a
            whole screen for three numbers. */}
        <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-3 gap-2 sm:gap-4 md:mt-12">
          {FIGURES.map((f, i) => (
            <li
              key={f.value}
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
              className="flex flex-col items-center rounded-2xl bg-background px-2 py-4 text-center sm:px-5 sm:py-6"
            >
              <span className="whitespace-nowrap text-[22px] font-bold leading-none tracking-[-0.02em] text-foreground tabular-nums sm:text-[34px] md:text-[40px]">
                {f.value}
              </span>
              <span className="mt-2 text-balance text-caption text-muted-foreground sm:text-body-sm leading-snug">{f.label}</span>
            </li>
          ))}
        </ul>

        <p data-reveal className="mx-auto mt-6 max-w-xl text-center text-body-sm text-muted-foreground">
          Source: Ofcom, January 2026 data; gov.uk.
        </p>

        <div className="mx-auto mt-10 grid max-w-5xl gap-8 md:mt-12 md:grid-cols-2 md:items-center md:gap-12">
          {/* Gus's Gemini render, 9 November (prompt 4): a lane, a pole, a
              cottage at the near end. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-reveal
            src="/funnel/connectivity-lane-1440.webp"
            srcSet="/funnel/connectivity-lane-960.webp 960w, /funnel/connectivity-lane-1440.webp 1440w"
            sizes="(min-width: 768px) 480px, 100vw"
            alt="A country lane with a telegraph pole and a stone cottage at the end"
            loading="lazy"
            decoding="async"
            className="aspect-[16/9] w-full rounded-2xl object-cover"
          />
          <div>
            <p data-reveal className="text-pretty text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
              Fibre plans slip, and a house at the end of a lane often needs a neighbour&apos;s permission for the cable.
            </p>
            <ul className="mt-6 space-y-3">
              {POINTS.map((p, i) => (
                <li
                  key={p}
                  data-reveal
                  style={{ transitionDelay: `${i * 80}ms` }}
                  className="flex items-start gap-3 rounded-2xl bg-background p-5"
                >
                  <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <span className="text-pretty text-body text-foreground" style={{ lineHeight: "1.5" }}>
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
