"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FunnelButton } from "./funnel-button";

const EMOTIONS = [
  { key: "sad", glyph: "😢", label: "Unhappy" },
  { key: "meh", glyph: "🙁", label: "Dissatisfied" },
  { key: "ok", glyph: "🙂", label: "Satisfied" },
  { key: "happy", glyph: "😄", label: "Delighted" },
] as const;

type Emotion = (typeof EMOTIONS)[number]["key"];

function Faces({
  value, onChange, size = "default",
}: { value: Emotion | null; onChange: (e: Emotion) => void; size?: "sm" | "default" }) {
  const box = size === "sm" ? "h-8 w-8 text-lead" : "h-9 w-9 text-title";
  return (
    <div className="flex items-center gap-1">
      {EMOTIONS.map((e) => (
        <button
          key={e.key}
          type="button"
          aria-label={e.label}
          aria-pressed={value === e.key}
          onClick={() => onChange(e.key)}
          className={cn(
            "flex items-center justify-center rounded-md transition-all duration-200",
            box,
            value === e.key ? "bg-secondary ring-1 ring-selection" : "opacity-60 hover:opacity-100",
          )}
        >
          <span aria-hidden>{e.glyph}</span>
        </button>
      ))}
    </div>
  );
}

/** Compact one-line version. Good at the end of a page or an answer. */
export function FeedbackInline({
  question = "Was this helpful?",
  onSubmit,
}: {
  question?: string;
  onSubmit?: (emotion: Emotion) => void;
}) {
  const [picked, setPicked] = useState<Emotion | null>(null);

  if (picked) {
    return (
      <div className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-body text-muted-foreground">
        Thanks — that helps.
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-border px-5 py-2">
      <span className="text-body text-foreground">{question}</span>
      <Faces
        value={null}
        size="sm"
        onChange={(e) => { setPicked(e); onSubmit?.(e); }}
      />
    </div>
  );
}

/**
 * Text plus an emotion. The emotion is what makes a free-text box worth
 * reading — it gives you something to sort by when a hundred come in.
 */
export function Feedback({
  placeholder = "Your feedback…",
  onSubmit,
  className,
}: {
  placeholder?: string;
  onSubmit?: (payload: { text: string; emotion: Emotion | null }) => void;
  className?: string;
}) {
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState<Emotion | null>(null);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className={cn("rounded-lg border border-border bg-secondary p-6 text-center", className)}>
        <p className="text-body font-semibold text-foreground">Thanks for the feedback.</p>
        <p className="mt-1 text-body-sm text-muted-foreground">We read every one of these.</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-md overflow-hidden rounded-lg border border-border bg-card", className)}>
      <label htmlFor="feedback-text" className="sr-only">Your feedback</label>
      <textarea
        id="feedback-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none px-4 py-3.5 text-body text-foreground outline-none placeholder:text-muted-foreground"
      />
      <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2.5">
        <Faces value={emotion} onChange={setEmotion} />
        <FunnelButton
          size="sm"
          disabled={!text.trim() && !emotion}
          onClick={() => { onSubmit?.({ text, emotion }); setSent(true); }}
        >
          Send
        </FunnelButton>
      </div>
    </div>
  );
}
