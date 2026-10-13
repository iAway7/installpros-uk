import { Camera, DoorOpen, Droplets, Flame, ShieldCheck, Footprints } from "lucide-react";
import type { ReactNode } from "react";

/**
 * What the system covers, first under the hero.
 *
 * The old Ajax page on installpros.co.uk names the product's four jobs in its
 * FAQ (intrusion, fire, leaks, and cameras in the title) and its one promise
 * in every section: control and alerts from the app. This puts both on one
 * screen. The phone is the picture the page is missing: there is no photograph
 * of an install, and what a buyer is actually buying is what lands on their
 * phone, so that is what is drawn.
 *
 * THE PHONE IS AN ILLUSTRATION, not a screenshot of the Ajax app. No Ajax logo,
 * no copy of their interface: a generic lock screen with the kind of alert the
 * system sends. Every alert is something the old page or Will's FAQ already
 * claims the system does.
 *
 * The four facts under the list are the old FAQ's "why Ajax over a traditional
 * system" answer, kept to what it said: wireless, no major cabling, pet-friendly,
 * easy to add to. The power-cut line is the one addition, because it is the
 * first thing anyone asks about a wireless alarm.
 *
 * PENDING (question 2 for Will): "monitoring". Nothing here claims a
 * monitoring centre. The alerts go to the phone, which is true of every Ajax
 * system. If Will sells monitored contracts, the fourth fact becomes that.
 */

type Cover = { icon: ReactNode; title: string; detail: string };

const COVERS: Cover[] = [
  {
    icon: <Footprints className="h-5 w-5" />,
    title: "Intruders",
    detail: "Motion detectors in the rooms, contacts on the doors and windows.",
  },
  {
    icon: <Flame className="h-5 w-5" />,
    title: "Fire",
    detail: "Smoke and heat detectors that tell your phone, not just the hallway.",
  },
  {
    icon: <Droplets className="h-5 w-5" />,
    title: "Leaks",
    detail: "A sensor under the sink or by the boiler, before the ceiling finds out.",
  },
  {
    icon: <Camera className="h-5 w-5" />,
    title: "Cameras",
    detail: "In the same app as the alarm, so you can look when an alert comes in.",
  },
];

const FACTS = [
  "Wireless, so nothing is chased into your walls",
  "Motion detectors set to ignore pets",
  "A backup battery in the hub for power cuts",
  "Add a detector or a camera later, no rewiring",
];

type Alert = { icon: ReactNode; title: string; detail: string; time: string; tone?: "warn" };

const ALERTS: Alert[] = [
  { icon: <ShieldCheck className="h-4 w-4" />, title: "Armed, away", detail: "By Sarah, from the app", time: "08:12" },
  { icon: <DoorOpen className="h-4 w-4" />, title: "Front door opened", detail: "Disarmed at the keypad", time: "17:46" },
  { icon: <Droplets className="h-4 w-4" />, title: "Leak detected", detail: "Kitchen, under the sink", time: "19:03", tone: "warn" },
  { icon: <Camera className="h-4 w-4" />, title: "Motion outside", detail: "Back garden camera, tap to look", time: "22:31" },
];

function PhoneMock() {
  return (
    <div
      role="img"
      aria-label="Illustration of a phone lock screen with four alarm alerts: armed away by Sarah, front door opened, a leak under the kitchen sink, and motion on the back garden camera."
      className="relative mx-auto w-full max-w-[280px] md:max-w-[320px]"
    >
      {/* A soft halo so the dark phone does not sit on white like a hole. */}
      <div aria-hidden="true" className="absolute -inset-10 rounded-[4rem] bg-[radial-gradient(closest-side,rgba(13,27,42,0.10),transparent)]" />
      <div
        aria-hidden="true"
        className="relative overflow-hidden rounded-[2.75rem] border-[9px] border-[#111] shadow-raised"
        style={{ background: "radial-gradient(120% 60% at 50% 0%, #1d3045 0%, #0d1b2a 55%, #05080c 100%)" }}
      >
        {/* Notch */}
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
    <section id="what-it-covers" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        {/* Three blocks, not two columns, so a phone can put the picture
            between the heading and the list instead of after four paragraphs
            of text. From md the intro and the list share the left column and
            the phone spans both rows on the right. */}
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-x-16 md:gap-y-10 lg:gap-x-24">
          <div className="md:col-start-1 md:row-start-1">
            <p className="eyebrow">One system, one app</p>
            <h2 className="mt-4 h2-section text-foreground">Every alert on your phone, the moment it happens.</h2>
            <p className="mt-5 max-w-xl text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
              Ajax is a wireless system: a hub, detectors and cameras that talk by radio. You arm it, disarm it and see
              what set it off from the free Ajax app.
            </p>
          </div>

          <div className="md:col-start-2 md:row-span-2 md:row-start-1 md:self-center">
            <PhoneMock />
          </div>

          <ul className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 md:col-start-1 md:row-start-2">
            {COVERS.map((c) => (
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

        <ul className="mt-14 grid grid-cols-1 gap-x-10 gap-y-4 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4 md:mt-20">
          {FACTS.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-body-sm font-medium text-foreground">
              <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-[3px] h-4 w-4 shrink-0 text-success" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 10.5 3.2 3L15 6.5" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
