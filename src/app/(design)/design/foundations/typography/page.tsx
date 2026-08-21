import { PageHeader, Section, Mono, Rule } from "../../_components/docs";

export const metadata = { title: "Typography" };

interface Spec {
  name: string;
  role: string;
  size: string;
  weight: string;
  line: string;
  track: string;
  className: string;
  upper?: boolean;
}

/**
 * The ramp. Sizes are written mobile → desktop where they change at 768px.
 * The `className` on each row is what actually renders the sample, so the
 * specimen and the spec can never disagree.
 */
const RAMP: Spec[] = [
  { name: "Stat", role: "big stat numbers, fluid, clamp(44px, 4.2vw, 60px)", size: "44 → 60", weight: "ExtraLight 200", line: "44 → 60", track: "-1.8 → -2.4", className: "text-[44px] md:text-[60px] font-extralight leading-[44px] md:leading-[60px] tracking-[-1.8px] md:tracking-[-2.4px]" },
  { name: "H1", role: "hero headline", size: "40 → 64", weight: "SemiBold 600", line: "42 → 67", track: "-1.2 → -1.9", className: "text-[40px] md:text-[64px] font-semibold leading-[42px] md:leading-[67px] tracking-[-1.2px] md:tracking-[-1.9px]" },
  { name: "H2", role: "major section headers", size: "32 → 52", weight: "SemiBold 600", line: "34 → 55", track: "-1.1 → -1.8", className: "text-[32px] md:text-[52px] font-semibold leading-[34px] md:leading-[55px] tracking-[-1.1px] md:tracking-[-1.8px]" },
  { name: "H3", role: "form-step questions, CTA heading", size: "24 → 30", weight: "Bold 700", line: "26 → 33", track: "-0.7 → -0.9", className: "text-[24px] md:text-[30px] font-bold leading-[26px] md:leading-[33px] tracking-[-0.7px] md:tracking-[-0.9px]" },
  { name: "H4", role: "card titles, FAQ questions", size: "18", weight: "SemiBold 600", line: "23", track: "0", className: "text-[18px] font-semibold leading-[23px]" },
  { name: "Body-L", role: "section lead copy", size: "16 → 18", weight: "Regular 400", line: "26 → 29", track: "0", className: "text-[16px] md:text-[18px] leading-[26px] md:leading-[29px]" },
  { name: "Body", role: "default paragraphs", size: "16", weight: "Regular 400", line: "24", track: "0", className: "text-[16px] leading-[24px]" },
  { name: "Body-S", role: "card copy", size: "14", weight: "Regular 400", line: "22", track: "0", className: "text-[14px] leading-[22px]" },
  { name: "Caption", role: "stat labels, legal, microcopy", size: "13", weight: "Regular 400", line: "18", track: "0", className: "text-[13px] leading-[18px]" },
  { name: "Input", role: "lead form fields", size: "16 → 22", weight: "Regular 400", line: "22 → 31", track: "0", className: "text-[16px] md:text-[22px] leading-[22px] md:leading-[31px]" },
  { name: "Eyebrow", role: "section label, always brand red", size: "12", weight: "SemiBold 600", line: "16", track: "+2.9", className: "text-[12px] font-semibold uppercase leading-[16px] tracking-[2.9px] text-[#C70505]", upper: true },
  { name: "Button", role: "the one button label", size: "12", weight: "Bold 700", line: "16", track: "-0.2", className: "text-[12px] font-bold uppercase leading-[16px] tracking-[-0.2px]", upper: true },
];

const SAMPLE = "The quick brown fox jumps over the lazy dog.";

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2.5 py-1.5 text-[12px]">
      <span className="text-neutral-500">{label}:</span>
      <span className="font-medium text-neutral-900">{value}</span>
    </span>
  );
}

export default function TypographyPage() {
  return (
    <>
      <PageHeader
        title="Typography"
        lead="Be Vietnam Pro, weights 200–700. These are the sizes the funnel actually renders, the scale documents the site, not an idealised ramp. Where two numbers are shown the first is mobile and the second is what it becomes at 768px."
      />

      <Section title="Why there is only one H2">
        <Rule>
          The site used to carry three different heading styles that all called themselves a section heading, plus two
          more for form steps. They differed by half a pixel and a weight. One heading per level, four levels, if a
          design needs a fifth, the answer is usually a different component, not a new style.
        </Rule>
      </Section>

      <div className="theme-editorial space-y-14">
        {RAMP.map((s) => (
          <div key={s.name}>
            <div className="text-[13px] text-neutral-500">
              {s.name}, {s.role}
            </div>
            <div className={`mt-4 text-neutral-900 ${s.className}`}>{SAMPLE}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip label="Weight" value={s.weight} />
              <Chip label="Font size" value={s.size + "px"} />
              <Chip label="Line height" value={s.line + "px"} />
              <Chip label="Letter-spacing" value={s.track + "px"} />
              {s.upper && <Chip label="Case" value="UPPERCASE" />}
            </div>
          </div>
        ))}
      </div>

      <Section title="Weights" note="Three weights, each with a job. Plus one special case.">
        <ul className="space-y-2 text-[15px] leading-[1.7] text-neutral-600">
          <li><Mono>600 SemiBold</Mono>: titles. H1 through H4 and the eyebrow.</li>
          <li><Mono>400 Regular</Mono>: everything you read. All body sizes, captions, inputs.</li>
          <li><Mono>700 Bold</Mono>: actions. The button label, and nothing else.</li>
          <li><Mono>200 ExtraLight</Mono>: Display-XL only. Big numbers need the thin stroke to stop looking like a shout.</li>
        </ul>
      </Section>
    </>
  );
}
