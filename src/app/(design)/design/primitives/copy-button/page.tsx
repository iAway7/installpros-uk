import { CopyButton } from "@/components/system/copy-button";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

export const metadata = { title: "Copy button" };

export default function CopyButtonPage() {
  return (
    <>
      <PageHeader
        title="Copy button"
        lead="Copies a string and confirms it. The confirmation is the whole component — without it people click twice and trust it less."
      />

      <Section title="Default">
        <Preview>
          <CopyButton value="020 3397 7003" label="Copy phone number" />
        </Preview>
        <Code>{`<CopyButton value="020 3397 7003" label="Copy phone number" />`}</Code>
      </Section>

      <Section title="Next to a value">
        <Preview>
          <div className="flex items-center gap-3">
            <code className="rounded-md bg-secondary px-3 py-2 text-[15px] text-foreground">admin@installpros.co.uk</code>
            <CopyButton value="admin@installpros.co.uk" label="Copy email address" />
          </div>
        </Preview>
      </Section>

      <BestPractices
        when={[
          "Use for anything someone would otherwise select by hand: a reference number, a phone number, an address, an engineer&rsquo;s ETA link.",
          "Do not use it for prose. If the value is a sentence, people want to read it, not paste it.",
          "On mobile, pair it with a <code>tel:</code> or <code>mailto:</code> link rather than replacing one — tapping to call beats copying a number.",
        ]}
        behavior={[
          "The icon becomes a tick for two seconds, then resets. Long enough to register, short enough that a second copy feels responsive.",
          "If the clipboard API is blocked — insecure context, denied permission — the button silently stays in its resting state rather than showing a false success.",
          "It copies the value it was given, not the visible text. If the display is truncated, the full string still lands on the clipboard.",
        ]}
        accessibility={[
          "The tick is <code>aria-hidden</code>; the result is announced through a visually-hidden <code>aria-live=\"polite\"</code> region instead. An icon swap is invisible to a screen reader.",
          "<code>aria-label</code> is required and should name what is being copied — &ldquo;Copy&rdquo; on its own is meaningless out of context.",
          "40×40px. Below the 44px guideline, so keep it beside a larger target rather than making it the only thing to hit on mobile.",
        ]}
      />
    </>
  );
}
