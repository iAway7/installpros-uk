import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CircleCheck,
  CirclePlus,
  Clock,
  ListChecks,
  MapPin,
  PhoneCall,
  Settings2,
  ShieldCheck,
  X,
} from "lucide-react";

/**
 * What the installation pays for: fitted by us against a kit you fit yourself.
 *
 * This replaced a smart-versus-standard table (against a monitored alarm
 * contract) on 14 October 2026, on the Superchat analysis of 125 security
 * purchase enquiries (ajax-research/superchat-security-insights.md):
 *
 *   - Nobody compared InstallPros with ADT or any monitored company. Will's
 *     question 3 appears in 0 purchase chats (his list comes from phone calls,
 *     which the data cannot see, so the question stays in the FAQ).
 *   - What buyers did compare with was doing it themselves: 10 raised a DIY
 *     kit, 7 asked to buy the kit and have it fitted or fit it themselves,
 *     and 7 objected to the installation line, a median 38% of the quote.
 *   - Will's question 4, what the upfront price buys after the install, is
 *     the same question asked the other way round.
 *
 * "Your time" is the first row (16 October). The price objection in the
 * chats is aimed at the labour line ("it's a maximum half day job and you're
 * charging 1000 just for installation"), so the table opens on the visit
 * being a few hours against however long it takes you, and the rows under it
 * are what happens in those hours. Its wording is unchanged.
 *
 * So the table answers the objection the chats actually raise: the right-hand
 * column is a kit bought online, not a rival company, which also keeps it
 * clear of the UK rules on naming competitors. Every left-hand row is
 * something the quotes or Will's process already include; the warranty row
 * is Jordan's answer of 15 October (manufacturer's warranty on the kit, 2 or
 * 5 years on the workmanship). No price: the kit
 * and our quote are rarely the same list of devices, so a figure would
 * compare unlike with unlike.
 *
 * Redesigned 16 October (Gus: "es muy simple"). Same rows, same words. From
 * md, "Fitted by us" is a dark card that stands out of the table, taller
 * than it and with a shadow, closing on the quote button; the kit column
 * stays plain, with a grey cross. Each row label has a line icon. The dark
 * card is a layer behind the middle column, so it reads as one card while
 * the cells stay in a single grid. On phones each row is a small comparison
 * of its own: the label, our line with a tick, the kit's with a cross.
 */

type Row = { icon: ReactNode; label: string; ours: string; theirs: string };

const ICON = "h-4 w-4 shrink-0";

const ROWS: Row[] = [
  { icon: <Clock className={ICON} />, label: "Your time", ours: "One visit, usually a few hours", theirs: "As long as it takes you" },
  { icon: <ListChecks className={ICON} />, label: "Choosing the kit", ours: "Specified for your doors, windows and rooms", theirs: "You work out what you need" },
  { icon: <MapPin className={ICON} />, label: "Placing it", ours: "Sited to cover the ways in, set for your pets", theirs: "You place and tune each device" },
  { icon: <Settings2 className={ICON} />, label: "Setting it up", ours: "App, users and arming modes done before we leave", theirs: "You set up the app and pair every device" },
  { icon: <BadgeCheck className={ICON} />, label: "Testing", ours: "Every device walk-tested on the day", theirs: "Up to you" },
  { icon: <PhoneCall className={ICON} />, label: "If something goes wrong", ours: "The team that fitted it, on the phone", theirs: "The manufacturer's helpline" },
  { icon: <ShieldCheck className={ICON} />, label: "Warranty", ours: "The manufacturer's on the kit, plus 2 or 5 years on the fitting", theirs: "The manufacturer's on the kit" },
  { icon: <CirclePlus className={ICON} />, label: "Adding to it later", ours: "A short visit, no rewiring", theirs: "Another job for you" },
];

/** The middle column of `grid-cols-[0.9fr_1.2fr_1.2fr]`, for the dark card. */
const COLS = "md:grid-cols-[0.9fr_1.2fr_1.2fr]";

function QuoteButton({ className = "" }: { className?: string }) {
  return (
    <a
      href="#quote"
      className={`focus-ring-solid flex h-control-lg items-center justify-center gap-2 rounded-lg bg-primary px-5 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover ${className}`}
    >
      Get my free quote
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </a>
  );
}

