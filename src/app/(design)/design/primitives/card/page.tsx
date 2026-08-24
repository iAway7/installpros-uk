import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/system/card";
import { PageHeader, Section, Preview, Code, BestPractices, Rule, Mono } from "../../_components/docs";

export const metadata = { title: "Card" };

export default function CardPage() {
  return (
    <>
      <PageHeader
        title="Card"
        lead="The surface the dashboard is built out of. A bordered box at 16px radius with 24px of padding, which is the ratio cards follow across the system."
      />

      <Section title="With a header" note="The usual shape: title, optional description, content.">
        <Preview>
          <div className="theme-product w-full max-w-md">
            <Card>
              <CardHeader>
                <CardTitle>Leads this week</CardTitle>
                <CardDescription>Everything that came in since Monday.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body text-muted-foreground">42 new, 8 booked.</p>
              </CardContent>
            </Card>
          </div>
        </Preview>
        <Code>{`<Card>
  <CardHeader>
    <CardTitle>Leads this week</CardTitle>
    <CardDescription>Everything that came in since Monday.</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
</Card>`}</Code>
      </Section>

      <Section
        title="Without a header"
        note="Content pads itself. This used to be the one that went wrong."
      >
        <Preview>
          <div className="theme-product w-full max-w-md">
            <Card>
              <CardContent>
                <p className="text-body text-muted-foreground">
                  No header above, so the content keeps its own top padding.
                </p>
              </CardContent>
            </Card>
          </div>
        </Preview>
        <Rule>
          <Mono>CardContent</Mono> used to hardcode <Mono>pt-0</Mono>, which assumes a header sits
          above it. Nine headerless cards had to write <Mono>p-6</Mono> back to undo it. It is now{" "}
          <Mono>p-6</Mono> with <Mono>[&amp;:not(:first-child)]:pt-0</Mono>, so the header keeps
          owning the gap when there is one and the content pads itself when there is not.
        </Rule>
      </Section>

      <Section title="Bleeding to the edge" note="Tables and maps that should touch the border.">
        <Preview>
          <div className="theme-product w-full max-w-md">
            <Card>
              <CardHeader>
                <CardTitle>Coverage</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-t border-border bg-secondary/40 p-6 text-body text-muted-foreground">
                  Full-bleed content
                </div>
              </CardContent>
            </Card>
          </div>
        </Preview>
        <Code>{`<CardContent className="p-0">`}</Code>
      </Section>

      <BestPractices
        when={[
          "Grouping related information behind one border. If there is no grouping to express, a plain section is lighter.",
          "Not for a whole page. A card inside a card inside a card means the hierarchy is being drawn with borders instead of spacing.",
        ]}
        behavior={[
          "CardContent pads itself correctly with or without a header. Do not write p-6 back onto it — that was a workaround for a bug that is fixed.",
          "Use p-0 when the content should reach the border, like a table or a map.",
          "Keep 24px of padding. The 16px radius is calibrated against it; changing one without the other looks wrong.",
          "There is no CardFooter. It had zero uses across 37 cards and was deleted.",
        ]}
        content={[
          "CardTitle is a title, not a sentence. If it needs a full stop it belongs in CardDescription.",
          "Do not set a size on CardTitle or CardDescription — both resolve per density already.",
        ]}
        accessibility={[
          "CardTitle renders a div, not a heading. If the card is a landmark on the page, pass the heading yourself rather than relying on the visual weight.",
          "A whole card is not a click target. Put the action in a button or link inside it, so keyboard users have something to focus.",
        ]}
      />
    </>
  );
}
