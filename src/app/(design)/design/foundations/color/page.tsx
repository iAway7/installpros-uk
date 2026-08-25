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
        note="Conventions, not a scale. 159 uses across 16 values — these are the ones that already agree."
      >
        <Table
          head={["Use", "Value", "Agreement"]}
          rows={[
            ["Soft brand or status tint on light", <Mono key="a">/10</Mono>, "23 of 30"],
            ["Brand border, resting", <Mono key="b">/25</Mono>, "5 of 7"],
            ["Brand border, hover", <Mono key="c">/35</Mono>, "6 of 6"],
            ["Modal and drawer scrim", <Mono key="d">bg-black/40</Mono>, "2 of 2"],
          ]}
        />
        <Rule>
          Reach for these before inventing a number. Most of the variation that exists is one person
          writing what looked right without comparing it to the element beside it.
        </Rule>
        <Rule>
          Some of the variation is doing work and should stay. <Mono>text-white</Mono> runs 50 through
          95 on the dark hero because that is a text hierarchy, not five attempts at one value.
        </Rule>
        <Rule>
          There is deliberately no five-step scale to snap everything to. Moving an opacity by five
          points on a saturated colour is a ΔE of about 5 — comfortably visible, not a rounding
          error. Sweeping 159 values into a scale would repaint the site element by element without
          anyone having decided to. The measured drift that remains — <Mono>border-white</Mono> at
          six values across eleven uses, <Mono>text-muted-foreground</Mono> at four — is recorded in
          the audit rather than quietly fixed.
        </Rule>
      </Section>
    </>
  );
}
