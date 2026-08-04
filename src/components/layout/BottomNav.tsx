"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { normalizePathname } from "@/lib/utils/path";
import { NAV_ITEMS } from "./navItems";

export function BottomNav() {
  const pathname = normalizePathname(usePathname());

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-card/80 md:hidden"
      aria-label="Navegación principal"
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 touch-manipulation flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
              active ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full transition-colors",
                active && "bg-primary"
              )}
            >
              <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
