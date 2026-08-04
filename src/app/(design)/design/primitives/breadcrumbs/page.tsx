import { Breadcrumbs } from "@/components/system/breadcrumbs";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

export const metadata = { title: "Breadcrumbs" };

export default function BreadcrumbsPage() {
  return (
    <>
      <PageHeader
        title="Breadcrumbs"
        lead="Shows where a page sits in the hierarchy. Used on the FAQ hub and the service pages — never on the funnel itself, which is deliberately a one-way street."
      />

      <Section title="Default">
        <Preview className="!block">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQs", href: "/faqs" }, { label: "Installation" }]} />
        </Preview>
        <Code>{`<Breadcrumbs
  items={[
    { label: "Home", href: "/" },
    { label: "FAQs", href: "/faqs" },
    { label: "Installation" },   // no href — this is the current page
  ]}
/>`}</Code>
      </Section>

      <Section title="Two levels">
        <Preview className="!block">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Starlink installation" }]} />
        </Preview>
      </Section>

      <BestPractices
        when={[
          "Use on content pages that sit inside a hierarchy — the FAQ hub, service pages, anything reachable from more than one route.",
          "Never on the lead funnel. The funnel is a single path with a step indicator; a breadcrumb there invites people to leave it.",
          "If the hierarchy is one level deep, a back link is clearer than a breadcrumb with two items.",
        ]}
        behavior={[
          "The last item is the current page. It is never a link — linking a page to itself is a dead click.",
          "Breadcrumbs reflect site structure, not browser history. They are not a back button and should not change based on how the user arrived.",
          "Wraps rather than truncates on narrow screens. A truncated breadcrumb tells you nothing.",
        ]}
        content={[
          "Labels mirror the page titles they point at. A breadcrumb that says <em>Questions</em> leading to a page titled <em>FAQs</em> makes the user wonder if they moved.",
          "Keep them short — one or two words. The breadcrumb is orientation, not a description.",
          "Do not include the current page twice, once in the trail and again as the heading, unless the heading is genuinely different from the trail label.",
        ]}
        accessibility={[
          "Wrapped in <code>&lt;nav aria-label=\"Breadcrumb\"&gt;</code> so it is reachable as a landmark and distinguishable from the main nav.",
          "The current page carries <code>aria-current=\"page\"</code>.",
          "Separators are <code>aria-hidden</code> — a screen reader reading &ldquo;Home chevron FAQs chevron&rdquo; is noise.",
        ]}
      />
    </>
  );
}
