"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

/** Re-runs the server component (and its live API checks) via router.refresh. */
export function RefreshButton({ label = "Refresh statuses" }: { label?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [spinning, setSpinning] = useState(false);

  function refresh() {
    setSpinning(true);
    startTransition(() => {
      router.refresh();
      // keep the spinner visible at least briefly so the click feels applied
      setTimeout(() => setSpinning(false), 600);
    });
  }

  const busy = isPending || spinning;
  return (
    <button
      onClick={refresh}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
    >
      <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
      {busy ? "Checking…" : label}
    </button>
  );
}
