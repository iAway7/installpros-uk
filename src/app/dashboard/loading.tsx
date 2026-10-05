import { Card, CardContent } from "@/components/system/card";
import { Skeleton } from "@/components/system/skeleton";

/**
 * Shown the instant a dashboard link is clicked, while the server page loads.
 * Every dashboard page is dynamic and waits on Supabase or PostHog, so
 * without this a click looked like nothing happened for a second or two.
 *
 * Shaped like the common page: a PageHeader, a row of figures, then one
 * card with a table, so the real content lands without a jump.
 */
export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>

      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i}>
            <CardContent className="space-y-3 p-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="border-b border-border px-4 py-3">
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="divide-y divide-border">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3">
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
