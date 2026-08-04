"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DailyTaskChecklist } from "@/components/hoy/DailyTaskChecklist";
import { AddPastSessionForm } from "./AddPastSessionForm";
import { useDayDetail } from "@/hooks/useDayDetail";
import { minutesToHoursLabel, toFechaISO } from "@/lib/utils/date";
import type { FechaISO } from "@/types/common";

interface DayDetailSheetProps {
  fecha: FechaISO | null;
  onClose: () => void;
}

export function DayDetailSheet({ fecha, onClose }: DayDetailSheetProps) {
  const detail = useDayDetail(fecha);
  const isPastDay = !!fecha && fecha < toFechaISO(new Date());

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
            <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-6">
              {detail && detail.sessions.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {detail.sessions.map((session) => (
                    <li key={session.id} className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {session.topicNombre ?? "Sin tema"}
                          </p>
                          <p className="text-xs text-muted-foreground">{session.tipoLabel}</p>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {minutesToHoursLabel(session.duracionMin)}
                        </span>
                      </div>
                      {session.observaciones && (
                        <p className="rounded-lg bg-secondary/40 p-2 text-xs text-foreground">
                          {session.observaciones}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Sin sesiones registradas este día.</p>
              )}

              {detail?.dailyLog && (
                <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-secondary/30 p-3">
                  <p className="text-sm font-medium text-foreground">Día terminado 🥇</p>
                  <p className="flex items-center gap-1.5 text-sm text-foreground">
                    Productividad
                    <span className="flex gap-0.5" aria-label={`${detail.dailyLog.productividad} de 5`}>
                      {([1, 2, 3, 4, 5] as const).map((n) => (
                        <span
                          key={n}
                          className={
                            n <= detail.dailyLog!.productividad
                              ? "size-2.5 rounded-full bg-primary"
                              : "size-2.5 rounded-full bg-secondary"
                          }
                          aria-hidden
                        />
                      ))}
                    </span>
                  </p>
                  {detail.dailyLog.reflexion && (
                    <p className="text-sm text-foreground">{detail.dailyLog.reflexion}</p>
                  )}
                </div>
              )}

              {isPastDay && <AddPastSessionForm fecha={fecha} />}

              <DailyTaskChecklist fecha={fecha} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