export function SecurityCompareSection() {
  return (
    <section id="installation" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Fitted, not flat-packed</p>
          <h2 className="mt-4 h2-section text-foreground">
            What the installation
            <br className="hidden sm:block" /> pays for.
          </h2>
          <p className="mt-5 text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            You can buy Ajax kit online and fit it yourself. What you pay us for is everything after the box, and
            someone to call when you need us.
          </p>
        </div>

        {/* md and up: one grid, three columns. Behind it, the white table and,
            over that, the dark card for the middle column (27.27% in, 36.36%
            wide, from 0.9 / 1.2 / 1.2), taller than the table. */}
        <div className="relative mx-auto mt-16 hidden max-w-5xl md:mt-20 md:block">
          <div aria-hidden="true" className="absolute inset-0 rounded-2xl border border-border bg-background" />
          <div
            aria-hidden="true"
            className="absolute -bottom-6 -top-6 left-[27.2727%] w-[36.3636%] rounded-3xl bg-foreground shadow-raised"
          />

          <div className={`relative grid ${COLS}`}>
            <div />
            <div className="px-7 pb-6 pt-2">
              <p className="text-label font-semibold uppercase tracking-[0.14em] text-background/55">InstallPros</p>
              <p className="mt-1 text-lead font-semibold text-background">Fitted by us</p>
            </div>
            <div className="px-7 pb-6 pt-2">
              <p className="text-label font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">Bought online</p>
              <p className="mt-1 text-lead font-semibold text-muted-foreground">A kit you fit yourself</p>
            </div>
          </div>

          <dl className="relative">
            {ROWS.map((r) => (
              <div key={r.label} className={`grid ${COLS}`}>
                <dt className="flex items-center gap-3 border-t border-border px-7 py-5 text-body-sm font-semibold text-foreground">
                  <span aria-hidden="true" className="text-muted-foreground">
                    {r.icon}
                  </span>
                  {r.label}
                </dt>
                <dd className="flex items-start gap-3 border-t border-background/10 px-7 py-5 text-body-sm font-medium text-background">
                  <CircleCheck aria-hidden="true" className="mt-[2px] h-[18px] w-[18px] shrink-0 text-success-bright" />
                  {r.ours}
                </dd>
                <dd className="flex items-start gap-3 border-t border-border px-7 py-5 text-body-sm text-muted-foreground">
                  <X aria-hidden="true" className="mt-[2px] h-[18px] w-[18px] shrink-0 text-muted-foreground/50" />
                  {r.theirs}
                </dd>
              </div>
            ))}
          </dl>

          <div className={`relative grid ${COLS}`}>
            <div />
            <div className="px-7 pb-2 pt-4">
              <QuoteButton />
            </div>
            <div />
          </div>
        </div>

        {/* Phones and small tablets: each row a comparison of its own. */}
        <div className="mx-auto mt-12 max-w-xl md:hidden">
          <div className="flex items-center justify-center gap-5 text-caption font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CircleCheck aria-hidden="true" className="h-4 w-4 text-success" />
              Fitted by us
            </span>
            <span className="flex items-center gap-1.5">
              <X aria-hidden="true" className="h-4 w-4 text-muted-foreground/60" />
              A kit you fit yourself
            </span>
          </div>
          <dl className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
            {ROWS.map((r, i) => (
              <div key={r.label} className={`px-5 py-4 ${i > 0 ? "border-t border-border" : ""}`}>
                <dt className="flex items-center gap-2 text-label font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <span aria-hidden="true">{r.icon}</span>
                  {r.label}
                </dt>
                <dd className="mt-2 flex items-start gap-2 text-body-sm font-semibold text-foreground">
                  <CircleCheck aria-hidden="true" className="mt-[2px] h-4 w-4 shrink-0 text-success" />
                  {r.ours}
                </dd>
                <dd className="mt-1 flex items-start gap-2 text-body-sm text-muted-foreground">
                  <X aria-hidden="true" className="mt-[2px] h-4 w-4 shrink-0 text-muted-foreground/50" />
                  {r.theirs}
                </dd>
              </div>
            ))}
          </dl>
          <QuoteButton className="mt-5" />
        </div>
      </div>
    </section>
  );
}
