import type { ReactNode } from "react";
import { CalendarCheck, PackageCheck, PhoneCall, Repeat } from "lucide-react";

/**
 * The terms, in four lines (voip-research, section 1, Gus, 4 November): the
 * contract was the second most asked question (11 chats) and which calls are
 * included the third (10). It also went wrong: one buyer told "30 day
 * rolling" was sent a 36-month contract. Only the FAQ answered it before.
 *
 * No prices, as on every landing. Assumes Will's answers, from his own
 * templates and WordPress page (voip-research/supuestos-para-will.md):
 * monthly rolling with no cancel fee (question 8), UK landlines and mobiles
 * included (9), the transfer free (2), configured before it's posted (6).
 * No "plug and play": extra handsets that could not call out proved it wrong.
 */

type Item = { icon: ReactNode; title: string; detail: string };

const ICON = "h-5 w-5";

const ITEMS: Item[] = [
  { icon: <CalendarCheck className={ICON} />, title: "Month to month", detail: "No long contract, no fee to leave." },
  { icon: <PhoneCall className={ICON} />, title: "UK calls included", detail: "To landlines and mobiles." },
  { icon: <Repeat className={ICON} />, title: "Your number moved free", detail: "We do the paperwork." },
  { icon: <PackageCheck className={ICON} />, title: "Set up before it arrives", detail: "Configured by us before it's posted." },
];

export function VoipTermsSection() {
  return (
    <section id="terms" className="w-full scroll-mt-28 bg-background py-16 md:py-20">
      <div className="container mx-auto">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">No surprises</p>
          <h2 className="mt-4 text-balance h2-section text-foreground">Simple terms.</h2>
        </div>

        <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-4 lg:gap-4">
          {ITEMS.map((t, i) => (
            <li
              key={t.title}
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
              className="flex items-center gap-4 rounded-2xl border border-border p-5 lg:flex-col lg:items-start lg:gap-0 lg:p-6"
            >
              <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {t.icon}
              </span>
              <div>
                <h3 className="text-lg font-bold leading-tight text-foreground lg:mt-4">{t.title}</h3>
                <p className="mt-1 text-pretty text-body-sm text-muted-foreground lg:mt-1.5" style={{ lineHeight: "1.55" }}>
                  {t.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
