"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FeedbackInline } from "@/components/system/feedback";
import { FLAT } from "./nav";

/**
 * Was-this-helpful plus prev/next. Uses our own Feedback component rather than
 * a bespoke widget — the docs site eating its own dog food is the point.
 */
export function DocsFooter() {
  const path = usePathname();
  const i = FLAT.findIndex((n) => n.href === path);
  const prev = i > 0 ? FLAT[i - 1] : null;
  const next = i >= 0 && i < FLAT.length - 1 ? FLAT[i + 1] : null;

  return (
    <footer className="mt-20 border-t border-neutral-200 pt-10">
      <div className="theme-editorial flex justify-center">
        <FeedbackInline question="Was this page useful?" />
      </div>

      {(prev || next) && (
        <nav className="mt-12 flex items-stretch justify-between gap-4" aria-label="Pagination">
          {prev ? (
            <Link href={prev.href} className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-neutral-200 p-5 transition-colors hover:border-neutral-400">
              <ArrowLeft className="h-4 w-4 shrink-0 text-neutral-400" />
              <span className="min-w-0">
                <span className="block text-[12px] uppercase tracking-[0.08em] text-neutral-400">Previous</span>
                <span className="block truncate text-[15px] font-medium text-neutral-900">{prev.label}</span>
              </span>
            </Link>
          ) : <span className="flex-1" />}
          {next ? (
            <Link href={next.href} className="group flex min-w-0 flex-1 items-center justify-end gap-3 rounded-xl border border-neutral-200 p-5 text-right transition-colors hover:border-neutral-400">
              <span className="min-w-0">
                <span className="block text-[12px] uppercase tracking-[0.08em] text-neutral-400">Next</span>
                <span className="block truncate text-[15px] font-medium text-neutral-900">{next.label}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-neutral-400" />
            </Link>
          ) : <span className="flex-1" />}
        </nav>
      )}
    </footer>
  );
}
