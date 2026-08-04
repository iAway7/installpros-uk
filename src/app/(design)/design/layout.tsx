import type { Metadata } from "next";
import Link from "next/link";
import { NAV } from "./_components/nav";
import { DocsFooter } from "./_components/docs-footer";

export const metadata: Metadata = {
  title: { default: "InstallPros Design System", template: "%s | InstallPros Design" },
  description:
    "The design system behind installpros.co.uk — tokens, typography and components, rendered from the same code that ships.",
  robots: { index: false, follow: false },
};

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-white text-neutral-900 antialiased">
      <div className="mx-auto flex max-w-[1240px] gap-12 px-6 lg:px-10">
        <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 overflow-y-auto py-10 lg:block">
          <Link href="/design" className="block">
            <div className="text-[15px] font-semibold tracking-[-0.01em]">InstallPros</div>
            <div className="text-[13px] text-neutral-500">Design System</div>
          </Link>
          <nav className="mt-10 space-y-8">
            {NAV.map((g) => (
              <div key={g.group}>
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  {g.group}
                </div>
                <ul className="space-y-1">
                  {g.items.map((i) => (
                    <li key={i.href}>
                      <Link
                        href={i.href}
                        className="-mx-2 block rounded-md px-2 py-1.5 text-[14px] text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        {i.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 py-10 lg:py-16">
          {children}
          <DocsFooter />
        </main>
      </div>
    </div>
  );
}
