import { Check, Minus } from "lucide-react";

type Option = {
  name: string;
  recommended?: boolean;
  summary: string;
  gets: string[];
  loses: string[];
  bestFor: string;
};

/**
 * Permanent or removable.
 *
 * 7 of the 30 vehicle conversations raise it, which makes it the fourth most
 * asked question in the segment, and until now it lived only in the FAQ.
 * "I'm thinking a permanent installation, I don't plan on changing the MH for
 * a few years. Also want to just pull up at a destination and it does all the
 * work of finding g signal", "Removable", "No factory fit only", "You said
 * that it can be removed when not in use", "We are looking for a fixed not
 * magnetic unit.", "Portable is what I am looking for", "May also sometimes I
 * can carry with me on a hike".
 *
 * The recommendation is permanent, and the reason is the one the engineers
 * give in the chat: the mount is the easy part, the wiring is what makes it
 * just work. The removable column is written as an honest trade, not a
 * strawman, because three of the seven wanted it for a real reason (changing
 * the vehicle, taking the dish on foot).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CONFIRM WITH WILL before this page takes traffic: that a removable fit is
 * still offered at all. He cut the no-install travel kit in the chat ("please
 * stop sending this vehicle kit. We're only doing installs now"), and it is
 * not clear whether a fitted magnetic base with a plug-in lead survived that.
 * If it did not, drop the second column and this becomes a single panel,
 * "Why we fit it permanently".
 * ─────────────────────────────────────────────────────────────────────────────
 */
const OPTIONS: Option[] = [
  {
    name: "Permanent",
    recommended: true,
    summary: "Wired in, hidden, and working the moment you pull up.",
    gets: [
      "A fused feed from your 12 V system: nothing to plug in, nothing to forget",
      "Stays on the roof and works while you drive",
      "Cable inside the vehicle, sealed where it enters",
    ],
    loses: ["Moving it to another vehicle is a job for us, not a five-minute swap"],
    bestFor: "A vehicle you are keeping, and more than the odd weekend away.",
  },
  {
    name: "Removable",
    summary: "The dish lifts off a fitted base when the vehicle is parked up.",
    gets: [
      "Comes off in seconds and goes in a locker, a car or a rucksack",
      "Takes the dish with you when you change vehicle",
    ],
    loses: [
      "Power is a lead to a 12 V socket, so it is plugged in each trip",
      "A magnetic base needs a steel roof; on GRP or aluminium it is a clamp",
    ],
    bestFor: "A vehicle you will change soon, or a dish you also want on foot.",
  },
];

export function PermanentOrRemovable() {
  return (
    <div className="mt-16 md:mt-20">
      <div className="max-w-2xl">
        <p className="eyebrow">Permanent or removable?</p>
        <h3 className="mt-3 h2-form text-foreground">Permanent, unless you have a reason not to.</h3>
        <p className="mt-3 text-body-sm leading-[1.65] text-muted-foreground">
          The mount is the easy part. The wiring is what makes it just work, and that is the part a
          removable set-up gives up.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="bg-background p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <h4 className="text-lead font-semibold text-foreground">{o.name}</h4>
              {o.recommended && (
                <span className="rounded-full border border-brand-icon px-2.5 py-0.5 text-micro font-semibold uppercase tracking-[0.14em] text-brand-icon">
                  What we recommend
                </span>
              )}
            </div>
            <p className="mt-2 text-body-sm text-foreground">{o.summary}</p>
            <ul className="mt-5 space-y-2.5">
              {o.gets.map((g) => (
                <li key={g} className="flex gap-2.5 text-body-sm leading-[1.6] text-muted-foreground">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-brand-icon" aria-hidden="true" />
                  <span>{g}</span>
                </li>
              ))}
              {o.loses.map((l) => (
                <li key={l} className="flex gap-2.5 text-body-sm leading-[1.6] text-muted-foreground">
                  <Minus className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-60" aria-hidden="true" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-border pt-4 text-caption text-muted-foreground">
              <span className="font-semibold text-foreground">Best for: </span>
              {o.bestFor}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-caption text-muted-foreground">
        Not sure? Tell us how you use the vehicle when you send the photo and we recommend one before
        we quote.
      </p>
    </div>
  );
}
