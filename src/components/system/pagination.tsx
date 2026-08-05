import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Page numbers with ellipses. Always shows first, last and the neighbours. */
function pages(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "gap")[] = [1];
  if (current > 3) out.push("gap");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) out.push(i);
  if (current < total - 2) out.push("gap");
  out.push(total);
  return out;
}

/**
 * Page navigation for long lists. Use it when the total is known and someone
 * might need to come back to a specific page — a leads table. For a feed
 * nobody returns to, infinite scroll is less machinery.
 */
export function Pagination({
  page,
  totalPages,
  onChange,
  className,
}: {
  /** 1-based. */
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const cell =
    "flex h-10 min-w-10 items-center justify-center rounded-md px-3 text-[14px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--selection)/0.15)]";

  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={cn(cell, "text-foreground hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40")}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages(page, totalPages).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} aria-hidden className="px-1 text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              cell,
              p === page
                ? "bg-selection font-semibold text-white"
                : "text-foreground hover:bg-secondary",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className={cn(cell, "text-foreground hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40")}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
