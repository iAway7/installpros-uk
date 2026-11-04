import type { ReactNode } from "react";
import { Cable, Smartphone } from "lucide-react";

/**
 * "The phone": what it looks like and the two questions buyers asked before
 * paying (voip-research, section 1): will my old phones work (7 chats), and
 * can every handset call out (3 buyers had extensions that only answered).
 * People asked to see the handset, and one asked for large keys; no
 * competitor shows a large-key phone.
 *
 * So the two handsets get a photo each (Gus's Gemini renders, 3 November,
 * generic until Will names the model), and the two questions sit under them
 * as text cards.
 *
 * Assumptions until Will answers (voip-research/supuestos-para-will.md):
 * a cordless DECT set (question 7), a large-key option (7), extra handsets
 * worded to be true either way (4), old phones with an adapter and a free
 * check, as his WordPress page says (3), UK calls included (9).
 */

type Photo = { src: string; srcSet: string; alt: string; title: string; detail: string };

const PHOTOS: Photo[] = [
  {
    src: "/funnel/voip-handset-1000.webp",
    srcSet: "/funnel/voip-handset-640.webp 640w, /funnel/voip-handset-1000.webp 1000w",
    alt: "A black cordless phone in its charging cradle, with its base and a UK plug",
    title: "The handset",
    detail: "A cordless phone and base, set up before it reaches you.",
  },
  {
    src: "/funnel/voip-bigkeys-1000.webp",
    srcSet: "/funnel/voip-bigkeys-640.webp 640w, /funnel/voip-bigkeys-1000.webp 1000w",
    alt: "A white cordless phone with big black number keys, in its charging cradle",
    title: "Big buttons if you need them",
    detail: "A large-key handset for anyone with poor eyesight.",
  },
];

type Card = { icon: ReactNode; title: string; detail: string };

const ICON = "h-5 w-5";

const CARDS: Card[] = [
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
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">The phone</p>
          <h2 className="mt-4 text-balance h2-section text-foreground">A proper phone, not an app.</h2>
        </div>

        <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 md:mt-12">
          {PHOTOS.map((p, i) => (
            <li key={p.title} data-reveal style={{ transitionDelay: `${i * 80}ms` }} className="flex flex-col overflow-hidden rounded-2xl bg-background">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                srcSet={p.srcSet}
                sizes="(min-width: 640px) 50vw, 100vw"
                alt={p.alt}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-bold leading-tight text-foreground">{p.title}</h3>
                <p className="mt-2 text-pretty text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                  {p.detail}
                </p>
              </div>
            </li>
          ))}
          {CARDS.map((c, i) => (
            <li key={c.title} data-reveal style={{ transitionDelay: `${i * 80}ms` }} className="flex gap-4 rounded-2xl bg-background p-6">
              <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-brand-icon">
                {c.icon}
              </span>
              <div>
                <h3 className="text-lg font-bold leading-tight text-foreground">{c.title}</h3>
                <p className="mt-2 text-pretty text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                  {c.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-body text-muted-foreground md:mt-10">Calls to UK landlines and mobiles are included.</p>
      </div>
    </section>
  );
}
