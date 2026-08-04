import type { ReactNode } from "react";
import { SideNav } from "./SideNav";
import { BottomNav } from "./BottomNav";
import { DbInitializer } from "./DbInitializer";
import { WeeklyReportSheet } from "./WeeklyReportSheet";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <div className="flex min-h-full">
        <DbInitializer />
        <WeeklyReportSheet />
        <SideNav />
        <div className="flex min-h-full flex-1 flex-col">
          <main className="flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10 md:pt-8">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </main>
          <BottomNav />
        </div>
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
