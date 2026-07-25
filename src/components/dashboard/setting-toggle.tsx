"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/** On/off switch bound to an app_settings key via /api/settings/toggles. */
export function SettingToggle({ settingKey, initial, disabled }: { settingKey: string; initial: boolean; disabled?: boolean }) {
  const router = useRouter();
  const [on, setOn] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function flip() {
    const next = !on;
    setOn(next);
    setSaving(true);
    try {
      const res = await fetch("/api/settings/toggles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: settingKey, value: next }),
      });
      if (!res.ok) throw new Error();
      toast.success(next ? "Activated" : "Deactivated");
      router.refresh();
    } catch {
      setOn(!next);
      toast.error("Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      role="switch"
      aria-checked={on}
      disabled={saving || disabled}
      onClick={flip}
      title={disabled ? "Add the API key first" : on ? "Deactivate" : "Activate"}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
        on ? "bg-success" : "bg-muted"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
