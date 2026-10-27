import type { ReactNode } from "react";
import { Building2, FileText, LayoutGrid, Receipt } from "lucide-react";
import { Gap } from "./hikvision-gap";

/**
 * For businesses. New, from the chats: 24 camera threads were businesses (16
 * buyers, 8 owners): pubs, shops, a pharmacy group, a depot, a takeaway. What
 * they needed and homes didn't (hikvision-research/conversaciones-decision.md,
 * section 7): cameras inside (till, kitchen, stock room), several sites on one
 * app, the make and model on the quote because someone else signs it off
 * ("Because he wants to make sure we getting what we pay"), and an invoice to
 * the company. Five of eleven Hikvision installers split homes and businesses.
 *
 * THE WHOLE SECTION WAITS ON JORDAN'S QUESTION 1. If camera work is homes
 * only, it comes out. "The make and model on your quote" is only true once
 * the quote template names them (today 24 of 63 camera quotes never say
 * Hikvision), so it waits on the team as well.
 */

type Item = { icon: ReactNode; title: string; detail: ReactNode };

const ICON = "h-5 w-5";

const ITEMS: Item[] = [
  {
    icon: <Building2 className={ICON} />,
    title: "Inside and out",
    detail: "The till, the stock room and the kitchen, as well as the door and the car park.",
  },
  {
    icon: <LayoutGrid className={ICON} />,
    title: "Every site on one app",
    detail: "Two shops or three branches, live on the same phone.",
  },
  {
    icon: <FileText className={ICON} />,
    title: "The make and model on the quote",
    detail: <Gap q="Team: quote template">So whoever signs it off knows exactly what they are paying for.</Gap>,
  },
  {
    icon: <Receipt className={ICON} />,
    title: "Invoiced to the company",
    detail: "One quote per site if you need it, and the invoice in the business's name.",
  },
];

export function HikvisionBusinessSection() {
  return (
    <section id="business" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">
            <Gap q="Q1">For businesses</Gap>
          </p>
          <h2 className="mt-4 h2-section text-foreground">
            Shops, pubs and offices,
            <br className="hidden sm:block" /> on the same app.
          </h2>
        </div>

        <ul className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:mt-16 xl:grid-cols-4">
          {ITEMS.map((i) => (
            <li key={i.title} className="rounded-2xl bg-background p-5 sm:rounded-3xl sm:p-6">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-brand-icon"
              >
                {i.icon}
              </span>
              <h3 className="mt-4 text-balance text-base font-bold leading-tight text-foreground sm:text-lg">{i.title}</h3>
              <p className="mt-1.5 text-pretty text-body-sm text-muted-foreground" style={{ lineHeight: "1.5" }}>
                {i.detail}
              </p>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-8 max-w-2xl text-center text-body-sm text-muted-foreground">
          <Gap q="Q7">A larger site may need a visit first. We will tell you when we call.</Gap>
        </p>
      </div>
    </section>
  );
}
