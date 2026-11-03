import { Check } from "lucide-react";

/**
 * Rural homes that depend on the line (managed-research, section 1): home
 * workers and older people with little or no mobile signal, where copper
 * keeps being stolen or fibre keeps slipping (4 threads). Every competitor's
 * managed page is business only. One short section, not the whole page.
 *
 * Gus's photo (prompt 4, a home worker in a stone cottage kitchen) turns this
 * into a full-width band like the VoIP parents section when it exists.
 */

const POINTS = [
  "A 4G/5G backup if the dish drops.",
  "Someone to call, not a chat line.",
  "Need your landline number too? Ask us.",
];

export function ManagedRuralSection() {
  return (
    <section id="homes" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center md:gap-14">
          <div>
            <p className="eyebrow">For homes</p>
            <h2 className="mt-4 text-balance h2-section text-foreground">Working from home in the countryside?</h2>
            <p className="mt-4 text-pretty text-body text-muted-foreground md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
              When the connection is the only line out, it needs looking after too.
            </p>
          </div>
          <ul className="space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-2xl bg-background p-5">
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
