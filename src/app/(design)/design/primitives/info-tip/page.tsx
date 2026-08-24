"use client";

import { InfoTip } from "@/components/system/info-tip";
import { PageHeader, Section, Preview, Code, BestPractices, Rule, Mono } from "../../_components/docs";

export default function InfoTipPage() {
  return (
    <>
      <PageHeader
        title="Info tip"
        lead="A small “what is this?” next to a field label. Explains what a value means and names where it came from, without taking up a row to do it."
      />

      <Section title="Default" note="Hover, focus or tap the marker.">
        <Preview>
          <div className="theme-product flex items-center gap-1.5">
            <span className="text-body font-semibold text-foreground">Download speed</span>
            <InfoTip
              text="The fastest fixed-line speed available at this postcode."
              source="Ofcom Connected Nations"
            />
          </div>
        </Preview>
        <Code>{`<InfoTip
  text="The fastest fixed-line speed available at this postcode."
  source="Ofcom Connected Nations"
/>`}</Code>
      </Section>

      <Section title="Alignment" note="Which edge the bubble hangs from.">
        <Preview>
          <div className="theme-product grid w-full max-w-md grid-cols-2 gap-6">
            <div className="flex items-center gap-1.5">
              <span className="text-body font-semibold text-foreground">Left column</span>
              <InfoTip text="Hangs from the left edge, the default." />
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-body font-semibold text-foreground">Right column</span>
              <InfoTip align="end" text="Hangs from the right edge so it is not clipped." />
            </div>
          </div>
        </Preview>
        <Rule>
          <Mono>align=&quot;end&quot;</Mono> is not cosmetic. The lead panel is{" "}
          <Mono>max-w-md</Mono> and its scroll container clips horizontally, so a bubble on a
          right-hand field disappears at the default alignment.
        </Rule>
      </Section>

      <Section title="Info tip or Note">
        <Rule>
          A Note is persistent and owns its row — use it when everyone needs to read the thing. An
          info tip is an aside that appears on demand and adds no height, which is why it suits a
          dense two-column panel. If the information is important enough that you would be unhappy
          for someone to miss it, it is a Note.
        </Rule>
      </Section>

      <BestPractices
        when={[
          "Explaining what a value means, or where a number came from, next to the label it belongs to.",
          "Not for error text, and not for anything required to complete a task. Those belong in the flow, not behind a marker.",
        ]}
        behavior={[
          "Hover and keyboard focus open it. On touch a tap toggles it, because there is no hover on a phone and this panel is used on phones.",
          "Use align=\"end\" in a right-hand column or inside anything that clips horizontally.",
        ]}
        content={[
          "One sentence. If it needs two, the label is probably wrong.",
          "Name the source when the value came from somewhere — 'Ofcom Connected Nations', 'Propalt'. A number with a named source is worth more than the same number alone.",
        ]}
        accessibility={[
          "The marker is a real button with an aria-label that includes the source, so it is reachable and announced without opening it.",
          "The bubble is tied to the marker with aria-describedby while open, so a screen reader reads it in place rather than as loose text.",
          "Never put an action inside the bubble. It closes on blur, so anything in there is unreachable by keyboard.",
        ]}
      />
    </>
  );
}
