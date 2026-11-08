import { Check } from "lucide-react";

/**
 * The 4G/5G antenna (4g-5g-fibre-research, sections 1, 3 and 5). Light
 * section, text left and points right, in the shape of voip-business-section.
 *
 * Facts it rests on: walls and windows weaken mobile signal, an outside
 * antenna facing the mast avoids them, and a long cable can cancel the gain,
 * so the router goes beside it (Three, Poynting, Teltonika). About 75 people
 * in the chats have little or no signal at all, so the page says plainly that
 * an antenna can't fix that.
 *
 * Never "booster": only indoor and in-vehicle repeaters meeting the 2022
 * Regulations are licence-exempt, outdoor ones are not, and Ofcom approves no
 * product. Staff mixed phone boosters with WiFi boosters in the chats. Never
 * "no planning permission needed" either: the rules depend on size and place
 * and may not strictly cover a 4G/5G antenna. Waits on Will's questions 1, 2,
 * 3, 8 and 9.
 */

const POINTS = [
  "We find the strongest network at your address first.",
  "An antenna for your router, not a signal booster. Some boosters sold online are illegal in the UK.",
  "No signal at all? An antenna can't fix that. Starlink can.",
  "Listed building or conservation area? We check the rules before we fit.",
];

export function ConnectivityAntennaSection() {
  return (
    <section id="antenna" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center md:gap-14">
          <div data-reveal>
            <p className="eyebrow">4G and 5G</p>
            <h2 className="mt-4 text-balance h2-section text-foreground">Weak 4G indoors? Put the antenna outside.</h2>
            <p className="mt-4 text-pretty text-body text-muted-foreground md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
              Walls and windows weaken mobile signal. An antenna on the wall or a pole, facing the mast, avoids them. The
              router sits beside it, so no signal is lost in a long cable.
            </p>
          </div>
          <ul className="space-y-3">
            {POINTS.map((p, i) => (
              <li
                key={p}
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
                className="flex items-start gap-3 rounded-2xl bg-secondary p-5"
              >
                <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <span className="text-pretty text-body text-foreground" style={{ lineHeight: "1.5" }}>
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
