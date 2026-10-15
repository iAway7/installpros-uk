import { Grid3x3, KeyRound, Siren, Smartphone, UserRoundCheck, Users } from "lucide-react";
import { SecurityPhoneMock } from "./security-phone-mock";
import type { ReactNode } from "react";

/**
 * How it fits into the household: the app, the keypad, the fob, the people.
 *
 * Will's fifth question, 13 October 2026: "Accessibility and ease of use and
 * integration into people's life styles (apps, arming stations, remote
 * control, ability to use while away from property, adding users, having
 * temporary users, panic alarms)". Each item in his list is one card here,
 * in plain words, and "family protection" and "app convenience" from his
 * sales language are the heading and the phone.
 *
 * The phone is security-phone-mock.tsx: an illustration, not a screenshot of
 * the Ajax app, and animated since 15 October 2026 (the reasons are there).
 */

type Item = { icon: ReactNode; title: string; detail: string };

const ITEMS: Item[] = [
  {
    icon: <Smartphone className="h-5 w-5" />,
    title: "The app",
    detail: "Arm, disarm and check on the house from work or from abroad.",
  },
  {
    icon: <Grid3x3 className="h-5 w-5" />,
    title: "A keypad",
    detail: "By the door, with a code of their own for everyone who lives there.",
  },
  {
    icon: <KeyRound className="h-5 w-5" />,
    title: "A key fob",
    detail: "One press to arm or disarm, for anyone who would rather not use a phone.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "The whole family",
    detail: "Everyone added as a user, and you see who armed it and when.",
  },
  {
    icon: <UserRoundCheck className="h-5 w-5" />,
    title: "Temporary access",
    detail: "For a cleaner, a dog walker or a builder, removed when the job is done.",
  },
  {
    icon: <Siren className="h-5 w-5" />,
    title: "A panic button",
    detail: "One press sets off the alarm and alerts the family's phones.",
  },
];

function ItemList({ items, side }: { items: Item[]; side: "left" | "right" }) {
  return (
    <ul className="space-y-8">
      {items.map((c) => (
        // On the left of the phone the icon goes on the inner side, next to
        // it, and the text aligns towards it; on phones and tablets every
        // item reads left to right as usual.
        <li key={c.title} className={`flex gap-4 ${side === "left" ? "lg:flex-row-reverse lg:text-right" : ""}`}>
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/[0.06] text-brand-icon"
          >
            {c.icon}
          </span>
          <span>
            <span className="block text-lead font-semibold text-foreground">{c.title}</span>
            <span className="mt-1 block text-body-sm leading-[1.6] text-muted-foreground">{c.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function SecurityAppSection() {
  return (
    <section id="everyday" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        {/* Centred, Gus, 15 October 2026: heading on top, the phone in the
            middle, three ways in on each side. */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Easy for the whole family</p>
          <h2 className="mt-4 h2-section text-foreground">Simple enough for everyone in the house.</h2>
          <p className="mx-auto mt-5 max-w-xl text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            Each person uses it their own way: the app, a code on the keypad or a key fob. Every alert reaches the
            phones you choose, wherever you are.
          </p>
        </div>

        {/* Phones: the phone, then the six items in one column. Tablets: the
            phone across the top, three and three below. From lg: three, the
            phone, three. */}
        <div className="mt-12 grid grid-cols-1 gap-y-8 md:mt-16 md:grid-cols-2 md:gap-x-10 md:gap-y-12 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-x-12 xl:gap-x-16">
          <div className="order-1 md:col-span-2 lg:order-2 lg:col-span-1 lg:w-[300px] xl:w-[320px]">
            <SecurityPhoneMock />
          </div>
          <div className="order-2 lg:order-1">
            <ItemList items={ITEMS.slice(0, 3)} side="left" />
          </div>
          <div className="order-3">
            <ItemList items={ITEMS.slice(3)} side="right" />
          </div>
        </div>
      </div>
    </section>
  );
}
