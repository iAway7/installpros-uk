import { Satellite } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/**
 * Product density, not Editorial: these pages are the door to the dashboard,
 * not a marketing page. With no theme at all they fell through to :root and
 * rendered a full step larger than the app they lead into.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-product flex min-h-dvh flex-col items-center justify-center bg-secondary/40 px-4 py-12">
      <div className="mb-6 flex items-center gap-2 font-bold">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Satellite className="h-5 w-5" />
        </span>
        <span className="text-lg">
          {siteConfig.name}
          <span className="text-primary">.</span>
        </span>
      </div>
      <div className="w-full max-w-sm">{children}</div>
      <p className="mt-6 text-label text-muted-foreground">Team access only · {siteConfig.domain}</p>
    </div>
  );
}
