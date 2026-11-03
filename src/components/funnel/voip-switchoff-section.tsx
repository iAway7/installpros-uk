import { ArrowRight } from "lucide-react";
import { VoipCountdown } from "./voip-countdown";

/**
 * The switch-off (voip-research, sections 3 and 6). Lower than on most
 * competitor pages on purpose: the people who buy already know their line is
 * going (BT cut it, or they are leaving BT for Starlink), so the number comes
 * first. What happens on the day is what no competitor explains (0 of 12).
 *
 * Gus, 3 November: the heading centred like "The phone", then a big count of
 * the days left and a button to the form. The count is the date said as a
 * number, not scare copy: no "act now", nothing that mimics a provider
 * letter. If the date moves, SWITCH_OFF in voip-countdown.tsx and the two
 * lines that name it change.
 */
export function VoipSwitchoffSection() {
  return (
    <section id="switch-off" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">The switch-off</p>
          <h2 className="mt-4 text-balance h2-section text-foreground">Your landline is moving to the internet.</h2>
        </div>

        <div className="mx-auto mt-10 max-w-2xl text-center md:mt-14">
          <VoipCountdown />

          <p className="mx-auto mt-8 max-w-xl text-pretty text-body text-muted-foreground md:mt-10 md:text-lg" style={{ lineHeight: "1.6" }}>
            <strong className="text-foreground">On the day,</strong> a line that hasn&apos;t moved stops working
            normally, and its number can be lost. Moving it now keeps your number safe.
          </p>

          <a
            href="#quote"
            className="focus-ring-solid mx-auto mt-8 flex h-control-lg w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover sm:inline-flex sm:w-auto"
          >
            Keep my number
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
