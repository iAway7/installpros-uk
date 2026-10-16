import type { ReactNode } from "react";
import { Grid3x3, KeyRound, Siren, Smartphone, UserRoundCheck, Users } from "lucide-react";
import { SecurityPhoneMock } from "./security-phone-mock";

/**
 * Alternative to security-app-section.tsx, rendered under it on 16 October so
 * the two can be compared on the page. One of them goes once Gus picks.
 *
 * What it does differently: the copy leans on the phone. The feed beside it is
 * the strongest proof in the section, so the second group quotes it line for
 * line ("Sarah armed it from the app at 08:12" is the bottom alert on the
 * screen), while the first group stays short and plain. The six items are no
 * longer six equal features: three ways in, two things you see, and the panic
 * button on a strip of its own.
 *
 * The phone is SecurityPhoneMock, imported unchanged: it already lives in its
 * own file, so nothing had to be copied out of the original section. It keeps
 * its own entry animation (the alerts arrive one by one when it scrolls into
 * view, and show at once with prefers-reduced-motion), which is why no second
 * stagger is added here.
 *
 * Colour: none outside the phone, so the eye goes there. Icons are line icons
 * in the text colour with no chip behind them. The section eyebrow keeps the
 * colour every eyebrow on the page has.
 *
 * Layout: phone left at about 40%, text right at 60%, everything left aligned.
 * On phones: phone, the three ways in as a row of three, the two things you
 * see as a list, then the panic strip.
 */

type Item = { icon: ReactNode; label: string; text: ReactNode };

const ICON = "h-4 w-4 shrink-0";

const WAYS_IN: Item[] = [
  { icon: <Smartphone className={ICON} />, label: "The app.", text: "Arm, disarm and check the house from work or from abroad." },
  { icon: <Grid3x3 className={ICON} />, label: "A keypad.", text: "By the door, with a code of their own for everyone who lives there." },
  { icon: <KeyRound className={ICON} />, label: "A key fob.", text: "One press, for anyone who would rather not use a phone." },
];

/** The times are the feed's own, set like the phone's so the eye can match them. */
function Time({ children }: { children: string }) {
  return <span className="font-medium tabular-nums text-foreground">{children}</span>;
}

const YOU_SEE: Item[] = [
  {
    icon: <Users className={ICON} />,
    label: "Everyone is a user.",
    text: (
      <>
        Sarah armed it from the app at <Time>08:12</Time>, and the log tells you so. Each person gets their own way in
        and their own record.
      </>
    ),
  },
  {
    icon: <UserRoundCheck className={ICON} />,
    label: "Temporary access.",
    text: (
      <>
        Maria disarmed at <Time>10:02</Time> on temporary access. Add a cleaner, a dog walker or a builder, and remove
        them when the job is done.
      </>
    ),
  },
];

function GroupLabel({ id, children }: { id: string; children: string }) {
  return (
    <h3 id={id} className="text-label font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </h3>
  );
}

export function SecurityAppSectionAlt() {
  return (
    <section id="everyday-alt" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">One system, every person</p>
          <h2 className="mt-4 h2-section text-balance text-foreground">
            Everyone has their own way in.
            <br className="hidden sm:block" /> You see all of it.
          </h2>
          <p className="mx-auto mt-5 text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            Every alert reaches the phones you choose, wherever you are, and the log says who did what.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 lg:grid-cols-5 lg:items-center lg:gap-16">
          <div className="lg:col-span-2">
            <SecurityPhoneMock />
          </div>

          <div className="lg:col-span-3">
            <div role="group" aria-labelledby="alt-ways-in">
              <GroupLabel id="alt-ways-in">How each person uses it</GroupLabel>
              <ul className="mt-5 grid grid-cols-3 gap-4 md:gap-6">
                {WAYS_IN.map((i) => (
                  <li key={i.label}>
                    <p className="flex items-center gap-2 text-body-sm font-semibold text-foreground md:text-body">
                      <span aria-hidden="true">{i.icon}</span>
                      {i.label}
                    </p>
                    <p className="mt-1.5 text-caption leading-[1.55] text-muted-foreground md:text-body-sm">{i.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div role="group" aria-labelledby="alt-you-see" className="mt-10 border-t border-border pt-10">
              <GroupLabel id="alt-you-see">What you see and control</GroupLabel>
              <ul className="mt-5 space-y-6">
                {YOU_SEE.map((i) => (
                  <li key={i.label}>
                    <p className="flex items-center gap-2 text-body font-semibold text-foreground md:text-lead">
                      <span aria-hidden="true">{i.icon}</span>
                      {i.label}
                    </p>
                    <p className="mt-1.5 text-body leading-[1.6] text-muted-foreground">{i.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-start gap-3 rounded-xl border border-border bg-secondary px-5 py-4 md:mt-16 md:items-center md:px-6">
          <Siren aria-hidden="true" className={`${ICON} mt-0.5 text-foreground md:mt-0`} />
          <p className="text-body text-foreground">
            And one press, on the app or the fob, sets the alarm off and reaches every phone in the house.
          </p>
        </div>
      </div>
    </section>
  );
}
