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

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  const id = slug(title);
  return (
    <section id={id} className="mb-16 min-w-0 scroll-mt-8">
      <h2 className="group text-[22px] font-semibold tracking-[-0.02em] text-neutral-900">
        <a href={`#${id}`} className="no-underline">
          {title}
          <span aria-hidden className="ml-2 text-neutral-300 opacity-0 transition-opacity group-hover:opacity-100">#</span>
        </a>
      </h2>
      {note && <p className="mt-2 max-w-2xl text-[15px] leading-[1.6] text-neutral-500">{note}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

/**
 * Live component preview. Children render inside `.theme-editorial`, so what you
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
      className={`theme-editorial flex min-w-0 max-w-full flex-wrap items-center gap-4 rounded-xl border p-8 ${
        dark ? "border-neutral-800 bg-[#0B1220]" : "border-neutral-200 bg-white"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Code({ children, open = false }: { children: string; open?: boolean }) {
  return (
    <details open={open} className="mt-3 max-w-full overflow-hidden rounded-xl border border-neutral-200">
      <summary className="cursor-pointer list-none px-5 py-3 text-[14px] text-neutral-600 transition-colors hover:text-neutral-900 [&::-webkit-details-marker]:hidden">
        <span className="mr-2 inline-block transition-transform">›</span>Show code
      </summary>
      <pre className="overflow-x-auto border-t border-neutral-200 bg-neutral-900 p-5 text-[13px] leading-[1.7] text-neutral-100">
        <code>{children}</code>
      </pre>
    </details>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="max-w-full overflow-x-auto rounded-xl border border-neutral-200">
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
  return <code className="break-words rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[13px] text-neutral-800">{children}</code>;
}

/** Callout for a rule that is easy to break. */
export function Rule({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border-l-[3px] border-[#C70505] bg-[#FEF2F2] px-5 py-4 text-[15px] leading-[1.6] text-neutral-700">
      {children}
    </div>
  );
}

/**
 * Best-practices block. Three questions every component page has to answer:
 * when do I reach for this, how does it behave, and what does it owe assistive
 * tech. Structure borrowed from Geist, which gets this right.
 */
export function BestPractices({
  when, behavior, content, accessibility,
}: { when: string[]; behavior: string[]; content?: string[]; accessibility: string[] }) {
  const groups: [string, string[]][] = [
    ["When to use", when],
    ["Behavior", behavior],
    ...(content ? ([["Content", content]] as [string, string[]][]) : []),
    ["Accessibility", accessibility],
  ];
  return (
    <section id="best-practices" className="mt-4 scroll-mt-8 border-t border-neutral-200 pt-12">
      <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-neutral-900">Best practices</h2>
      <div className="mt-8 space-y-10">
        {groups.map(([title, items]) => (
          <div key={title}>
            <h3 className="text-[15px] font-semibold text-neutral-900">{title}</h3>
            <ul className="mt-3 space-y-2.5">
              {items.map((t, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-[1.65] text-neutral-600">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-neutral-300" />
                  <span className="min-w-0 break-words" dangerouslySetInnerHTML={{ __html: t }} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
