"use client";

import { THEME_TOKENS } from "../../_data/tokens";
import { Section } from "../../_components/docs";
import { useDensity } from "../../_components/density";

const GROUPS: { title: string; note: string; match: (n: string) => boolean }[] = [
  { title: "Surfaces", note: "Page, cards and the off-white used for section blocks.", match: (n) => ["--background", "--card", "--secondary", "--muted", "--border", "--sidebar"].includes(n) },
  { title: "Text", note: "Two values carry every piece of copy on the site.", match: (n) => ["--foreground", "--muted-foreground"].includes(n) },
  { title: "Brand", note: "Red in Editorial, near-black in Product. The tints are never used for body text.", match: (n) => n.startsWith("--primary") || n.startsWith("--brand") || n === "--accent" },
  { title: "Selection & fields", note: "Deliberately neutral, see the rule below.", match: (n) => n.startsWith("--selection") || n.startsWith("--field") || n === "--ring" || n === "--input" },
  { title: "Status", note: "One value per meaning.", match: (n) => n.startsWith("--error") || n.startsWith("--success") || n.startsWith("--warning") || n.startsWith("--destructive") },
  { title: "Charts", note: "The one place colour is used for data. The main series is the mid blue, the comparison the light one.", match: (n) => n.startsWith("--chart") },
  { title: "Third-party", note: "Brand marks we do not own and must not restyle.", match: (n) => ["--gold", "--whatsapp"].includes(n) },
];

function Swatch({ name, hex, note, differs }: { name: string; hex: string; note: string | null; differs: boolean }) {
  return (
    <div className="w-[190px]">
      <div
        className="h-16 rounded-lg border border-neutral-200"
        style={{ background: hex }}
      />
      <div className="mt-2.5 font-mono text-[12.5px] font-medium text-neutral-900">{name}</div>
      <div className="text-[12.5px] text-neutral-500">
        {hex}
        {differs && <span className="text-neutral-400"> · differs by density</span>}
      </div>
      {note && <div className="mt-1 text-[12px] leading-[1.45] text-neutral-400">{note}</div>}
    </div>
  );
}

/**
 * The colour tokens in whichever density the docs header is set to. Product
 * values come from .theme-product, Editorial from :root and .theme-editorial;
 * the extractor resolves both, so nothing here is typed by hand.
 */
export function ColorGroups() {
  const { density } = useDensity();
  const hexOf = (t: (typeof THEME_TOKENS)[number]) => (density === "product" ? t.productHex : t.hex);
  const withHex = THEME_TOKENS.filter((t) => hexOf(t));
  return (
    <>
      {GROUPS.map((g) => {
        const items = withHex.filter((t) => g.match(t.name));
        if (!items.length) return null;
        return (
          <Section key={g.title} title={g.title} note={g.note}>
            <div className="flex flex-wrap gap-6">
              {items.map((t) => (
                <Swatch key={t.name} name={t.name} hex={hexOf(t)!} note={t.note} differs={t.differs} />
              ))}
            </div>
          </Section>
        );
      })}
    </>
  );
}
