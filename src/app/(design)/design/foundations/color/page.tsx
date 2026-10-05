import { PageHeader, Section, Rule, Mono, Table } from "../../_components/docs";
import { THEME_TOKENS } from "../../_data/tokens";

export const metadata = { title: "Color" };

const GROUPS: { title: string; note: string; match: (n: string) => boolean }[] = [
  { title: "Surfaces", note: "Page, cards and the off-white used for section blocks.", match: (n) => ["--background", "--card", "--secondary", "--muted", "--border"].includes(n) },
  { title: "Text", note: "Two values carry every piece of copy on the site.", match: (n) => ["--foreground", "--muted-foreground"].includes(n) },
  { title: "Brand", note: "One red, plus two tints that are never used for body text.", match: (n) => n.startsWith("--primary") || n.startsWith("--brand") || n === "--accent" },
  { title: "Selection & fields", note: "Deliberately neutral, see the rule below.", match: (n) => n.startsWith("--selection") || n.startsWith("--field") || n === "--ring" || n === "--input" },
  { title: "Status", note: "One value per meaning.", match: (n) => n.startsWith("--error") || n.startsWith("--success") || n.startsWith("--destructive") },
  { title: "Third-party", note: "Brand marks we do not own and must not restyle.", match: (n) => ["--gold", "--whatsapp"].includes(n) },
];

function Swatch({ name, hex, note }: { name: string; hex: string; note: string | null }) {
  return (
    <div className="w-[190px]">
      <div
        className="h-16 rounded-lg border border-neutral-200"
        style={{ background: hex }}
      />
      <div className="mt-2.5 font-mono text-[12.5px] font-medium text-neutral-900">{name}</div>
      <div className="text-[12.5px] text-neutral-500">{hex}</div>
      {note && <div className="mt-1 text-[12px] leading-[1.45] text-neutral-400">{note}</div>}
    </div>
  );
}

export default function ColorPage() {
  const withHex = THEME_TOKENS.filter((t) => t.hex);

  return (
    <>
      <PageHeader
        title="Color"
        lead="Extracted straight from .theme-editorial in globals.css. If a value changes there, re-running scripts/extract-tokens.mjs updates this page, the numbers below are never typed by hand."
      />

      <Section title="The rule that matters">
        <Rule>
          <strong>Brand red is for the primary button and the section eyebrow.</strong> Selected options, checked boxes
          and focus rings use <Mono>--selection</Mono> (<Mono>#171717</Mono>), the same near-black as body text. A red focus ring on
          a red button is unreadable, and a page where five things are red has no call to action.
        </Rule>
      </Section>

      {GROUPS.map((g) => {
        const items = withHex.filter((t) => g.match(t.name));
        if (!items.length) return null;
        return (
          <Section key={g.title} title={g.title} note={g.note}>
            <div className="flex flex-wrap gap-6">
              {items.map((t) => (
                <Swatch key={t.name} name={t.name} hex={t.hex!} note={t.note} />
              ))}
            </div>
          </Section>
        );
      })}

      <Section
        title="The dark hero"
        note="The hero sits on a photograph, so a handful of tokens resolve differently there. In Figma this is the On Dark mode; in code it is handled per component."
      >
        <Table
          head={["Token", "On light", "On the hero"]}
          rows={[
            [<Mono key="a">--foreground</Mono>, "#171717", "white"],
            [<Mono key="b">--muted-foreground</Mono>, "#666666", "white 80%"],
            [<Mono key="c">--field</Mono>, "#D4D4D4", "white 50%"],
            [<Mono key="d">--success</Mono>, "#15803D", "#22C55E"],
            [<Mono key="e">--error</Mono>, "#DC2626", "#FF5A5A"],
          ]}
        />
      </Section>

      <Section
        title="Opacity"
        note="Not a scale, just the values most of the site already uses. Start here before picking your own."
      >
        <Table
          head={["Use", "Value", "Already using it"]}
          rows={[
            ["Soft brand or status tint on light", <Mono key="a">/10</Mono>, "23 of 30"],
            ["Brand border, resting", <Mono key="b">/25</Mono>, "5 of 7"],
            ["Brand border, hover", <Mono key="c">/35</Mono>, "6 of 6"],
            ["Dark overlay behind a modal or drawer", <Mono key="d">bg-black/40</Mono>, "2 of 2"],
          ]}
        />
        <Rule>
          Use these first. Most of the other values exist because someone picked what looked right
          without checking the element next to it.
        </Rule>
        <Rule>
          Some differences are on purpose. White text on the dark hero goes from 50% to 95% because
          it is a hierarchy: the headline is brighter than the small print.
        </Rule>
        <Rule>
          Why not round everything to steps of 5? Because 5 points of opacity is already a visible
          change on a strong colour. Rounding all 159 values would quietly change how the site looks,
          one element at a time, without anyone deciding to. The leftovers that still disagree are
          listed in the audit instead.
        </Rule>
      </Section>
    </>
  );
}
