import Link from "next/link";
import { PageHeader, Rule } from "./_components/docs";
import { THEME_TOKENS } from "./_data/tokens";

export default function DesignHome() {
  const colorTokens = THEME_TOKENS.filter((t) => t.hex).length;

  return (
    <>
      <PageHeader
        title="InstallPros Design System"
        lead="The system behind installpros.co.uk. Every page here renders the same components and the same tokens that ship to production — there is no second copy to keep in sync."
      />

      <section className="mb-16 grid gap-4 sm:grid-cols-3">
        {[
          { n: String(colorTokens), l: "colour tokens" },
          { n: "12", l: "type styles" },
          { n: "1", l: "theme — .theme-funnel" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-neutral-200 p-6">
            <div className="text-[34px] font-normal leading-none tracking-[-0.03em]">{s.n}</div>
            <div className="mt-2 text-[14px] text-neutral-500">{s.l}</div>
          </div>
        ))}
      </section>

      <section className="mb-16">
        <h2 className="text-[22px] font-semibold tracking-[-0.02em]">The three rules</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          Most of the system is descriptive — it records what the site already does. These three are prescriptive, and
          the page was inconsistent about all of them before the system existed.
        </p>
        <div className="mt-6 space-y-4">
          <Rule>
            <strong>Red is for the primary button.</strong> Brand red also carries section eyebrows, and nothing else.
            Selected states, checked boxes and focus rings use the neutral <code>--selection</code> instead, so the CTA is
            the only thing on the page competing for a click.
          </Rule>
          <Rule>
            <strong>One error red and one success green.</strong> The page used to carry two reds for validation and
            three greens for success, picked at random per component.
          </Rule>
          <Rule>
            <strong>No literal colours in components.</strong> If a value is not a token, it will drift. The four brand
            reds and the ten copies of <code>#1A1512</code> are what this system replaced.
          </Rule>
        </div>
      </section>

      <section>
        <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Start here</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { href: "/design/foundations/color", t: "Color", d: "Tokens in both modes, and which red means what." },
            { href: "/design/foundations/typography", t: "Typography", d: "Display-XL through Caption, with every spec." },
            { href: "/design/foundations/spacing", t: "Spacing & radius", d: "The vertical rhythm and the radius scale." },
            { href: "/design/components/button", t: "Button", d: "Variants, sizes and states, rendered live." },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-xl border border-neutral-200 p-6 transition-colors hover:border-neutral-400"
            >
              <div className="text-[16px] font-semibold">{c.t}</div>
              <div className="mt-1.5 text-[14px] leading-[1.55] text-neutral-500">{c.d}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
