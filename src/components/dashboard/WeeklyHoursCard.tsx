"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ProgressDonut } from "./ProgressDonut";
import { useWeekMinutes } from "@/hooks/useWeekMinutes";
import { addDays, isoWeekDates, minutesToHoursLabel, toFechaISO } from "@/lib/utils/date";

interface WeeklyHoursCardProps {
  goalHours: number | null;
}

function formatDayMonth(fecha: string): string {
  const [, month, day] = fecha.split("-");
  return `${day}/${month}`;
}

export function WeeklyHoursCard({ goalHours }: WeeklyHoursCardProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const today = toFechaISO(new Date());
  const referenceDate = addDays(today, weekOffset * 7);
  const liveMinutes = useWeekMinutes(referenceDate);
  // Evita el parpadeo a 0 mientras carga la semana recién seleccionada.
  const [cachedMinutes, setCachedMinutes] = useState(liveMinutes);
  if (liveMinutes !== undefined && liveMinutes !== cachedMinutes) setCachedMinutes(liveMinutes);
  const weeklyMinutes = liveMinutes ?? cachedMinutes ?? 0;
  const dates = isoWeekDates(referenceDate);

  const goalMinutes = goalHours ? goalHours * 60 : null;
  const percentage = goalMinutes ? Math.round((weeklyMinutes / goalMinutes) * 100) : 0;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div>
          <div className="flex items-center gap-1">
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => setWeekOffset((o) => o - 1)}
              aria-label="Semana anterior"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <p className="text-sm text-muted-foreground">
              {weekOffset === 0 ? "Esta semana" : `${formatDayMonth(dates[0])} – ${formatDayMonth(dates[6])}`}
            </p>
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => setWeekOffset((o) => Math.min(0, o + 1))}
              disabled={weekOffset >= 0}
              aria-label="Semana siguiente"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
          <p className="text-3xl font-semibold text-foreground">
            {minutesToHoursLabel(weeklyMinutes)}
          </p>
          {goalHours ? (
            <>
              <p className="mt-1 text-sm text-muted-foreground">
                Objetivo: {goalHours} h — {percentage}%
              </p>
              <Progress value={Math.min(100, percentage)} className="mt-2 w-48" />
            </>
          ) : (
            <Link
              href="/configuracion"
              className="mt-1 inline-block text-sm text-foreground underline underline-offset-2"
            >
              Configura tu objetivo diario
            </Link>
          )}
        </div>
        {goalHours && (
          <ProgressDonut
            percentage={percentage}
            centerLabel={`${percentage}%`}
            centerSublabel="semana"
          />
        )}
      </CardContent>
    </Card>
  );
}
