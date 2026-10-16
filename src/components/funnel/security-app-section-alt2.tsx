import type { ReactNode } from "react";
import { Grid3x3, KeyRound, Siren, Smartphone, UserRoundCheck, Users } from "lucide-react";
import { SecurityPhoneMock } from "./security-phone-mock";

/**
 * Third version of the "Simple enough for everyone in the house" section,
 * rendered under the other two on 16 October so all three can be compared on
 * the page. Two of them go once Gus picks.
 *
 * Same layout as security-app-section.tsx (three items, the phone, three
 * items), with two changes:
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
 * Every text block is left aligned, the column left of the phone included
 * (Gus, 16 October): no right alignment at any size.
 */

type Item = { icon: ReactNode; title: string; detail: ReactNode };

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

/**
 * Where each piece sits. The two columns share one grid, so the labels sit on
 * the same row and each item sits on the same row as its partner across the
 * phone: tops line up and every row is the same height (Gus, 16 October,
 * "pixel perfect"). Tailwind needs whole class names, so they are spelt out.
 *
 *   Phones   one column in DOM order: phone, left group, right group.
 *   md       the phone across the top, then label row and three item rows,
 *            left group in column 1, right group in column 2.
 *   lg       label row and three item rows, left group, phone across all
 *            four rows in the middle, right group.
 */
const SLOT = {
  left: {
    label: "md:col-start-1 md:row-start-2 lg:row-start-1",
    items: [
      "md:col-start-1 md:row-start-3 lg:row-start-2",
      "md:col-start-1 md:row-start-4 lg:row-start-3",
      "md:col-start-1 md:row-start-5 lg:row-start-4",
    ],
  },
  right: {
    // On phones the second group needs a gap above its label.
    label: "mt-6 md:mt-0 md:col-start-2 md:row-start-2 lg:col-start-3 lg:row-start-1",
    items: [
      "md:col-start-2 md:row-start-3 lg:col-start-3 lg:row-start-2",
      "md:col-start-2 md:row-start-4 lg:col-start-3 lg:row-start-3",
      "md:col-start-2 md:row-start-5 lg:col-start-3 lg:row-start-4",
    ],
  },
} as const;

/** `contents` keeps the group and the list for screen readers while their
 *  children sit in the shared grid. */
function Group({ id, label, items, side }: { id: string; label: string; items: Item[]; side: "left" | "right" }) {
  const slot = SLOT[side];
  return (
    <div role="group" aria-labelledby={id} className="contents">
      <h3 id={id} className={`text-label font-semibold uppercase tracking-[0.14em] text-muted-foreground ${slot.label}`}>
        {label}
      </h3>
      <ul role="list" className="contents">
        {items.map((i, n) => (
          <li key={i.title} className={slot.items[n]}>
            <p className="flex items-center gap-2 text-lead font-semibold text-foreground">
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

        {/* One grid for both columns (see SLOT). The item rows are equal
            fractions, so every row is as tall as the tallest item in any of
            them, and on lg the phone, spanning all four rows, stretches those
            rows rather than the label row. */}
        <div className="mt-12 grid grid-cols-1 gap-y-7 md:mt-16 md:grid-cols-2 md:grid-rows-[auto_auto_repeat(3,minmax(0,1fr))] md:gap-x-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:grid-rows-[auto_repeat(3,minmax(0,1fr))] lg:gap-x-12 xl:gap-x-16">
          <div className="mb-5 md:col-span-2 md:row-start-1 lg:col-span-1 lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:mb-0 lg:w-[300px] lg:self-center xl:w-[320px]">
            <SecurityPhoneMock />
          </div>
          <Group id="alt2-you-see" label="What you see and control" items={YOU_SEE} side="left" />
          <Group id="alt2-ways-in" label="How each person uses it" items={WAYS_IN} side="right" />
        </div>
      </div>
    </section>
  );
}
