import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { Button } from "@/components/system/button";

/**
 * PRE-FILLED so the request arrives unambiguous. The team lives in WhatsApp
 * (the whole Superchat corpus is WhatsApp), so this is the channel with the
 * least friction and it needs no new API route, no lead-schema wrangling and
 * no new analytics event. When the pack becomes a real PDF this can become a
 * gated download instead, and the Google Ads conversion question gets decided
 * then rather than now: firing `lead_submission` for a document request would
 * mix two different actions in the data the bidding runs on.
 */
const PACK_REQUEST_URL =
  "https://wa.me/447446112343?text=" +
  encodeURIComponent("Hi, please send me the landlord pack for a commercial Starlink install.");

type PackItem = { title: string; detail: string };

/**
 * Straight from what building managers actually asked for in the chat log:
 * "Building management team have asked for data sheet and RAMS", "i need some
 * specifications for the landlord the what is gonna be in the roof sizes how
 * many cable the size of the panel in the roof", "would an asbestos report be
 * required", "would need risk assessment and harness for working at height".
 */
const PACK: PackItem[] = [
  {
    title: "Equipment data sheet",
    detail: "Dish dimensions and weight, and the load it puts on the roof",
  },
  {
    title: "Mount photographs",
    detail: "What stays on the building once we leave",
  },
  {
    title: "Cable route drawing",
    detail: "Entry point, how many penetrations and what diameter",
  },
  {
    title: "Sample RAMS",
    // A real RAMS is site specific. Publishing a generic one as though it
    // covered a particular building would be the kind of paperwork that gets
    // rejected on the day, so it is labelled a sample here and in the pack.
    detail: "Method statement and risk assessment, including work at height. The site specific version follows the survey",
  },
  {
    title: "£10m insurance certificate",
    detail: "Public liability, professional indemnity, employers' liability and cyber",
  },
  {
    title: "Asbestos note",
    detail: "When a survey is needed before we drill, and when it is not",
  },
];

function IconDoc() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v5h5" />
    </svg>
  );
}

/**
 * The landlord pack.
 *
 * Most commercial sites are leased, so the person writing to us cannot say yes
 * to the install. They can say yes to asking. The one who decides is the
 * landlord or the building management team, and that person does not approve
 * anything over WhatsApp: they ask for documents.
 *
 * Three conversations in the Superchat corpus stall at exactly this point, and
 * one was only won after chasing the team for days to assemble the paperwork by
 * hand. Today it is improvised every time.
 *
 * The section does three jobs at once, which is why it is worth more than its
 * size suggests:
 *
 *  1. It unblocks the person who is stuck.
 *  2. It is the only thing on this page built to be forwarded. Most open
 *     commercial conversations are waiting on a boss, a trustee, a landlord or
 *     a building manager, and everything else here assumes the reader decides.
 *  3. Someone who asks for this is not browsing, they are trying to get an
 *     install approved. It is the best-qualified contact on the page.
 *
 * It also differentiates: no Starlink installer in the UK publishes this. It is
 * what a construction contractor sends, not what an aerial fitter sends.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LAUNCH BLOCKER, same class as the client logos above it.
 *
 * THE PACK DOES NOT EXIST YET. This section promises documents nobody has
 * confirmed InstallPros holds. It renders so Will can see what is being asked
 * of him, and it must not reach a public, indexable page until he supplies the
 * data sheet, the mount photographs, a cable-route drawing, a sample RAMS and
 * the insurance certificate. If some of those do not exist, cut those rows
 * rather than shipping a list the team cannot fulfil.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function LandlordPackSection() {
  return (
    <section id="landlord-pack" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow">Leased and managed sites</p>
            <h2 className="mt-4 h2-section text-foreground">Your landlord will want paperwork.</h2>
            <p className="mt-5 max-w-md text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
              Most commercial units are leased, and the building manager decides what goes on the
              roof. We send you everything they normally ask for, so chasing it is not your job.
            </p>
            <div className="mt-8">
              <Button asChild>
                <a href={PACK_REQUEST_URL} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
                  Ask us for the landlord pack
                </a>
              </Button>
            </div>
            <p className="mt-4 text-caption text-muted-foreground">
              No survey booked and nothing to pay. Send it on to whoever has to approve the work.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-6 md:p-8">
            <p className="text-label font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              What is in the pack
            </p>
            <ul className="mt-5">
              {PACK.map((item, i) => (
                <li
                  key={item.title}
                  className={`flex gap-3.5 py-4 ${i === 0 ? "" : "border-t border-border"}`}
                >
                  <span className="mt-0.5 shrink-0 text-brand-icon">
                    <IconDoc />
                  </span>
                  <span>
                    <span className="block text-body-sm font-semibold text-foreground">{item.title}</span>
                    <span className="mt-1 block text-caption leading-[1.6] text-muted-foreground">
                      {item.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
