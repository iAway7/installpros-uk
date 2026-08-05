"use client";

import { useState } from "react";
import { Pagination } from "@/components/system/pagination";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

export default function PaginationPage() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(7);

  return (
    <>
      <PageHeader
        title="Pagination"
        lead="Page navigation for long lists. Built for the leads table, where someone needs to get back to the page they were on."
      />

      <Section title="Few pages" note="Under eight, every page is shown.">
        <Preview className="!block">
          <Pagination page={a} totalPages={5} onChange={setA} />
        </Preview>
        <Code>{`<Pagination page={page} totalPages={5} onChange={setPage} />`}</Code>
      </Section>

      <Section title="Many pages" note="First, last and the neighbours, with ellipses between.">
        <Preview className="!block">
          <Pagination page={b} totalPages={42} onChange={setB} />
        </Preview>
      </Section>

      <BestPractices
        when={[
          "Long lists where the total is known and someone might return to a specific page — the leads table, install history.",
          "For a feed nobody comes back to, infinite scroll is less machinery and reads better.",
          "Below one page it renders nothing at all, rather than a disabled control that suggests there is more.",
        ]}
        behavior={[
          "Always shows first and last plus the current page&rsquo;s neighbours. Someone on page 7 of 42 can reach the end in one click.",
          "Previous and next disable at the ends rather than disappearing, so the control does not change width as you move through it.",
          "Page state belongs in the URL, not just in React state. A paginated table you cannot link to loses half its value.",
        ]}
        content={[
          "Numbers only. <em>Page 1</em> in every cell is repetition the eye has to skip.",
          "The ellipsis is a gap marker, not a button. Do not make it open a jump-to-page input unless the list runs to hundreds of pages.",
        ]}
        accessibility={[
          "Wrapped in <code>&lt;nav aria-label=\"Pagination\"&gt;</code> so it is reachable as a landmark.",
          "The current page carries <code>aria-current=\"page\"</code>; every cell has an <code>aria-label</code> like <em>Page 7</em>, because a bare number announces nothing useful.",
          "The ellipsis is <code>aria-hidden</code>.",
          "Cells are 40px tall — below the 44px touch guideline. On mobile prefer a Load more button over a row of small targets.",
        ]}
      />
    </>
  );
}
