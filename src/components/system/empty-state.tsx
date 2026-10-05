import { cn } from "@/lib/utils";

/**
 * What a view shows when it has nothing to show.
 *
 * The dashboard had eleven of these written by hand in two shapes. Five were
 * page-sized — a Card, a 40px icon, a title at Tailwind's text-lg (outside the
 * type scale), sometimes a sentence — and six were one muted line inside a
 * card, at py-6 in some places and py-8 in others. Same idea, eleven spellings.
 *
 *   variant="page"    the whole view is empty: no leads yet, no experiments.
 *                     Dashed border, so it reads as a slot waiting to be
 *                     filled rather than as a card with content.
 *   variant="inline"  one part of a populated view has no data for the
 *                     period: a chart, a table inside a card.
 *
 * Say what will appear and how, not only that nothing is here: "As soon as
 * someone completes the form, they'll show up here" beats "No data".
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  variant = "page",
  className,
}: {
  title?: string;
  description?: React.ReactNode;
  /** A lucide icon; rendered at 20px in a muted square. Page variant only. */
  icon?: React.ReactNode;
  /** One button or link that resolves the emptiness, e.g. "Create experiment". */
  action?: React.ReactNode;
  variant?: "page" | "inline";
  className?: string;
}) {
  if (variant === "inline") {
    return (
      <div className={cn("px-4 py-8 text-center", className)}>
        {title && <p className="text-body-sm font-medium text-foreground">{title}</p>}
        {description && <p className="text-body-sm text-muted-foreground">{description}</p>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <span
          aria-hidden
          className="mb-4 flex size-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground [&_svg]:size-5"
        >
          {icon}
        </span>
      )}
      {title && <h3 className="text-lead font-semibold text-foreground">{title}</h3>}
      {description && <p className="mt-1 max-w-sm text-body-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
