import { whatsappUrl } from "@/lib/funnel/contact";
import { WhatsAppIcon } from "./ui/whatsapp-icon";

/**
 * "Keep your number", straight after the hero (voip-research, section 9):
 * 23 of 28 VoIP buyers wanted to keep their number, it was the first
 * question in 18 chats, and it is what went wrong most (transfers of 6 to 11
 * weeks, 2 numbers lost by cancelling BT first). Most competitors promise it;
 * only 4 of 12 show the steps.
 *
 * No time on the page: staff said 10 days, 2 weeks and 21 days, and real
 * transfers took 6 to 11 weeks (Will, question 2). Step 3 says the phone
 * works from day one, from InstallPros' own "Number Transfer" template and
 * Will's WordPress page (temporary number, old line on until the move).
 */

const STEPS: { title: string; detail: string }[] = [
  { title: "Tell us your number", detail: "Send a photo of your latest phone bill on WhatsApp." },
  { title: "We ask your old provider to move it", detail: "You sign one form. We do the rest." },
  { title: "Your new phone arrives set up", detail: "It makes calls from day one, and your old line keeps working until the number moves." },
  { title: "The number moves over", detail: "Calls come through on the new phone. Then, and only then, cancel the old line." },
];

export function VoipNumberSection() {
  return (
    <section id="number" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Keep your number</p>
          <h2 className="mt-4 text-balance h2-section text-foreground">Keep the number everyone knows.</h2>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex flex-col rounded-2xl bg-secondary p-6">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-body font-semibold tabular-nums text-primary-foreground"
              >
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold leading-tight text-foreground">{s.title}</h3>
              <p className="mt-2 text-pretty text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                {s.detail}
              </p>
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-5 text-center md:mt-12">
          {/* The one instruction that saves the number (2 buyers lost theirs
              by cancelling first). It was a warning box above the steps;
              Gus did not like it there, 3 November. */}
          <p className="text-balance text-body text-muted-foreground">
            <strong className="text-foreground">Don&apos;t cancel your old line yet.</strong> In most cases you keep your
            number. If it can&apos;t be moved, we&apos;ll give you a new local one.
          </p>
          <a
            href={whatsappUrl("Hi, I'd like to keep my landline number on a new phone. Here is a photo of my latest phone bill.")}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring-solid flex h-control-lg w-full items-center justify-center gap-2 rounded-lg border border-foreground/20 bg-transparent px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-foreground transition-colors duration-quick ease-ds hover:bg-secondary sm:w-auto"
          >
            <WhatsAppIcon className="h-[19px] w-[19px]" />
            Send your phone bill
          </a>
        </div>
      </div>
    </section>
  );
}
