import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Shows where a page sits. The last crumb is the current page: it is never a
 * link, and it carries aria-current so a screen reader says so.
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[15px]">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.label} className="flex items-center gap-1.5">
              {c.href && !last ? (
                <a
                  href={c.href}
                  className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {c.label}
                </a>
              ) : (
                <span className={cn(last ? "font-medium text-foreground" : "text-muted-foreground")} aria-current={last ? "page" : undefined}>
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
