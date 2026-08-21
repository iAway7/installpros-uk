import { PageHeader, Section, Table, Mono, Code } from "../../_components/docs";

export const metadata = { title: "Motion" };

export default function MotionPage() {
  return (
    <>
      <PageHeader
        title="Motion"
        lead="One easing curve and four durations. Motion here is meant to be felt rather than watched, every value errs slow enough to read as deliberate and short enough to stay out of the way."
      />

      <Section title="The curve" note="There is only one, and everything uses it.">
        <Code>{`--ease-out: cubic-bezier(0.16, 1, 0.3, 1);

/* Tailwind: ease-ds */
<div className="transition-all duration-card ease-ds" />`}</Code>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          It front-loads most of the movement and settles gently. The browser default (<Mono>ease-out</Mono>) is flatter
          and makes the same duration feel sluggish.
        </p>
      </Section>

      <Section title="Durations">
        <Table
          head={["Token", "Value", "Applies to"]}
          rows={[
            [<Mono key="a">duration/fast</Mono>, "200ms", "Colour and opacity, hovers, links, focus"],
            [<Mono key="b">duration/nav</Mono>, "400ms", "Header solidifying on scroll"],
            [<Mono key="c">duration/card-hover</Mono>, "450ms", "Card lift"],
            [<Mono key="d">duration/accordion</Mono>, "550ms", "FAQ open and close"],
            [<Mono key="e">duration/reveal</Mono>, "950ms", "Scroll-in reveal"],
          ]}
        />
      </Section>

      <Section title="Card hover" note="Hover the card to see the combination that every card on the site uses.">
        <div className="theme-editorial">
          <div className="w-[300px] rounded-[22px] border border-border bg-secondary/40 p-7 transition-all duration-card ease-ds hover:-translate-y-[5px] hover:border-brand-soft/35">
            <div className="flex h-11 w-11 items-center justify-center rounded-[13px] border border-brand-soft/25 bg-primary/10 text-brand-icon">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="8" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
            </div>
            <h3 className="mt-5 text-[17px] font-semibold text-foreground">Optimal Signal Placement</h3>
            <p className="mt-2.5 text-[14.5px] leading-[1.6] text-muted-foreground">
              Obstruction scanning finds the perfect line of sight before we drill.
            </p>
          </div>
        </div>
        <Code>{`className="transition-all duration-card ease-ds
           hover:-translate-y-[5px] hover:border-brand-soft/35"`}</Code>
      </Section>

      <Section title="Reduced motion">
        <p className="max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          <Mono>prefers-reduced-motion: reduce</Mono> is honoured globally, animations and transitions collapse to
          0.01ms, and smooth scrolling turns off. The counting stat numbers and the before/after meters check it
          individually too, and render their final value immediately.
        </p>
      </Section>
    </>
  );
}
