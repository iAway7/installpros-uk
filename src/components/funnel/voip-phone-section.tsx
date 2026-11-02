import type { ReactNode } from "react";
import { Cable, Grid3x3, Phone, Smartphone } from "lucide-react";

/**
 * "The phone": what it looks like and the two questions buyers asked before
 * paying (voip-research, section 1): will my old phones work (7 chats), and
 * can every handset call out (3 buyers had extensions that only answered).
 * People asked to see the handset, and one asked for large keys; no
 * competitor shows a large-key phone.
 *
 * Assumptions until Will answers (voip-research/supuestos-para-will.md):
 * a Yealink DECT cordless set (question 7), a large-key option (7), extra
 * handsets worded to be true either way (4), old phones with an adapter and a
 * free check, as his WordPress page says (3), UK calls included (9).
 *
 * PHOTOGRAPH: the real handset and base, once Will names the model.
 */

type Card = { icon: ReactNode; title: string; detail: string };

const ICON = "h-5 w-5";

const CARDS: Card[] = [
  { icon: <Phone className={ICON} />, title: "The handset", detail: "A cordless phone and base, set up before it reaches you." },
  { icon: <Grid3x3 className={ICON} />, title: "Big buttons if you need them", detail: "A large-key handset for anyone with poor eyesight." },
  {
    icon: <Smartphone className={ICON} />,
    title: "More handsets round the house",
    detail: "Upstairs, the kitchen, the garden office. Tell us who needs to call out and we'll set each one up that way.",
  },
  { icon: <Cable className={ICON} />, title: "Your old phones", detail: "Often they can stay, with a small adapter. We check the model first, free." },
];

export function VoipPhoneSection() {
  return (
    <section id="phone" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">The phone</p>
          <h2 className="mt-4 text-balance h2-section text-foreground">A proper phone, not an app.</h2>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
          {CARDS.map((c) => (
            <li key={c.title} className="flex flex-col rounded-2xl bg-background p-6">
              <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-brand-icon">
                {c.icon}
              </span>
              <h3 className="mt-4 text-lg font-bold leading-tight text-foreground">{c.title}</h3>
              <p className="mt-2 text-pretty text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                {c.detail}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-body text-muted-foreground md:mt-10">Calls to UK landlines and mobiles are included.</p>
      </div>
    </section>
  );
}
