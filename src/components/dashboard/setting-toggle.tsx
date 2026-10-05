"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Switch } from "@/components/system/switch";

/** On/off switch bound to an app_settings key via /api/settings/toggles.
 *  The Switch itself is system/switch; this owns the optimistic save. */
export function SettingToggle({
  settingKey,
  initial,
  disabled,
  label,
}: {
  settingKey: string;
  initial: boolean;
  disabled?: boolean;
  /** Accessible name: what the switch turns on, e.g. "WhatsApp follow-up". */
  label: string;
}) {
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
    <Switch
      checked={on}
      onCheckedChange={flip}
      disabled={saving || disabled}
      aria-label={label}
      title={disabled ? "Add the API key first" : on ? "Deactivate" : "Activate"}
    />
  );
}
