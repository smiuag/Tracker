"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DailyTaskChecklist } from "@/components/hoy/DailyTaskChecklist";
import { useDayDetail } from "@/hooks/useDayDetail";
import { minutesToHoursLabel } from "@/lib/utils/date";
import type { FechaISO } from "@/types/common";

interface DayDetailSheetProps {
  fecha: FechaISO | null;
  onClose: () => void;
}

export function DayDetailSheet({ fecha, onClose }: DayDetailSheetProps) {
  const detail = useDayDetail(fecha);

  return (
    <Sheet open={!!fecha} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right">
        {fecha && (
          <>
            <SheetHeader>
              <SheetTitle>{fecha}</SheetTitle>
              <SheetDescription>
                {detail ? minutesToHoursLabel(detail.totalMinutes) : "Cargando…"}
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 overflow-y-auto px-4">
              {detail && detail.sessions.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {detail.sessions.map((session) => (
                    <li key={session.id} className="flex items-center justify-between text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {session.topicNombre ?? "Sin tema"}
                        </p>
                        <p className="text-xs text-muted-foreground">{session.tipoLabel}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {minutesToHoursLabel(session.duracionMin)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Sin sesiones registradas este día.</p>
              )}

              <DailyTaskChecklist fecha={fecha} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
