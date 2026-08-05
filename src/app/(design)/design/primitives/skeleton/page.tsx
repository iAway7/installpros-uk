import { Skeleton, SkeletonText } from "@/components/system/skeleton";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

export const metadata = { title: "Skeleton" };

export default function SkeletonPage() {
  return (
    <>
      <PageHeader
        title="Skeleton"
        lead="Placeholder for content that is loading. It should match the shape of what is coming — a skeleton that does not resemble the result causes a reflow that feels worse than a spinner."
      />

      <Section title="Shapes">
        <Preview className="!flex-col !items-stretch">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-11 w-11" rounded="full" />
        </Preview>
      </Section>

      <Section title="Text" note="The last line is short, like real prose.">
        <Preview className="!block">
          <div className="max-w-md"><SkeletonText lines={3} /></div>
        </Preview>
        <Code>{`<SkeletonText lines={3} />`}</Code>
      </Section>

      <Section title="A card" note="Mirrors the real feature card, so nothing jumps when data lands.">
        <Preview className="!block">
          <div className="w-[290px] rounded-[22px] border border-border p-7">
            <Skeleton className="h-11 w-11" rounded="md" />
            <Skeleton className="mt-5 h-5 w-3/4" />
            <div className="mt-3"><SkeletonText lines={2} /></div>
          </div>
        </Preview>
      </Section>

      <BestPractices
        when={[
          "Content whose shape you know before it arrives: a leads table, a review card, a stat block.",
          "For an action in flight — a form submitting — use a spinner in the button. The page is not reloading, one control is busy.",
          "Under roughly 300ms, show nothing. A skeleton that flashes is worse than a brief pause.",
        ]}
        behavior={[
          "Match the real layout: same sizes, same gaps, same radii. The whole point is that nothing moves when content replaces it.",
          "Show a realistic number of rows, not twenty. Over-promising the amount of content is its own small lie.",
          "The pulse respects <code>prefers-reduced-motion</code> through the global rule — animations collapse to 0.01ms.",
        ]}
        accessibility={[
          "The skeletons are <code>aria-hidden</code>. On their own they announce nothing, which is why <code>SkeletonRegion</code> exists.",
          "Wrap the loading area in <code>SkeletonRegion</code> so it carries <code>aria-busy</code> and a polite live region — otherwise a screen-reader user hears silence and assumes the page is empty.",
          "Never put text inside a skeleton. A grey box that says &ldquo;Loading…&rdquo; is two loading indicators.",
        ]}
      />
    </>
  );
}
