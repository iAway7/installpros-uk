/**
 * The switch-off, short and calm (voip-research, sections 3 and 6). Lower
 * than on most competitor pages on purpose: the people who buy already know
 * their line is going (BT cut it, or they are leaving BT for Starlink), so
 * the number comes first. What happens on the day is what no competitor
 * explains (0 of 12).
 *
 * No "act now" or scare copy: it mimics provider letters. The date stands
 * alone, so if it moves, one line changes.
 */
export function VoipSwitchoffSection() {
  return (
    <section id="switch-off" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center md:gap-14">
          <div>
            <p className="eyebrow">The switch-off</p>
            <h2 className="mt-4 text-balance h2-section text-foreground">Your landline is moving to the internet.</h2>
          </div>
          <div className="space-y-5">
            <div className="rounded-2xl bg-background p-6">
              <p className="text-body-sm font-semibold uppercase tracking-wide text-muted-foreground">Copper lines close</p>
              <p className="mt-1 text-[28px] font-bold leading-tight text-foreground md:text-[32px]">31 January 2027</p>
            </div>
            <p className="text-pretty text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
              <strong className="text-foreground">On the day,</strong> a line that hasn&apos;t moved stops working
              normally, and its number can be lost. Moving it now keeps your number safe.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
