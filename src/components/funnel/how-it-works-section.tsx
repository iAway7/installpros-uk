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
  encodeURIComponent("Hi, I'd like a quote for Starlink on my vehicle. Photo of the roof to follow.");

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
    title: "Send a photo of the roof",
    // What the engineers ask for first in every vehicle conversation. Rails,
    // seams and skylights decide the mount, so one photo answers most of it.
    detail: "From a step or from above, with the make and model.",
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
      <div className="container mx-auto">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 h2-section text-foreground">Quoted from a photo. Fitted in a day.</h2>
        </div>

        <ol className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t border-border pt-6">
              <span className="stat-xl tabular-nums text-brand-icon" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lead font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-body-sm leading-[1.65] text-muted-foreground">{s.detail}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <Button asChild>
            <a href={PHOTO_QUOTE_URL} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
              Send us a photo of the roof
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
