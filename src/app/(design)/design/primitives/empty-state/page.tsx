import { FlaskConical, Users } from "lucide-react";
import { EmptyState } from "@/components/system/empty-state";
import { Button } from "@/components/system/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/system/card";
import { PageHeader, Section, Preview, Code, BestPractices, Rule, Mono } from "../../_components/docs";

export const metadata = { title: "Empty state" };

export default function EmptyStatePage() {
  return (
    <>
      <PageHeader
        title="Empty state"
        lead="What a view shows when it has nothing to show. Two sizes: the whole view is empty, or one part of a full view has no data for the period."
      />

      <Section title="Page" note="The whole view is empty. Dashed, because it is a slot waiting to be filled.">
        <Preview>
          <div className="theme-product w-full max-w-2xl">
            <EmptyState
              icon={<Users />}
              title="No leads yet"
              description="As soon as someone completes the form on your landing page, they'll show up here."
            />
          </div>
        </Preview>
        <Code>{`<EmptyState
  icon={<Users />}
  title="No leads yet"
  description="As soon as someone completes the form on your landing page, they'll show up here."
/>`}</Code>
      </Section>

      <Section title="With an action" note="One way out, when there is one.">
        <Preview>
          <div className="theme-product w-full max-w-2xl">
            <EmptyState
              icon={<FlaskConical />}
              title="No experiments yet"
              description="Create your first A/B test, for example two hero headlines, then set it running."
              action={<Button size="sm">Create experiment</Button>}
            />
          </div>
        </Preview>
      </Section>

      <Section title="Inline" note="Inside a populated view: a chart or table with nothing in the period.">
        <Preview>
          <div className="theme-product w-full max-w-md">
            <Card>
              <CardHeader>
                <CardTitle>Search Console</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <EmptyState variant="inline" description="No data in this period." />
              </CardContent>
            </Card>
          </div>
        </Preview>
        <Code>{`<EmptyState variant="inline" description="No data in this period." />`}</Code>
        <Rule>
          The dashboard had eleven of these by hand: five page-sized ones, each a Card with a 40px
          icon and a title at Tailwind&apos;s <Mono>text-lg</Mono> (outside the scale), and six muted
          lines at <Mono>py-6</Mono> in some places and <Mono>py-8</Mono> in others. The title is now{" "}
          <Mono>text-lead</Mono>, the icon 20px in a muted square, and the line one component.
        </Rule>
      </Section>

      <BestPractices
        when={[
          "<code>page</code> when the view itself has nothing yet: no leads, no experiments, a filter that matches nothing.",
          "<code>inline</code> when the view has content and one block has no data for the period. A full page-sized empty state inside a card is shouting.",
          "Not for errors. A failed load is a different message with a different fix, and should say so.",
        ]}
        behavior={[
          "One action at most, and only when it resolves the emptiness, like &ldquo;Create experiment&rdquo;, &ldquo;Clear filters&rdquo;.",
          "A filter that matches nothing names the filter as the reason, so the way out is obvious.",
        ]}
        content={[
          "Say what will appear and how: &ldquo;As soon as someone completes the form, they&apos;ll show up here&rdquo; beats &ldquo;No data&rdquo;.",
          "Title in sentence case, no full stop. Description one sentence.",
        ]}
        accessibility={[
          "The icon is decoration and <code>aria-hidden</code>; the title carries the meaning.",
          "The page title is an <code>h3</code>, under the page&apos;s own heading.",
        ]}
      />
    </>
  );
}
