"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { normalizePathname } from "@/lib/utils/path";
import { NAV_ITEMS } from "./navItems";

export function SideNav() {
  const pathname = normalizePathname(usePathname());

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-sidebar px-3 py-6 md:flex md:flex-col">
      <div className="mb-8 px-3">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          OpoFlow
        </span>
      </div>
      <nav className="flex flex-col gap-1" aria-label="Navegación principal">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
