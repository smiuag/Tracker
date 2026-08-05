"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { normalizePathname } from "@/lib/utils/path";
import { NAV_ITEMS } from "./navItems";

/** Tolerancia de movimiento (px) entre bajar y levantar el dedo para seguir
 *  contando el gesto como pulsación. El reconocedor nativo de iOS es mucho
 *  más estricto y descartaba toques con un micro-deslizamiento. */
const TAP_SLOP_PX = 24;

export function BottomNav() {
  const pathname = normalizePathname(usePathname());
  const router = useRouter();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex touch-none border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-card/80 md:hidden"
      aria-label="Navegación principal"
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onPointerDown={(e) => {
              touchStart.current = { x: e.clientX, y: e.clientY };
            }}
            onPointerUp={(e) => {
              const start = touchStart.current;
              touchStart.current = null;
              if (!start) return;
              if (Math.hypot(e.clientX - start.x, e.clientY - start.y) <= TAP_SLOP_PX) {
                router.push(item.href);
              }
            }}
            onPointerCancel={() => {
              touchStart.current = null;
            }}
            onClick={(e) => {
              // La navegación táctil/ratón ya se hizo en pointerup; solo se
              // deja pasar el click de teclado (Enter), que llega con detail 0.
              if (e.detail > 0) e.preventDefault();
            }}
            className={cn(
              // [-webkit-touch-callout:none] evita el menú contextual de iOS
              // (Abrir / Copiar enlace / Compartir…) al mantener pulsado el icono.
              "flex flex-1 touch-none select-none flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors [-webkit-touch-callout:none]",
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
