"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { DayDetailSheet } from "./DayDetailSheet";
import { useMonthOverview } from "@/hooks/useMonthOverview";
import { fromFechaISO, toFechaISO } from "@/lib/utils/date";
import { INTENSITY_BUCKET_CLASSES, minutesToIntensityBucket } from "@/lib/utils/colors";
import { cn } from "@/lib/utils";
import type { FechaISO } from "@/types/common";

const MONTH_LABELS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

function firstOfMonth(fecha: FechaISO): FechaISO {
  const [year, month] = fecha.split("-");
  return `${year}-${month}-01`;
}

function addMonths(fecha: FechaISO, delta: number): FechaISO {
  const [year, month] = fecha.split("-").map(Number);
  return toFechaISO(new Date(year, month - 1 + delta, 1));
}

/** 0 = lunes … 6 = domingo (para alinear el grid, distinto de Date#getDay()). */
function isoWeekdayOf(fecha: FechaISO): number {
  const jsDay = fromFechaISO(fecha).getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function MonthCalendar() {
  const [monthDate, setMonthDate] = useState(() => firstOfMonth(toFechaISO(new Date())));
  const [selectedDay, setSelectedDay] = useState<FechaISO | null>(null);
  const days = useMonthOverview(monthDate);

  const [year, month] = monthDate.split("-").map(Number);
  const leadingBlanks = days && days.length > 0 ? isoWeekdayOf(days[0].fecha) : 0;

  return (
    <SectionCard
      title="Calendario"
      action={
        <div className="flex items-center gap-1">
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => setMonthDate((d) => addMonths(d, -1))}
            aria-label="Mes anterior"
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <span className="min-w-28 text-center text-xs text-muted-foreground capitalize">
            {MONTH_LABELS[month - 1]} {year}
          </span>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => setMonthDate((d) => addMonths(d, 1))}
            aria-label="Mes siguiente"
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days?.map((day) => {
          const bucket = minutesToIntensityBucket(day.minutos);
          const dayNumber = Number(day.fecha.split("-")[2]);
          const title =
            day.topics.length > 0
              ? day.topics.map((t) => t.nombre).join(", ")
              : "Sin sesiones";
          return (
            <button
              key={day.fecha}
              type="button"
              onClick={() => setSelectedDay(day.fecha)}
              title={title}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-md text-xs text-foreground transition-transform hover:scale-105",
                INTENSITY_BUCKET_CLASSES[bucket]
              )}
            >
              {dayNumber}
            </button>
          );
        })}
      </div>

      <DayDetailSheet fecha={selectedDay} onClose={() => setSelectedDay(null)} />
    </SectionCard>
  );
}
