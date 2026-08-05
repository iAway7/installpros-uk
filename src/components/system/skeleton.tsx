import { cn } from "@/lib/utils";

/**
 * Placeholder for content that is loading.
 *
 * Match the shape of what is coming, not a generic grey box — a skeleton that
 * does not resemble the result causes a visible reflow the moment data lands,
 * which feels worse than a spinner.
 */
export function Skeleton({
  className,
  rounded = "md",
}: {
  className?: string;
  rounded?: "sm" | "md" | "full";
}) {
  const r = { sm: "rounded", md: "rounded-md", full: "rounded-full" }[rounded];
  return (
    <span
      aria-hidden
      className={cn("block animate-pulse bg-secondary", r, className)}
    />
  );
}

/** Several lines of text. The last one is short, like real prose. */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <span className={cn("block space-y-2", className)} aria-hidden>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn("h-4", i === lines - 1 && "w-2/3")} />
      ))}
    </span>
  );
}

/**
 * Wrapper that announces loading state properly. The skeleton itself is
 * aria-hidden, so without this a screen reader hears nothing at all.
 */
export function SkeletonRegion({
  loading,
  label = "Loading",
  children,
}: {
  loading: boolean;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div aria-busy={loading} aria-live="polite" aria-label={loading ? label : undefined}>
      {children}
    </div>
  );
}
