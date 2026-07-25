"use client";

import * as React from "react";
import type { InstallType } from "@/lib/analytics";

interface QuoteCtx {
  postcode: string;
  installType: InstallType;
  set: (v: { postcode?: string; installType?: InstallType }) => void;
}

const Ctx = React.createContext<QuoteCtx | null>(null);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [postcode, setPostcode] = React.useState("");
  const [installType, setInstallType] = React.useState<InstallType>("residential");

  const set = React.useCallback((v: { postcode?: string; installType?: InstallType }) => {
    if (v.postcode !== undefined) setPostcode(v.postcode);
    if (v.installType !== undefined) setInstallType(v.installType);
  }, []);

  return <Ctx.Provider value={{ postcode, installType, set }}>{children}</Ctx.Provider>;
}

export function useQuote() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}
