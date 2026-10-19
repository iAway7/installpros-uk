import type { ReactNode } from "react";
import { Grid3x3, KeyRound, Siren, Smartphone, UserRoundCheck, Users } from "lucide-react";
import { SecurityPhoneMock } from "./security-phone-mock";

/**
 * "Simple enough for everyone in the house": how each person uses the
 * system, and what the owner sees. Will's fifth question, 13 October 2026:
 * "apps, arming stations, remote control, ability to use while away from
 * property, adding users, having temporary users, panic alarms".
 *
 * Chosen by Gus on 16 October out of three versions shown one under the
 * other (the centred six with pink chips, and a 40/60 layout with a panic
 * strip, both deleted).
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
 *
 * Every description fits two lines on desktop (Gus, 16 October). The columns
 * stop at 352px from 1280 up and the text is 14px, so about 50 characters a
 * line: the two feed quotes were cut to under 100 characters, keeping the
 * names and times the phone shows. At 1024 the columns are 290px and the
 * longer ones take three.
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
        Sarah armed it from the app at <Time>08:12</Time>, and the log tells you so. Everyone has their own record.
      </>
    ),
  },
  {
    icon: <UserRoundCheck className={ICON} />,
    title: "Temporary access.",
    detail: (
      <>
        Maria disarmed at <Time>10:02</Time> on temporary access. Add a cleaner or a builder, then remove them.
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
 *   lg       label row and three item rows, left group, phone in the
 *            middle. The rows keep their own height and the block is centred
 *            on the phone by an empty flexible row above and below it, which
 *            take up the phone's extra height (16 October: rows stretched to
 *            the phone left the items too far apart).
 */
const SLOT = {
  left: {
    label: "md:col-start-1 md:row-start-2 lg:row-start-2",
    items: [
      "md:col-start-1 md:row-start-3 lg:row-start-3",
      "md:col-start-1 md:row-start-4 lg:row-start-4",
      "md:col-start-1 md:row-start-5 lg:row-start-5",
    ],
  },
  right: {
    // On phones the second group needs a gap above its label.
    label: "mt-6 md:mt-0 md:col-start-2 md:row-start-2 lg:col-start-3 lg:row-start-2",
    items: [
      "md:col-start-2 md:row-start-3 lg:col-start-3 lg:row-start-3",
      "md:col-start-2 md:row-start-4 lg:col-start-3 lg:row-start-4",
      "md:col-start-2 md:row-start-5 lg:col-start-3 lg:row-start-5",
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

export function SecurityAppSection() {
  return (
    // overflow-x-clip: the halo round the phone is wider than a 320px screen
    // and would widen the whole page.
    <section id="everyday" className="w-full scroll-mt-28 overflow-x-clip bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Easy for the whole family</p>
          <h2 className="mt-4 h2-section text-foreground">Simple enough for everyone in the house.</h2>
          <p className="mx-auto mt-5 max-w-xl text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            Every alert reaches the phones you choose, wherever you are, and the log says who did what.
          </p>
        </div>

        {/* One grid for both columns (see SLOT). On md the item rows are
            equal fractions, as tall as the tallest item. On lg the label and
            item rows keep their own height and the two empty flexible rows
            around them centre the block on the phone, which spans all six. */}
        <div className="mt-12 grid grid-cols-1 gap-y-7 md:mt-16 md:grid-cols-2 md:grid-rows-[auto_auto_repeat(3,minmax(0,1fr))] md:gap-x-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)_repeat(4,auto)_minmax(0,1fr)] lg:gap-x-12 lg:gap-y-8 xl:gap-x-16">
          <div className="mb-5 md:col-span-2 md:row-start-1 lg:col-span-1 lg:col-start-2 lg:row-span-6 lg:row-start-1 lg:mb-0 lg:w-[300px] lg:self-center xl:w-[320px]">
            <SecurityPhoneMock />
          </div>
          <Group id="app-you-see" label="What you see and control" items={YOU_SEE} side="left" />
          <Group id="app-ways-in" label="How each person uses it" items={WAYS_IN} side="right" />
        </div>
      </div>
    </section>
  );
}
