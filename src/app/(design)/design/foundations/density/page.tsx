import { PageHeader, Section, Mono, Rule } from "../../_components/docs";
import { SCALES } from "../../_data/tokens";

export const metadata = { title: "Density" };

const differing = SCALES.flatMap((f) => f.rows).filter((r) => r.differs).length;
const total = SCALES.flatMap((f) => f.rows).length;

/**
 * Every number in this table is read out of globals.css by
 * scripts/extract-tokens.mjs, which runs before dev and before build. Nothing
 * here is typed by hand, so the page cannot drift from the theme — which
 * matters more here than anywhere else, because these are the values a reader
 * is most likely to copy into a component.
 */
export default function DensityPage() {
  return (
    <>
      <PageHeader
        title="Density"
        lead="One component library, two densities. Editorial is the marketing funnel — read once, on a phone, by someone who has never seen the site. Product is the dashboard — used daily by someone who knows where everything is. The same component renders differently in each because the token underneath it resolves differently."
      />

      <Section title="What density is not">
        <Rule>
          It is not two component libraries, and it is not two folders.{" "}
          <Mono>components/system</Mono> holds one set of pieces; <Mono>components/funnel</Mono> and{" "}
          <Mono>components/dashboard</Mono> are screens. The density is a single class on the page —{" "}
          <Mono>.theme-editorial</Mono> or <Mono>.theme-product</Mono> — and everything below it
          resolves from that. Adding a second copy of a component for one density is the thing this
          arrangement exists to prevent.
        </Rule>
      </Section>

      <Section
        title="The scalar tokens"
        note={`${total} of them. Product retunes ${differing}; the rest are shared on purpose.`}
      >
        <div className="space-y-10">
          {SCALES.map((f) => (
            <div key={f.family}>
              <h3 className="text-[13px] font-medium uppercase tracking-wide text-neutral-500">
                {f.family}
              </h3>
              <table className="mt-3 w-full border-collapse text-[14px]">
                <thead>
                  <tr className="border-b border-neutral-200 text-left text-[12px] text-neutral-500">
                    <th className="py-2 pr-4 font-medium">Token</th>
                    <th className="py-2 pr-4 font-medium">Editorial</th>
                    <th className="py-2 pr-4 font-medium">Product</th>
                  </tr>
                </thead>
                <tbody>
                  {f.rows.map((r) => (
                    <tr key={r.name} className="border-b border-neutral-100">
                      <td className="py-2 pr-4">
                        <Mono>{r.name}</Mono>
                      </td>
                      <td className="py-2 pr-4 text-neutral-900">{r.editorial}</td>
                      <td className={`py-2 pr-4 ${r.differs ? "text-neutral-900" : "text-neutral-400"}`}>
                        {r.differs ? r.product : "same"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Two that deliberately do not move">
        <Rule>
          <Mono>--text-field</Mono> stays at 16px in both. Below 16px, iOS Safari zooms the page when
          a field takes focus, and a denser dashboard is not worth that. Everything else in Product
          steps down one rung; a form field does not.
        </Rule>
        <Rule>
          The border widths are shared too. A field is 1.5px and a selectable control is 2px in both
          densities. If Product ever wants a finer field it can retune the token, but there is no
          reason to yet, and a difference with no reason is drift.
        </Rule>
      </Section>

      <Section title="Where the numbers come from">
        <Rule>
          <Mono>scripts/extract-tokens.mjs</Mono> reads <Mono>globals.css</Mono> and writes this
          table as data. It runs on <Mono>predev</Mono> and <Mono>prebuild</Mono>, so a token that
          changes in CSS updates this page on the next run. Nothing above is typed by hand.
        </Rule>
      </Section>
    </>
  );
}
