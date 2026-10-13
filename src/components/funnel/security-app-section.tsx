import { Camera, Grid3x3, KeyRound, ShieldCheck, Siren, Smartphone, UserRound, UserRoundCheck, Users } from "lucide-react";
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
 * THE PHONE IS AN ILLUSTRATION, not a screenshot of the Ajax app. No Ajax logo,
 * no copy of their interface: a generic lock screen with the kind of alert the
 * system sends. The four alerts are one day in one house and each shows one
 * of Will's points: armed from the app, a temporary user, a key fob, and a
 * photo to check before anyone panics.
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

type Alert = { icon: ReactNode; title: string; detail: string; time: string; tone?: "warn" };

const ALERTS: Alert[] = [
  { icon: <ShieldCheck className="h-4 w-4" />, title: "Armed, away", detail: "Sarah, from the app", time: "08:12" },
  { icon: <UserRound className="h-4 w-4" />, title: "Disarmed", detail: "Maria, temporary access", time: "10:02" },
  { icon: <KeyRound className="h-4 w-4" />, title: "Front door opened", detail: "Tom, key fob", time: "17:46" },
  { icon: <Camera className="h-4 w-4" />, title: "Motion in the hallway", detail: "Photo attached, tap to check", time: "22:31", tone: "warn" },
];

function PhoneMock() {
  return (
    <div
      role="img"
      aria-label="Illustration of a phone lock screen with four alarm alerts: armed away by Sarah from the app, disarmed by Maria with temporary access, front door opened by Tom with a key fob, and motion in the hallway with a photo to check."
      className="relative mx-auto w-full max-w-[280px] md:max-w-[320px]"
    >
      {/* A soft halo so the dark phone does not sit on white like a hole. */}
      <div aria-hidden="true" className="absolute -inset-10 rounded-[4rem] bg-[radial-gradient(closest-side,rgba(13,27,42,0.10),transparent)]" />
      <div
        aria-hidden="true"
        className="relative overflow-hidden rounded-[2.75rem] border-[9px] border-[#111] shadow-raised"
        style={{ background: "radial-gradient(120% 60% at 50% 0%, #1d3045 0%, #0d1b2a 55%, #05080c 100%)" }}
      >
        <div className="mx-auto mt-2.5 h-[22px] w-[92px] rounded-full bg-[#111]" />

        <div className="px-4 pb-6 pt-6 text-center text-white">
          <p className="text-body-sm font-medium text-white/70">Tuesday</p>
          <p className="mt-0.5 text-[56px] font-semibold leading-none tracking-[-0.03em]">22:31</p>
        </div>

        <ul className="space-y-2 px-3 pb-8">
          {ALERTS.map((a) => (
            <li key={a.title} className="flex items-start gap-3 rounded-2xl bg-white/[0.12] px-3 py-2.5 text-left text-white backdrop-blur">
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  a.tone === "warn" ? "bg-[#C70505] text-white" : "bg-white/15 text-white"
                }`}
              >
                {a.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[14px] font-semibold leading-tight">{a.title}</span>
                  <span className="shrink-0 text-[11px] text-white/60">{a.time}</span>
                </span>
                <span className="mt-0.5 block truncate text-[13px] leading-snug text-white/75">{a.detail}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mx-auto mb-2.5 h-[5px] w-[110px] rounded-full bg-white/50" />
      </div>
    </div>
  );
}

export function SecurityAppSection() {
  return (
    <section id="everyday" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        {/* Three blocks, not two columns, so a phone can put the picture
            between the heading and the list instead of after six items of
            text. From md the intro and the list share the left column and the
            phone spans both rows on the right. */}
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-x-16 md:gap-y-10 lg:gap-x-24">
          <div className="md:col-start-1 md:row-start-1">
            <p className="eyebrow">Easy for the whole family</p>
            <h2 className="mt-4 h2-section text-foreground">Simple enough for everyone in the house.</h2>
            <p className="mt-5 max-w-xl text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
              Each person uses it their own way: the app, a code on the keypad or a key fob. Every alert reaches the
              phones you choose, wherever you are.
            </p>
          </div>

          <div className="md:col-start-2 md:row-span-2 md:row-start-1 md:self-center">
            <PhoneMock />
          </div>

          <ul className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 md:col-start-1 md:row-start-2">
            {ITEMS.map((c) => (
              <li key={c.title} className="flex gap-4">
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
        </div>
      </div>
    </section>
  );
}
