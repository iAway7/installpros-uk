import type { ReactNode } from "react";
import { Bell, History, KeyRound, MonitorPlay, UserCheck, Users } from "lucide-react";
import { HikvisionPhoneMock } from "./hikvision-phone-mock";

/**
 * Hik-Connect, in the layout Gus chose for the Ajax app section
 * (security-app-section.tsx): two labelled columns with the phone between
 * them on large screens, above them on smaller ones. That file renders the
 * live Ajax page, so this is a copy, with its own items and phone.
 *
 * Why it is second: viewing on the phone is the one thing every camera buyer
 * assumes (23 of 81), and recordings come next (16).
 *
 * "Yours, not ours" answers the owners locked out by an installer who kept
 * the admin account (hikvision-research/superchat-cctv-insights.md, section
 * 2). Remote help only with the owner's approval is how Hikvision's installer
 * platform works, but the line goes only if Jordan confirms the account is in
 * the customer's name (question 6). Sharing with chosen permissions is a
 * documented Hik-Connect feature. "Free" is in the FAQ, not here.
 */

type Item = { icon: ReactNode; title: string; detail: ReactNode };

const ICON = "h-4 w-4 shrink-0";

const YOU_SEE: Item[] = [
  { icon: <MonitorPlay className={ICON} />, title: "Live view.", detail: "Every camera at once, or one full screen, from anywhere." },
  { icon: <History className={ICON} />, title: "Playback.", detail: "Scroll back to the moment it happened and save the clip." },
  { icon: <Bell className={ICON} />, title: "Alerts.", detail: "A notification with a snapshot when someone comes up the drive." },
];

const WHO_SEES: Item[] = [
  { icon: <Users className={ICON} />, title: "The whole household.", detail: "Share the cameras with everyone at home." },
  { icon: <UserCheck className={ICON} />, title: "You choose.", detail: "Give a relative or a neighbour live view only, and take it away later." },
  {
    icon: <KeyRound className={ICON} />,
    title: "Yours, not ours.",
    detail: "The system is registered to you. If you ever want us to help remotely, you approve it in the app, for as long as you choose.",
  },
];

/** Grid slots, as in the Ajax section: md two columns under the phone, lg the
 *  phone in the middle spanning every row. */
const SLOT = {
  left: {
    label: "md:col-start-1 md:row-start-2 lg:row-start-2",
    items: ["md:col-start-1 md:row-start-3", "md:col-start-1 md:row-start-4", "md:col-start-1 md:row-start-5"],
  },
  right: {
    label: "mt-6 md:mt-0 md:col-start-2 md:row-start-2 lg:col-start-3 lg:row-start-2",
    items: [
      "md:col-start-2 md:row-start-3 lg:col-start-3",
      "md:col-start-2 md:row-start-4 lg:col-start-3",
      "md:col-start-2 md:row-start-5 lg:col-start-3",
    ],
  },
} as const;

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

export function HikvisionAppSection() {
  return (
    <section id="app" className="w-full scroll-mt-28 overflow-x-clip bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">The Hik-Connect app</p>
          <h2 className="mt-4 h2-section text-foreground">Every camera, on every phone in the house.</h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-y-7 md:mt-16 md:grid-cols-2 md:grid-rows-[auto_auto_repeat(3,minmax(0,1fr))] md:gap-x-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)_repeat(4,auto)_minmax(0,1fr)] lg:gap-x-12 lg:gap-y-8 xl:gap-x-16">
          <div className="mb-5 md:col-span-2 md:row-start-1 lg:col-span-1 lg:col-start-2 lg:row-span-6 lg:row-start-1 lg:mb-0 lg:w-[300px] lg:self-center xl:w-[320px]">
            <HikvisionPhoneMock />
          </div>
          <Group id="app-you-see" label="What you see" items={YOU_SEE} side="left" />
          <Group id="app-who-sees" label="Who sees it" items={WHO_SEES} side="right" />
        </div>
      </div>
    </section>
  );
}
