import { PageHeader, Section, Rule, Mono, Table } from "../../_components/docs";
import { ColorGroups } from "./color-groups";

export const metadata = { title: "Color" };

export default function ColorPage() {
  return (
    <>
      <PageHeader
        title="Color"
        lead="Read straight from globals.css by scripts/extract-tokens.mjs, so the swatches are never typed by hand. Use the switch at the top to see Product (zinc, the dashboard) or Editorial (the marketing pages, with the brand red)."
      />

      <Section title="The rule that matters">
        <Rule>
          <strong>Brand red is for the primary button and the section eyebrow.</strong> Selected options, checked boxes
          and focus rings use <Mono>--selection</Mono> (<Mono>#171717</Mono>), the same near-black as body text. A red focus ring on
          a red button is unreadable, and a page where five things are red has no call to action.
        </Rule>
      </Section>

      <ColorGroups />

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
