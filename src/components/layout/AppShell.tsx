"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { normalizePathname } from "@/lib/utils/path";
import { SideNav } from "./SideNav";
import { BottomNav } from "./BottomNav";
import { DbInitializer } from "./DbInitializer";
import { WeeklyReportSheet } from "./WeeklyReportSheet";
import { BackupReminderSheet } from "./BackupReminderSheet";
import { UpdateAvailableToast } from "./UpdateAvailableToast";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = normalizePathname(usePathname());

  // Páginas públicas (link-in-bio y guía de instalación): sin navegación ni
  // mobiliario de la app — las ven visitantes de Instagram, no usuarios.
  if (pathname === "/enlaces" || pathname === "/instalar" || pathname === "/ayuda") {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-full">
        <DbInitializer />
        <WeeklyReportSheet />
        <BackupReminderSheet />
        <UpdateAvailableToast />
        <SideNav />
        {/* min-w-0: sin él, el contenido ancho (p. ej. las pestañas de bloques)
            ensancha el layout entero en vez de hacer scroll interno. */}
        <div className="flex min-h-full min-w-0 flex-1 flex-col">
          <main className="flex-1 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6 md:px-8 md:pb-10 md:pt-8">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </main>
          <BottomNav />
        </div>
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
