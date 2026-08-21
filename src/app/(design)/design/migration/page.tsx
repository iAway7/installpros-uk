import { PageHeader, Section, Table, Mono, Rule } from "../_components/docs";

export const metadata = { title: "Migration plan" };

function Phase({
  n, title, status, goal, items,
}: { n: string; title: string; status: "done" | "now" | "next"; goal: string; items: string[] }) {
  const badge = {
    done: ["Done", "bg-green-50 text-green-700 border-green-200"],
    now: ["In progress", "bg-amber-50 text-amber-700 border-amber-200"],
    next: ["Not started", "bg-neutral-100 text-neutral-500 border-neutral-200"],
  }[status];

  return (
    <div className="rounded-xl border border-neutral-200 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[13px] font-semibold text-neutral-400">Phase {n}</span>
        <h3 className="text-[17px] font-semibold text-neutral-900">{title}</h3>
        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badge[1]}`}>{badge[0]}</span>
      </div>
      <p className="mt-2 text-[14px] leading-[1.6] text-neutral-500">{goal}</p>
      <ul className="mt-4 space-y-1.5 text-[14px] leading-[1.6] text-neutral-600">
        {items.map((i) => <li key={i} className="flex gap-2"><span className="text-neutral-300">—</span>{i}</li>)}
      </ul>
    </div>
  );
}

export default function MigrationPage() {
  return (
    <>
      <PageHeader
        title="Migration plan"
        lead="The system was extracted from a live site, so adoption is retroactive. Each phase is shippable on its own and none of them requires a redesign."
      />

      <Section title="Principle">
        <Rule>
          <strong>Never two systems at once.</strong> The staging copy of the funnel lived beside the original for
          exactly one day before being promoted and deleted. A <Mono>-v2</Mono> folder that survives a week becomes
          permanent, and then there are two of everything.
        </Rule>
      </Section>

      <Section title="Phases">
        <div className="space-y-4">
          <Phase
            n="1" title="Tokenise" status="done"
            goal="Get every literal colour out of the components so a change has one place to happen."
            items={[
              "Four brand reds collapsed to one, plus two named tints",
              "#1A1512 (×10) became --selection",
              "Two error reds and three success greens became one each",
              "Motion curve and durations lifted into tokens",
            ]}
          />
          <Phase
            n="2" title="Wire the states" status="done"
            goal="Make the components tell the truth about their own state."
            items={[
              "Input error variant actually passed by callers, with aria-invalid",
              "Error messages linked via aria-describedby and role=alert",
              "GDPR checkbox given a visible error state",
              "Hand-rolled CTAs replaced with the real button",
            ]}
          />
          <Phase
            n="3" title="Document" status="now"
            goal="Publish the system so decisions stop living in people's heads."
            items={[
              "Figma: 112 variables, 12 text styles, Button component set",
              "This site, importing the real components",
              "Remaining: composites, patterns, the icon set",
            ]}
          />
          <Phase
            n="4" title="Type scale" status="next"
            goal="Apply the documented ramp to the code. This one moves pixels, ship it on its own."
            items={[
              "Card titles and FAQ questions 17–18px → 24px",
              "H2 on mobile 40px → 32px, so it stops matching H1",
              "Stat numbers 60px → 72px",
              "Remove the sm/xs 16px override that silently ate the 12px button",
            ]}
          />
          <Phase
            n="5" title="Layout debt" status="next"
            goal="Close the gaps the audit found but that were not worth risking mid-flight."
            items={[
              "One container width, retire the 1140px and 1160px hardcodes",
              "Radius scale from ten values down to four or five",
              "themeColor is still #1d4ed8, a leftover blue from Phase 1",
              "Delete the orphan tokens: --red-accent and friends",
            ]}
          />
          <Phase
            n="6" title="Absorb the .ipx landing" status="next"
            goal="Bring /starlink-installations into the system, or formally declare it separate."
            items={[
              "Its light theme already shares #171717, #666666 and #c70505",
              "It uses weight 300 for body where the funnel uses 400",
              "Its lead capture is a modal; the funnel uses an inline wizard",
              "Decision needed before either gets more work",
            ]}
          />
        </div>
      </Section>

      <Section title="Rules for each phase">
        <Table
          head={["Rule", "Why"]}
          rows={[
            ["One phase per deploy", "If something shifts visually you know which change did it"],
            ["Tokens before components", "A component cannot bind to a token that does not exist"],
            ["No visual change without saying so", "Phases 1–3 were invisible on purpose; 4 and 5 are not"],
            ["Update this page when a phase lands", "A migration plan nobody maintains is a wish list"],
          ]}
        />
      </Section>
    </>
  );
}
