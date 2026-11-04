import { ArrowRight, Check } from "lucide-react";

/**
 * Business phones (voip-research, section 1): 10 of the 28 VoIP buyers were
 * businesses (a pub, a nursery, a farm, a garage, an MOT centre...), and
 * what they asked for was different: transfer and divert to mobiles,
 * several lines, desk phones, taking over a system they already have.
 *
 * The list is Will's business WordPress page plus what the chats asked for,
 * and waits on his question 10.
 */

const POINTS = [
  "Several lines that can call at the same time",
  "Transfer calls between phones, divert to mobiles",
  "Answer on your mobile with the app",
  "Desk phones or cordless",
];

export function VoipBusinessSection() {
  return (
    <section id="business" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center md:gap-14">
          <div data-reveal>
            <p className="eyebrow">For businesses</p>
            <h2 className="mt-4 text-balance h2-section text-foreground">Phones for your business.</h2>
            <p className="mt-4 text-pretty text-body text-muted-foreground md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
              Keep your business number. Already have a phone system? Tell us what it is and we&apos;ll say what can stay.
            </p>
            <a
              href="#quote"
              className="focus-ring mt-6 inline-flex min-h-[44px] items-center gap-1.5 rounded-md text-body font-semibold text-primary underline-offset-4 hover:underline"
            >
              Get a quote for your business
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
          <ul className="space-y-3">
            {POINTS.map((p, i) => (
              <li key={p} data-reveal style={{ transitionDelay: `${i * 80}ms` }} className="flex items-start gap-3 rounded-2xl bg-secondary p-5">
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
