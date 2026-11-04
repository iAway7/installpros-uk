"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV } from "./nav";
import { DensityToggle } from "./density";

/**
 * The docs navigation below 1024px, where the sidebar is hidden. A sticky bar
 * with the name, the density switch and a Menu button that opens the same
 * list as the sidebar. Closes when a link is followed.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="sticky top-0 z-40 -mx-6 border-b border-neutral-200 bg-white/95 px-6 backdrop-blur lg:hidden">
      <div className="flex h-14 items-center justify-between gap-3">
        <Link href="/design" className="min-w-0 truncate text-[15px] font-semibold tracking-[-0.01em]">
          InstallPros <span className="font-normal text-neutral-500">Design System</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="docs-mobile-menu"
          className="flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-900"
        >
          {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          Menu
        </button>
      </div>

      {open && (
        <nav id="docs-mobile-menu" aria-label="Design system" className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto pb-8">
          <DensityToggle className="mb-6 mt-2" />
          <div className="space-y-6">
            {NAV.map((g) => (
              <div key={g.group}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">{g.group}</div>
                <ul className="grid grid-cols-2 gap-x-4">
                  {g.items.map((i) => (
                    <li key={i.href}>
                      <Link
                        href={i.href}
                        aria-current={pathname === i.href ? "page" : undefined}
                        className={`-mx-2 block rounded-md px-2 py-2 text-[14px] ${
                          pathname === i.href ? "bg-neutral-100 font-medium text-neutral-900" : "text-neutral-600"
                        }`}
                      >
                        {i.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
