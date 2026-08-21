import { PageHeader, Section, Code, Mono, Rule, Table } from "../../_components/docs";

export const metadata = { title: "Folder structure" };

export default function StructurePage() {
  return (
    <>
      <PageHeader
        title="Folder structure"
        lead="Where each kind of file lives, and the rule that decides it: a component goes in the folder of the thing that owns its design language, not the page that happens to use it first."
      />

      <Section title="The tree">
        <Code>{`src/
  app/
    globals.css              ← every theme lives here, nowhere else
    (design)/design/         ← this site. Not part of the product.
    install-quote/           ← the funnel (theme-editorial)
    starlink-installation/   ← A/B twin of the above
    starlink-installations/  ← the .ipx landing, its own CSS file
    dashboard/               ← admin app (theme-product)
    api/

  components/
    funnel/                  ← the funnel design language
      ui/                    ← primitives: button, input, form-option…
      *-section.tsx          ← composites: one per page section
    ui/                      ← shadcn primitives, shared by admin
    dashboard/               ← admin-only
    landing/                 ← retired Phase-1 page
    analytics/ experiments/  ← non-visual

  lib/                       ← no JSX. Data, validation, integrations.
  hooks/

scripts/
  extract-tokens.mjs         ← regenerates the docs token data`}</Code>
      </Section>

      <Section title="The three themes" note="All scoped, all in globals.css, none of them leak.">
        <Table
          head={["Theme", "Applied by", "Covers"]}
          rows={[
            [<Mono key="a">.theme-editorial</Mono>, "wrapper div on the page", "install-quote, starlink-installation, faqs, same-day-quote, upload-property-images"],
            [<Mono key="b">.theme-product</Mono>, "dashboard layout", "the internal app"],
            [<Mono key="c">:root</Mono>, "default", "retired Phase-1 styling"],
          ]}
        />
        <div className="mt-6">
          <Rule>
            <Mono>/starlink-installations</Mono> is a fourth language, it has its own{" "}
            <Mono>landing.css</Mono> scoped under <Mono>.ipx</Mono>, with a dark and a light mode. It is not part of this
            system yet. Do not copy values between the two: <Mono>#f5f5f5</Mono> is a surface in one and a text colour in
            the other.
          </Rule>
        </div>
      </Section>

      <Section title="Where does my file go?">
        <ul className="space-y-3 text-[15px] leading-[1.7] text-neutral-600">
          <li>
            <strong className="text-neutral-900">Reusable, no content of its own</strong> → <Mono>components/funnel/ui/</Mono>
          </li>
          <li>
            <strong className="text-neutral-900">A whole page section, owns its copy</strong> →{" "}
            <Mono>components/funnel/*-section.tsx</Mono>
          </li>
          <li>
            <strong className="text-neutral-900">No JSX</strong> → <Mono>lib/</Mono>. Validation, API clients, data.
          </li>
          <li>
            <strong className="text-neutral-900">A colour, size or duration</strong> → <Mono>globals.css</Mono>, never
            inline in the component.
          </li>
        </ul>
      </Section>

      <Section title="Rules that hold the structure together">
        <ul className="space-y-3 text-[15px] leading-[1.7] text-neutral-600">
          <li>One theme block per design language, all in <Mono>globals.css</Mono>. No per-component CSS files.</li>
          <li>No <Mono>-v2</Mono> folders. Staging copies get promoted or deleted, never left beside the original.</li>
          <li><Mono>lib/</Mono> never imports from <Mono>components/</Mono>. The dependency only runs one way.</li>
          <li>This docs site imports the real components. It never keeps its own copy.</li>
        </ul>
      </Section>
    </>
  );
}
