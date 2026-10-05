import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { Button } from "@/components/system/button";

/**
 * "How it works" for the segment landings: vehicles, statics, boats.
 *
 * NOT for /install-quote. That page is live in Google Ads and the CRO case is
 * measured on it; it keeps its own sections and nothing here may be imported
 * there. Sharing between the three segment landings is fine and intended: they
 * are not live in Ads, and three copies of this would drift.
 *
 * ── WHY IT LOOKS LIKE THIS ──────────────────────────────────────────────────
 * The first version on all three pages was four columns of text on white,
 * each under a hairline, and it read as nothing: no edge told one step from
 * the next except the gap, and a long step made the whole row ragged. Five
 * reference layouts were compared on 2026-10-05 and they agree on four things
 * that version lacked, which is what this is built from:
 *
 *   1. A centred heading block: eyebrow, H2, one line of support. The steps
 *      hang from something.
 *   2. Each step is a CARD with something to look at. A numbered tile
 *      here, a photograph where we have one (see `image` below).
 *   3. The step number sits in the tile, separate from the title. Since
 *      2026-10-05 there is no icon and no STEP 1 label: the number is the one
 *      thing above the title.
 *   4. Something joins the steps: a circled arrow between the cards from lg.
 *      Below lg the cards stack and the arrows go, because an arrow pointing
 *      right at a card that is actually below is wrong.
 *
 * ── THE IMAGE SLOT, AND THE RULE ON IT ──────────────────────────────────────
 * Two of the five references put a screenshot or an illustration in every
 * card. We do not have one for most steps: vehicles has a few real
 * photographs, statics and boats have none. `image` takes a REAL photograph of
 * that step when one exists and the tile shows otherwise. No stock, no
 * illustration standing in for a photo we have not got; the pages elsewhere
 * are built on the promise that every picture is ours. When Will's "router
 * where it ends up" shot arrives it goes straight into the vehicle page's
 * first step, which is the kind of thing this slot is for.
 *
 * No JavaScript. Pure layout, nothing to hydrate.
 */

export type ProcessStep = {
  title: string;
  detail: string;
  /** No longer drawn: the tile shows the step number since 2026-10-05. Kept
   *  optional so the three data files need not change in the same commit. */
  icon?: ReactNode;
  /** A real photograph of this step. Replaces the tile. Never stock. */
  image?: { src: string; srcSet?: string; alt: string };
};

export type ProcessStepsSectionProps = {
  id?: string;
  eyebrow: string;
  heading: string;
  subline?: string;
  steps: ProcessStep[];
  cta: { label: string; href: string };
};

export function ProcessStepsSection({
  id = "how-it-works",
  eyebrow,
  heading,
  subline,
  steps,
  cta,
}: ProcessStepsSectionProps) {
  return (
    <section id={id} className="w-full scroll-mt-28 bg-background py-20 md:py-32">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-4 h2-section text-foreground">{heading}</h2>
          {subline && (
            <p className="mt-5 text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
              {subline}
            </p>
          )}
        </div>

        {/* gap-5 is load-bearing for the arrows: each chip is 32px wide and
            sits at -26px from its card's right edge, which is the centre of a
            20px gap. Change one, change the other. */}
        <ol className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex flex-col rounded-2xl bg-secondary p-6 md:p-7">
              {/* The number IS the tile. It used to be a STEP 1 label over an
                  icon tile, then an icon with a faint number beside it; the
                  icons repeated what the titles already say, so the number
                  took their place (2026-10-05). The <ol> carries the order for
                  screen readers, hence aria-hidden. */}
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background text-lead font-semibold tabular-nums text-brand-icon"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {s.image && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={s.image.src}
                  srcSet={s.image.srcSet}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  alt={s.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="mt-5 aspect-[4/3] w-full rounded-xl object-cover"
                />
              )}

              <h3 className="mt-5 text-lead font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-body-sm leading-[1.65] text-muted-foreground">{s.detail}</p>

              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-[26px] top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-muted-foreground lg:flex"
                >
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </li>
          ))}
        </ol>

        {/* Default size, not lg. The statics section carried size="lg" from
            its first version and the vehicle one never did, so the same CTA
            was 56px on one page and 48px on the next. Centred under the cards
            the 56 also read as oversized. One size for all three landings. */}
        <div className="mt-12 flex justify-center">
          <Button asChild>
            <a href={cta.href} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="mr-2 h-5 w-5" />
              {cta.label}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
