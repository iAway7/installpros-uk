"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/system/button";

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
    <Button size="sm" onClick={refresh} disabled={busy}>
      <RefreshCw className={busy ? "animate-spin" : undefined} />
      {busy ? "Checking…" : label}
    </Button>
  );
}
