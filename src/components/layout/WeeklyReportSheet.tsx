"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  getLastSeenWeekStart,
  setLastSeenWeekStart,
} from "@/lib/services/settings.service";
import { getWeeklyReport, type WeeklyReport } from "@/lib/services/stats.service";
import { minutesToHoursLabel, startOfIsoWeek, toFechaISO } from "@/lib/utils/date";

/** Se muestra una sola vez, la primera vez que se abre la app en una semana ISO nueva. */
export function WeeklyReportSheet() {
  const [report, setReport] = useState<WeeklyReport | null>(null);

  useEffect(() => {
    (async () => {
      const currentWeekStart = startOfIsoWeek(toFechaISO(new Date()));
      const lastSeenWeekStart = await getLastSeenWeekStart();

      if (lastSeenWeekStart && lastSeenWeekStart !== currentWeekStart) {
        setReport(await getWeeklyReport(lastSeenWeekStart));
      }
      if (lastSeenWeekStart !== currentWeekStart) {
        await setLastSeenWeekStart(currentWeekStart);
      }
    })();
  }, []);

  return (
    <Sheet open={!!report} onOpenChange={(open) => !open && setReport(null)}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Informe semanal</SheetTitle>
          <SheetDescription>Así te fue la semana pasada</SheetDescription>
        </SheetHeader>
        {report && (
          <div className="flex flex-col gap-4 px-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-secondary/40 p-3 text-center">
                <p className="text-lg font-semibold text-foreground">
                  {minutesToHoursLabel(report.totalMinutes)}
                </p>
                <p className="text-xs text-muted-foreground">Horas de estudio</p>
              </div>
              <div className="rounded-xl bg-secondary/40 p-3 text-center">
                <p className="text-lg font-semibold text-foreground">{report.studyDays}</p>
                <p className="text-xs text-muted-foreground">
                  {report.studyDays === 1 ? "Sesión de estudio" : "Sesiones de estudio"}
                </p>
              </div>
              <div className="rounded-xl bg-secondary/40 p-3 text-center">
                <p className="text-lg font-semibold text-foreground">{report.restDays}</p>
                <p className="text-xs text-muted-foreground">
                  {report.restDays === 1 ? "Día de descanso" : "Días de descanso"}
                </p>
              </div>
            </div>

            {report.topicNames.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Temas estudiados</p>
                <ul className="flex flex-wrap gap-1.5">
                  {report.topicNames.map((nombre) => (
                    <li
                      key={nombre}
                      className="rounded-full bg-primary/30 px-2.5 py-1 text-xs text-foreground"
                    >
                      {nombre}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
