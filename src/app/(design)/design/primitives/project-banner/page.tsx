import { ProjectBanner } from "@/components/system/project-banner";
import { PageHeader, Section, Preview, Code, Rule, BestPractices } from "../../_components/docs";

export const metadata = { title: "Project banner" };

export default function ProjectBannerPage() {
  return (
    <>
      <PageHeader
        title="Project banner"
        lead="Site-wide state that needs resolving. Not an announcement bar — if it can be dismissed without the state changing, it was never banner-worthy."
      />

      <Section title="Variants" note="Match the variant to severity, not to mood.">
        <Preview className="!flex-col !items-stretch !p-0 !gap-0">
          <ProjectBanner
            label="Bookings for the Highlands are paused while Storm Fiona passes."
            callToAction={{ label: "See Affected Areas", href: "#" }}
            variant="warning"
          />
          <ProjectBanner
            label="Payment failed — installs are on hold until the card is updated."
            callToAction={{ label: "Update Payment Method", href: "#" }}
            variant="error"
          />
          <ProjectBanner
            label="Same-week scheduling is back on for all mainland postcodes."
            callToAction={{ label: "Book A Slot", href: "#" }}
            variant="success"
          />
          <ProjectBanner
            label="We are migrating phone numbers on 12 August."
            callToAction={{ label: "Read The Notice", href: "#" }}
          />
        </Preview>
        <Code>{`<ProjectBanner
  variant="warning"
  label="Bookings for the Highlands are paused while Storm Fiona passes."
  callToAction={{ label: "See Affected Areas", href: "/coverage" }}
/>`}</Code>
      </Section>

      <Section title="Why it cannot be dismissed">
        <Rule>
          The previous version of this component had a close button. That was wrong: a dismissible banner about a real
          problem gets dismissed and then reported as a bug. <strong>If the message can go away without the underlying
          state changing, it belongs in a <code>Note</code>.</strong> The CTA is the only way out, which is why it is a
          required prop rather than an optional one.
        </Rule>
      </Section>

      <BestPractices
        when={[
          "Site-wide states that need resolving: paused service areas, a payment problem blocking installs, a booking freeze.",
          "Use <code>Note</code> for inline context tied to one field or card, a toast for transient acknowledgments, <code>Modal</code> for confirmations.",
          "<code>error</code> for something blocking, <code>warning</code> for an exceptional state with non-immediate action, <code>success</code> for a positive temporary state, <code>gray</code> for routine notices.",
        ]}
        behavior={[
          "Non-dismissible by design, and the CTA is required — a banner with no route out is a dead end.",
          "One at a time. Stacking banners drowns the most urgent one.",
          "It pushes content down rather than overlaying. A banner covering the nav is a modal in disguise.",
        ]}
        content={[
          "<code>label</code> is one sentence in sentence case naming the impact: <em>Bookings for the Highlands are paused while Storm Fiona passes.</em> No &ldquo;Heads up&rdquo;, no apologies.",
          "The CTA is Title Case <em>Verb + Noun</em> pointing at the resolver: <em>Update Payment Method</em>, <em>See Affected Areas</em>.",
          "Name the affected thing when the context is not obvious from the surrounding chrome.",
          "No emoji and no interjections — the variant already carries the severity.",
        ]}
        accessibility={[
          "<code>role=\"region\"</code> with an accessible name, so it is a landmark rather than stray text above the page.",
          "Not <code>role=\"alert\"</code>: it is present at page load, and alert would interrupt a screen reader mid-sentence for something that is not breaking news.",
          "The icon is decorative. The wording carries the severity, because the tint alone does not survive a colour-blind reader.",
        ]}
      />
    </>
  );
}
