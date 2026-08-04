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
        <h2 className="text-[22px] font-semibold tracking-[-0.02em]">How this is organised</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          Foundations and tokens are the decisions. Primitives, composites and patterns are the things built from them.
          The rest is the scaffolding that keeps it consistent.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { href: "/design/foundations/color", t: "Foundations", d: "Color, typography, spacing, motion — the raw visual decisions." },
            { href: "/design/tokens", t: "Design tokens", d: "How a decision travels from globals.css into a component." },
            { href: "/design/primitives/button", t: "Primitives", d: "Button, input, selection. No business logic." },
            { href: "/design/composites", t: "Composites", d: "Cards, stats, accordion — primitives assembled." },
            { href: "/design/patterns", t: "Patterns", d: "How the lead capture and the proof stacking work." },
            { href: "/design/layout", t: "Layout system", d: "One container, one rhythm, three grids." },
            { href: "/design/responsive", t: "Responsive rules", d: "Two layouts. Everything happens at 768px." },
            { href: "/design/accessibility", t: "Accessibility", d: "WCAG AA — what is guaranteed and what is not." },
            { href: "/design/conventions/naming", t: "Naming", d: "Why --primary is red and there is only one H2." },
            { href: "/design/conventions/structure", t: "Folder structure", d: "Where a file goes, and the three themes." },
            { href: "/design/migration", t: "Migration plan", d: "Six phases. Three done, one in progress." },
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
