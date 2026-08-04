"use client";

import { useState } from "react";
import { MiddleTruncate } from "@/components/system/middle-truncate";
import { CopyButton } from "@/components/system/copy-button";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

const ROWS: [string, string][] = [
  ["Lead reference", "lead_8gmXTT1yJRP8UbGfXD7A3sp4RKhW"],
  ["Property photo", "uploads/2026/07/hampshire-SO21-2NF/roof-south-elevation-final.webp"],
  ["Full address", "Flat 4, Rotunda Buildings, Montpellier Exchange, Cheltenham, GL50 1SX"],
  ["Engineer report", "reports/installs/2026-07-27/gpolin-obstruction-scan-summary.pdf"],
  ["Fits as-is", "SW1A 1AA"],
];

export default function MiddleTruncatePage() {
  const [width, setWidth] = useState(420);

  return (
    <>
      <PageHeader
        title="Middle truncate"
        lead="Truncates in the middle, keeping the head and the tail. For strings where both ends carry meaning, cutting only the end throws away the half that identifies the thing."
      />

      <Section title="Examples" note="Drag the width to see the truncation point move.">
        <div className="mb-4 flex items-center gap-4">
          <label htmlFor="mt-width" className="text-[14px] text-neutral-500">Width</label>
          <input
            id="mt-width"
            type="range"
            min={200}
            max={720}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="flex-1 accent-[#1A1512]"
          />
          <span className="w-16 text-right font-mono text-[13px] text-neutral-600">{width}px</span>
        </div>

        <Preview className="!block">
          <div className="space-y-2" style={{ maxWidth: width }}>
            {ROWS.map(([label, v]) => (
              <div key={label} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                <span className="w-[110px] shrink-0 text-[13px] text-muted-foreground">{label}</span>
                <span className="min-w-0 flex-1 font-mono text-[13px] text-foreground">
                  <MiddleTruncate value={v} />
                </span>
              </div>
            ))}
          </div>
        </Preview>
        <Code>{`<span className="min-w-0 flex-1">
  <MiddleTruncate value={lead.reference} />
</span>`}</Code>
      </Section>

      <Section title="Paired with copy" note="The recommended combination for anything the user might need verbatim.">
        <Preview>
          <div className="flex w-full max-w-md items-center gap-3">
            <span className="min-w-0 flex-1 rounded-md bg-secondary px-3 py-2 font-mono text-[13px] text-foreground">
              <MiddleTruncate value="lead_8gmXTT1yJRP8UbGfXD7A3sp4RKhW" />
            </span>
            <CopyButton value="lead_8gmXTT1yJRP8UbGfXD7A3sp4RKhW" label="Copy lead reference" />
          </div>
        </Preview>
        <Code>{`<MiddleTruncate value={ref} />
<CopyButton value={ref} label="Copy lead reference" />
// CopyButton copies from \`value\`, never from the rendered text,
// so the ellipsis never reaches the clipboard.`}</Code>
      </Section>

      <BestPractices
        when={[
          "Use where the head and the tail both identify something: file paths, upload keys, lead references, long addresses, report URLs.",
          "For prose, descriptions and headings use end-truncation instead. Cutting the middle of a sentence destroys the meaning; cutting the middle of a path preserves it.",
          "If the string fits, it renders untouched. There is no cost to wrapping a value that is usually short.",
          "Most useful in the dashboard, where lead references and upload paths sit in table cells. The funnel has almost nothing long enough to need it.",
        ]}
        behavior={[
          "Measures with canvas against the element's own computed font, so it stays correct at any size without hardcoded character widths.",
          "Re-measures on container resize via <code>ResizeObserver</code>. Layouts that change width on hover will make the truncation point jitter — lock the width during the interaction.",
          "Never nest it inside another <code>text-overflow: ellipsis</code> container. The two strategies fight and the outer one wins unpredictably.",
          "The parent needs <code>min-w-0</code> inside a flex row, or the span will refuse to shrink and nothing truncates.",
          "Copying the rendered text copies the ellipsis form. Pair it with <code>CopyButton</code>, which copies from the value prop instead.",
        ]}
        accessibility={[
          "The full string is the element's <code>aria-label</code>, so assistive tech gets the whole value while the eye gets the short one.",
          "The visible text is <code>aria-hidden</code> — otherwise a screen reader announces the string twice, once whole and once mangled.",
          "<code>title</code> carries the full value too, giving mouse users a hover tooltip. That does nothing on touch, which is the other reason to pair it with copy.",
          "On narrow viewports keep enough head visible to identify the resource — a path truncated to <code>a…x</code> is worse than a wrap.",
        ]}
      />
    </>
  );
}
