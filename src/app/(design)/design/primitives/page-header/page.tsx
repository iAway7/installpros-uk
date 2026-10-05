import { Plus } from "lucide-react";
import { PageHeader as Header } from "@/components/system/page-header";
import { Button } from "@/components/system/button";
import { PageHeader, Section, Preview, Code, BestPractices, Rule, Mono, Table } from "../../_components/docs";

export const metadata = { title: "Page header" };

export default function PageHeaderPage() {
  return (
    <>
      <PageHeader
        title="Page header"
        lead="The top of a dashboard page: what it is, one sentence on what it is for, and the controls that change the whole page."
      />

      <Section title="Title and description" note="Every page in /dashboard opens with one.">
        <Preview>
          <div className="theme-product w-full">
            <Header title="Leads" description="Every quote request from your landing page." />
          </div>
        </Preview>
        <Code>{`<PageHeader title="Leads" description="Every quote request from your landing page." />`}</Code>
      </Section>

      <Section title="With actions" note="Controls for the whole page sit top right, on the baseline of the text.">
        <Preview>
          <div className="theme-product w-full">
            <Header
              title="Experiments"
              description="Run A/B tests on the landing page and read the results."
              actions={
                <Button size="sm">
                  <Plus /> New experiment
                </Button>
              }
            />
          </div>
        </Preview>
        <Code>{`<PageHeader
  title="Experiments"
  description="Run A/B tests on the landing page and read the results."
  actions={<Button size="sm"><Plus /> New experiment</Button>}
/>`}</Code>
      </Section>

      <Section title="Tokens">
        <Table
          head={["Part", "Token", "Product", "Editorial"]}
          rows={[
            ["Title", <Mono key="t">text-heading</Mono>, "24px / 1.2, semibold", "28px"],
            ["Description", <Mono key="t">text-body</Mono>, "14px, muted", "16px"],
          ]}
        />
        <Rule>
          Twelve pages wrote this by hand, identically, with the title at Tailwind&apos;s{" "}
          <Mono>text-2xl font-bold</Mono> — outside the scale. <Mono>text-heading</Mono> is its own
          step above <Mono>text-title</Mono>, and the weight drops to semibold: in Product the size
          does the work, as it does in every shadcn-style app.
        </Rule>
      </Section>

      <BestPractices
        when={[
          "Once per page, at the top. Sections inside the page use <code>text-title</code> on an <code>h2</code>.",
          "Actions only when they change the whole page: a date range, a create button. A control for one card belongs to that card.",
        ]}
        behavior={[
          "Actions wrap below the title on narrow screens rather than squeezing it.",
          "The description is capped at a readable measure (max-w-2xl) however wide the page is.",
        ]}
        content={[
          "Title is the page&apos;s name in the nav, word for word, so the two never disagree.",
          "Description says what the page is for, not a restatement of the title: &ldquo;Where visitors drop off on the way to becoming leads&rdquo;.",
        ]}
        accessibility={[
          "The title is the page&apos;s only <code>h1</code>.",
          "Actions follow the title in reading order, so a screen reader hears what the page is before what it can do.",
        ]}
      />
    </>
  );
}
