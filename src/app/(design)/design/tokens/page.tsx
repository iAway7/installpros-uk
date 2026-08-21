import { PageHeader, Section, Table, Mono, Code, Rule } from "../_components/docs";
import { THEME_TOKENS } from "../_data/tokens";

export const metadata = { title: "Token architecture" };

export default function TokensPage() {
  return (
    <>
      <PageHeader
        title="Design tokens"
        lead="Foundations are the decisions. Tokens are how those decisions reach a component. This page is about the plumbing, where a token lives, what it is allowed to be named, and how a value gets from globals.css into a button."
      />

      <Section title="Two layers, not three" note="Most systems over-engineer this. Ours has a primitive layer and a semantic layer, and that is it.">
        <Table
          head={["Layer", "Lives in", "Example", "Who may use it"]}
          rows={[
            ["Primitive", "Figma only", "red/700 = #C70505", "Semantic tokens. Never a component."],
            ["Semantic", <Mono key="a">.theme-editorial</Mono>, "--primary → brand red", "Components, via Tailwind classes."],
          ]}
        />
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          The primitive layer exists in Figma because designers need a palette to alias from. In code it would be dead
          weight, nothing should ever reference a raw ramp value, so it is not shipped.
        </p>
      </Section>

      <Section title="Format" note="HSL triplets without the wrapper, so Tailwind can apply opacity modifiers.">
        <Code>{`/* globals.css */
.theme-editorial {
  --primary: 0 95% 40%;     /* NOT hsl(0 95% 40%) */
}

/* tailwind.config.ts */
primary: "hsl(var(--primary))"

/* component */
className="bg-primary/10"   /* the /10 only works because of the format */`}</Code>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          A hex value in the variable would read better in DevTools but would break every <Mono>/40</Mono> and{" "}
          <Mono>/25</Mono> in the codebase. The card backgrounds, the icon chips and the button borders all depend on it.
        </p>
      </Section>

      <Section title="Naming" note="shadcn convention, kept on purpose.">
        <Rule>
          <Mono>--primary</Mono> is the <strong>brand red</strong>, not the primary text colour. This is the opposite of
          what some design systems mean by the word, and it is the single most common mistake when copying tokens in from
          elsewhere. Text is <Mono>--foreground</Mono> and <Mono>--muted-foreground</Mono>.
        </Rule>
      </Section>

      <Section title="Generated, not typed" note="This site reads the theme rather than describing it.">
        <Code>{`node scripts/extract-tokens.mjs`}</Code>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">
          Parses the <Mono>.theme-editorial</Mono> block, converts HSL to hex and writes{" "}
          <Mono>_data/tokens.ts</Mono>. Run it after touching the theme. There are currently{" "}
          <strong>{THEME_TOKENS.length} tokens</strong>, of which {THEME_TOKENS.filter((t) => t.hex).length} are colours.
        </p>
      </Section>

      <Section title="Adding a token">
        <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-[1.7] text-neutral-600">
          <li>Add the CSS variable to <Mono>.theme-editorial</Mono> in globals.css, with a comment saying what it is for.</li>
          <li>Register it in <Mono>tailwind.config.ts</Mono> under <Mono>colors</Mono> so a utility class exists.</li>
          <li>Run the extractor so this site picks it up.</li>
          <li>Add the matching variable in Figma with the same name and set its code syntax to <Mono>var(--your-token)</Mono>.</li>
        </ol>
        <div className="mt-6">
          <Rule>
            If you find yourself adding a token for one component, you probably want a hardcoded value in that component
            instead, and if you want a hardcoded value, you probably want a token. The test: would a second component
            ever reasonably use it?
          </Rule>
        </div>
      </Section>
    </>
  );
}
