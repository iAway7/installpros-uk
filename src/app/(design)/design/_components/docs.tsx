import type { ReactNode } from "react";

/** Page title + standfirst. Every docs page opens with one. */
export function PageHeader({ title, lead }: { title: string; lead: string }) {
  return (
    <header className="mb-14 border-b border-neutral-200 pb-10">
      <h1 className="text-[40px] font-semibold leading-[1.1] tracking-[-0.03em] text-neutral-900">{title}</h1>
      <p className="mt-4 max-w-2xl text-[17px] leading-[1.6] text-neutral-500">{lead}</p>
    </header>
  );
}

export function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-neutral-900">{title}</h2>
      {note && <p className="mt-2 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">{note}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

/**
 * Live component preview. Children render inside `.theme-funnel`, so what you
 * see is the production component with the production tokens — not a copy.
 */
export function Preview({
  children,
  dark = false,
  className = "",
}: {
  children: ReactNode;
  /** Switch to the hero context (dark surface). */
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`theme-funnel flex flex-wrap items-center gap-4 rounded-xl border p-8 ${
        dark ? "border-neutral-800 bg-[#0B1220]" : "border-neutral-200 bg-white"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Code({ children }: { children: string }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-xl bg-neutral-900 p-5 text-[13px] leading-[1.7] text-neutral-100">
      <code>{children}</code>
    </pre>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200">
      <table className="w-full text-left text-[14px]">
        <thead className="bg-neutral-50 text-[12px] uppercase tracking-[0.08em] text-neutral-500">
          <tr>{head.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {rows.map((r, i) => (
            <tr key={i} className="text-neutral-700">
              {r.map((c, j) => <td key={j} className="px-4 py-3 align-middle">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Mono({ children }: { children: ReactNode }) {
  return <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[13px] text-neutral-800">{children}</code>;
}

/** Callout for a rule that is easy to break. */
export function Rule({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border-l-[3px] border-[#C70505] bg-[#FEF2F2] px-5 py-4 text-[15px] leading-[1.6] text-neutral-700">
      {children}
    </div>
  );
}
