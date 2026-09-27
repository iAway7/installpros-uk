import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { Button } from "@/components/system/button";

/**
 * How it works, for somebody who may be hours from their boat.
 *
 * The photograph comes first here, the opposite of the statics page, because
 * for a boat it replaces the visit rather than delaying the price. The one
 * ready buyer the marine corpus lost (superchat-analysis/marine-questions-for-
 * will, finding 07) was a Fairline at Swanwick: mounting already solved, boat
 * spec known, a competitor on hold, and two and a half hours from his own
 * boat. He asked three times and the quote did not come fast enough.
 *
 *   "I just need a quote asap so I can make a decision for the original guys
 *    currently on hold"
 *   "What time is required, I'm a 2.5hr drive from the boat"
 *
 * A liveaboard is standing on the boat when they write; a coastal cruiser is
 * not. Two photos cover both, and a price the same day is what the lost
 * customer needed.
 *
 * Step three names the marina, the barrier and the gate code, because the
 * customer who bought at Tattenhall volunteered his barrier code unprompted so
 * the engineer could get in. It is an obstacle they are already worrying
 * about on our behalf.
 *
 * PENDING: the same-day price is an operational commitment, copied from the
 * vehicle and statics pages. Confirm it holds when the quote needs a boat
 * type rather than a roof photo.
 */

const WHATSAPP_URL =
  "https://wa.me/447446112343?text=" +
  encodeURIComponent(
    "Hi, I'd like a price for Starlink on my boat. Photos and the marina to follow.",
  );

type Step = { title: string; detail: string };

const STEPS: Step[] = [
  {
    title: "Send two photos",
    detail: "One of the roof or the arch where it would sit, one of where the router goes. Say whether the boat moves.",
  },
  {
    title: "Get a price back",
    detail: "The fitting, spread if you want it, and which Starlink plan fits. No survey visit first.",
  },
  {
    title: "Tell us how to reach the boat",
    detail: "Marina, berth, barrier code or pontoon key. We arrange a day the boat is there.",
  },
  {
    title: "Fitted at the berth, tested before we go",
    detail: "Mount, power, cable and router in one visit. Account set up with you, pause button shown.",
  },
];

export function MarineHowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 h2-section text-foreground">
            A price before anyone drives to the marina.
          </h2>
          <p className="mt-5 text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            You may be hours from the boat. Two photos are enough to price it.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t border-border pt-6">
              <span className="text-label font-semibold uppercase tracking-[0.14em] text-muted-foreground tabular-nums">
                Step {i + 1}
              </span>
              <h3 className="mt-3 text-lead font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-body-sm leading-[1.65] text-muted-foreground">{s.detail}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Button asChild size="lg">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="mr-2 h-5 w-5" />
              Send photos of your boat
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
