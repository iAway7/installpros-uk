import { cn } from "@/lib/utils";

/**
 * The top of a dashboard page: what this page is, one sentence on what it is
 * for, and the controls that change the whole page (a date range, "New").
 *
 * Twelve pages wrote this out by hand, identically: an h1 at Tailwind's
 * text-2xl font-bold — outside the type scale — over a muted line. The title
 * is text-heading now (24px Product), semibold rather than bold, which is how
 * the rest of Product sets weight: the size does the work.
 *
 * Controls that change the whole page go in `actions`, top right, aligned to
 * the bottom of the text. Controls for one block belong to that block.
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  /** One sentence. What the page is for, not a restatement of the title. */
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-wrap items-end justify-between gap-x-6 gap-y-3", className)}>
      <div className="min-w-0">
        <h1 className="text-heading font-semibold text-foreground">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-body text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
