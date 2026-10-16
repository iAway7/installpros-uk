import type { ReactNode } from "react";
import { Grid3x3, KeyRound, Siren, Smartphone, UserRoundCheck, Users } from "lucide-react";
import { SecurityPhoneMock } from "./security-phone-mock";

/**
 * Third version of the "Simple enough for everyone in the house" section,
 * rendered under the other two on 16 October so all three can be compared on
 * the page. Two of them go once Gus picks.
 *
 * Same layout as security-app-section.tsx (three items, the phone, three
 * items, each column's flush edge facing the phone), with two changes:
 *
 *   - The columns are swapped and labelled. Left, "What you see and
 *     control", quotes the feed on purpose ("Sarah armed it from the app at
 *     08:12" is the bottom alert on the screen beside it). Right, "How each
 *     person uses it", stays short and plain. The labels are the point: they
 *     turn six loose items into two groups.
 *   - No colour outside the phone: line icons in the text colour, inline with
 *     the title, no chip behind them. The section eyebrow keeps the colour
 *     every eyebrow on the page has.
 *
 * The phone is SecurityPhoneMock, imported unchanged (the original section
 * imports it too, so nothing had to be copied). It keeps its own entry
 * animation, so no second stagger is added.
 *
 * Phones and tablets: header, phone, then the two groups, both left aligned.
 * Right alignment only from lg, where the left column sits against the phone.
 */

type Item = { icon: ReactNode; title: string; detail: ReactNode };
type Side = "left" | "right";

const ICON = "h-4 w-4 shrink-0";

/** The times are the feed's own, set like the phone's so the eye can match them. */
function Time({ children }: { children: string }) {
  return <span className="font-medium tabular-nums text-foreground">{children}</span>;
}

const YOU_SEE: Item[] = [
  {
    icon: <Users className={ICON} />,
    title: "Everyone is a user.",
    detail: (
      <>
        Sarah armed it from the app at <Time>08:12</Time>, and the log tells you so. Each person gets their own way in
        and their own record.
      </>
    ),
  },
  {
    icon: <UserRoundCheck className={ICON} />,
    title: "Temporary access.",
    detail: (
      <>
        Maria disarmed at <Time>10:02</Time> on temporary access. Add a cleaner, a dog walker or a builder, and remove
        them when the job is done.
      </>
    ),
  },
  {
    icon: <Siren className={ICON} />,
    title: "A panic button.",
    detail: "One press, on the app or the fob, sets the alarm off and reaches every phone in the house.",
  },
];

const WAYS_IN: Item[] = [
  { icon: <Smartphone className={ICON} />, title: "The app.", detail: "Arm, disarm and check the house from work or from abroad." },
  { icon: <Grid3x3 className={ICON} />, title: "A keypad.", detail: "By the door, with a code of their own for everyone who lives there." },
  { icon: <KeyRound className={ICON} />, title: "A key fob.", detail: "One press, for anyone who would rather not use a phone." },
];

function Group({ id, label, items, side }: { id: string; label: string; items: Item[]; side: Side }) {
  // On the left of the phone the text, the label and the icon all sit against
  // the phone; everywhere else, and on smaller screens, left to right.
  const align = side === "left" ? "lg:text-right" : "";
  return (
    <div role="group" aria-labelledby={id}>
      <h3 id={id} className={`text-label font-semibold uppercase tracking-[0.14em] text-muted-foreground ${align}`}>
        {label}
      </h3>
      <ul className="mt-6 space-y-7">
        {items.map((i) => (
          <li key={i.title} className={align}>
            <p
              className={`flex items-center gap-2 text-lead font-semibold text-foreground ${
                side === "left" ? "lg:flex-row-reverse" : ""
              }`}
            >
              <span aria-hidden="true">{i.icon}</span>
              {i.title}
            </p>
            <p className="mt-1 text-body-sm leading-[1.6] text-muted-foreground">{i.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SecurityAppSectionAlt2() {
  return (
    <section id="everyday-alt2" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Easy for the whole family</p>
          <h2 className="mt-4 h2-section text-foreground">Simple enough for everyone in the house.</h2>
          <p className="mx-auto mt-5 max-w-xl text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            Every alert reaches the phones you choose, wherever you are, and the log says who did what.
          </p>
        </div>

        {/* Phones: the phone, then the two groups. Tablets: the phone across
            the top, the two groups side by side below. From lg: a group, the
            phone, a group. */}
        <div className="mt-12 grid grid-cols-1 gap-y-12 md:mt-16 md:grid-cols-2 md:gap-x-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-x-12 xl:gap-x-16">
          <div className="order-1 md:col-span-2 lg:order-2 lg:col-span-1 lg:w-[300px] xl:w-[320px]">
            <SecurityPhoneMock />
          </div>
          <div className="order-2 lg:order-1">
            <Group id="alt2-you-see" label="What you see and control" items={YOU_SEE} side="left" />
          </div>
          <div className="order-3">
            <Group id="alt2-ways-in" label="How each person uses it" items={WAYS_IN} side="right" />
          </div>
        </div>
      </div>
    </section>
  );
}
