"use client";

import { usePathname } from "next/navigation";

/**
 * Sidebar/mobile nav link with an active state: soft gray pill + full-weight
 * text for the current section (homedata-style), muted otherwise.
 */
export function NavItem({
  href, icon, label, compact,
}: {
  href: string; icon: React.ReactNode; label: string; compact?: boolean;
}) {
  const pathname = usePathname();
  const active = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      style={{ fontSize: "14px", lineHeight: "20px", letterSpacing: "-0.15px" }}
      className={`flex items-center gap-2.5 rounded-[8px] px-3 py-2 font-medium transition-colors ${
        active
          ? "bg-[#e2e8f066] text-foreground"
          : "text-muted-foreground hover:bg-[#e2e8f033] hover:text-foreground"
      } ${compact ? "flex-1 justify-center" : ""}`}
    >
      {icon} {label}
    </a>
  );
}
