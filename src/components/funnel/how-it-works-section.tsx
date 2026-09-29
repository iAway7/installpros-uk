import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { Button } from "@/components/system/button";

/**
 * PRE-FILLED for the same reason as the site approval pack on the commercial
 * page: the team lives in WhatsApp, and a message that already says what it is
 * about gets a quote back instead of a "what vehicle is it?" round trip. The
 * photo follows in the same thread, which is exactly how the won vehicle
 * conversations in the chat log went.
 */
const PHOTO_QUOTE_URL =
  "https://wa.me/447446112343?text=" +
  encodeURIComponent("Hi, I'd like a quote for Starlink on my vehicle. Photos of the roof and inside to follow.");

type Step = { title: string; detail: string };

/**
 * Deliberately no town and no call-out figure here or anywhere on the page.
 *
 * The chat log has one vehicle sale lost to exactly that: an ad named a town,
 * the customer was two hundred miles away, and the conversation ended. Will's
 * own line in the chat is that a vehicle is done at the workshop or the team
 * comes to it, and the travel charge depends on where the vehicle is. So step
 * three states the two options and puts the decision, and any charge, in the
 * quote, where it is specific to the customer rather than a number that is
 * wrong for half of them.
 */
const STEPS: Step[] = [
  {
    title: "Send photos of the roof and inside",
    // Rails, seams and skylights decide the mount, so the roof shot answers
    // most of it. The inside was added on Will's ask (2026-09-29): "We need a
    // photo of the roof and the interior of the vehicle too. If it's a camper
    // van, a photo of the electrics/batteries etc is a huge bonus." The cable
    // run and where the router lands are quoted off that, and a campervan's
    // 12 V setup decides the power side.
    //
    // KNOWN TENSION, LEFT IN DELIBERATELY: this step is already where the
    // segment stalls. Fifteen of the thirty-six vehicle conversations were
    // open waiting on a photo, and this asks for more of them. Will needs
    // them to quote without a second round trip, and a quote that has to be
    // revised later costs more than a slower first message. If the step keeps
    // losing people, shrink what is REQUIRED here rather than dropping the
    // ask: roof and inside, with the campervan electrics as the bonus it is.
    // Kept to roughly two lines on purpose. At four columns this step is a
    // quarter of the row, and the long version ran to four lines while the
    // other three sat at two, which made the row read lopsided. Will's three
    // asks all survive the cut: roof, inside, and the campervan electrics.
    // "Batteries" goes, because his own phrasing was "electrics/batteries etc"
    // and the electrics carry it.
    detail: "From a step or above, with the make and model. On a campervan, the electrics too.",
  },
  {
    title: "Get a fixed quote back",
    detail: "One price for the Mini, the mount and the fitting.",
  },
  {
    title: "Bring it in, or we come out",
    // Travel charge and which option applies are settled in the quote and in
    // the FAQ, not here. See the comment above.
    detail: "Most vehicles come to us; where that is not practical, we come out.",
  },
  {
    title: "Drive away connected",
    // From the campervan page on installpros.co.uk: two to five hours.
    detail: "Two to five hours, tested before you leave.",
  },
];

/**
 * How it works, in four steps.
 *
 * Replaces a two-column "where we fit it" section that did two jobs at once
 * (where the work happens, and what to send for a quote) and looked like it:
 * a three-line H2 to say "here or there", a card that ended two thirds of the
 * way down, and the third text list in a row on a page with no photographs.
 *
 * The vehicle conversations in the chat log are not lost on price, they are
 * lost on process: fifteen of thirty-six still open, waiting on a photo, a
 * mounting proposal or the vehicle itself. A numbered row answers the process
 * question in one glance, folds the "where" into step three, and ends on the
 * one action this segment converts on, which is sending a photo. It is also
 * the only horizontal rhythm between the fit grid above and the plan cards
 * below, which is what the page was missing visually.
 */
export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      {/* Vertical stepper, not a row of four.
          A row made every step as tall as the wordiest one and put the
          imbalance on show: step one ran to four lines when it started asking
          for the interior photo while the others sat at two. Stacked, a long
          step costs its own height and nothing else, so the copy can say what
          it needs to instead of being trimmed to fit a column.
          Heading and CTA take the left half, which also lifts the button off
          the bottom of the section where it was easy to scroll past. */}
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-4 h2-section text-foreground">Quoted from photos. Fitted in a day.</h2>
          </div>

          {/* Spans both left-hand rows so the steps run the full height beside
              the heading and the button. */}
          <ol className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                /* min-h, not just padding. Spacing came from the content, so a
                   step whose detail ran to two lines pushed its marker 135px
                   from the one above while the one-line steps sat 112 apart,
                   and a column of markers at irregular intervals reads as a
                   mistake. The minimum sets the rhythm; a step longer than it
                   still pushes, which is the point of stacking them. */
                className="relative flex min-h-[8.5rem] gap-5 pb-10 last:min-h-0 last:pb-0"
              >
                {/* Hairline from this circle to the next. Not rendered on the
                    last step, or it would trail off into the gap below. */}
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-7 top-14 w-px -translate-x-1/2 bg-border"
                  />
                )}
                {/* Step one is filled because it is the one the reader has to
                    do, and it is what the button beside it does. The rest are
                    outlined: they happen to them, not by them. */}
                <span
                  aria-hidden="true"
                  className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-body-sm font-semibold tabular-nums ${
                    i === 0
                      ? "bg-brand-icon text-white"
                      : "border border-brand-icon bg-background text-brand-icon"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* 14px puts the title's own centre line level with the middle
                    of the 56px circle. */}
                <div className="pt-[14px]">
                  <h3 className="text-lead font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-body-sm leading-[1.65] text-muted-foreground">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Its own grid child rather than part of the heading block: on a
              phone that keeps the source order heading, steps, button, which
              is the order the old layout had. From lg it moves under the
              heading. */}
          <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
            <Button asChild>
              <a href={PHOTO_QUOTE_URL} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
                Send us your photos
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
