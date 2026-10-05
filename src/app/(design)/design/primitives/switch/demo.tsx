"use client";

import { useState } from "react";
import { Switch } from "@/components/system/switch";

/** The interactive rows for the Switch page; client-only so the page keeps its metadata. */
export function SwitchDemo() {
  const [whatsapp, setWhatsapp] = useState(true);
  const [zapier, setZapier] = useState(false);
  return (
    <div className="theme-product w-full max-w-md divide-y divide-border rounded-xl border border-border">
      <div className="flex items-center justify-between gap-4 p-4">
        <div>
          <p className="text-body font-medium text-foreground">WhatsApp follow-up</p>
          <p className="text-body-sm text-muted-foreground">Message new leads within a minute.</p>
        </div>
        <Switch checked={whatsapp} onCheckedChange={setWhatsapp} aria-label="WhatsApp follow-up" />
      </div>
      <div className="flex items-center justify-between gap-4 p-4">
        <div>
          <p className="text-body font-medium text-foreground">Send leads to Zapier</p>
          <p className="text-body-sm text-muted-foreground">Paused endpoints keep their settings.</p>
        </div>
        <Switch checked={zapier} onCheckedChange={setZapier} aria-label="Send leads to Zapier" />
      </div>
      <div className="flex items-center justify-between gap-4 p-4">
        <div>
          <p className="text-body font-medium text-muted-foreground">Google Ads sync</p>
          <p className="text-body-sm text-muted-foreground">Add the API key first.</p>
        </div>
        <Switch checked={false} onCheckedChange={() => {}} disabled aria-label="Google Ads sync" />
      </div>
    </div>
  );
}
