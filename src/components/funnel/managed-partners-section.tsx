import { Check } from "lucide-react";

/**
 * The hand-over nobody covers (managed-research, sections 1.4 and 4.3): in
 * the chats, CCTV fitters waited on site while the "IT department" was in a
 * meeting, and the monitoring company (ARC) was who actually needed the
 * address. No competitor page mentions the ARC or the customer's IT company.
 */

const POINTS = [
  "We speak to your monitoring company and check the cameras get through.",
  "Your IT company gets the details for the VPN or remote access.",
  "If something stops working, we find out whose end it's on.",
];

export function ManagedPartnersSection() {
  return (
    <section id="partners" className="w-full scroll-mt-28 bg-background pb-16 md:pb-24">
      <div className="container mx-auto">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center md:gap-14">
          <div data-reveal>
            <p className="eyebrow">Your other suppliers</p>
            <h2 className="mt-4 text-balance h2-section text-foreground">We work with your IT and alarm companies.</h2>
            <p
              className="mt-4 text-pretty text-body text-muted-foreground md:mt-5 md:text-lg"
              style={{ lineHeight: "1.6" }}
            >
              You don&apos;t have to pass messages between us.
            </p>
          </div>
          <ul className="space-y-3">
            {POINTS.map((p, n) => (
              <li
                key={p}
                data-reveal
                style={{ transitionDelay: `${n * 80}ms` }}
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
