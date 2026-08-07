"use client";

import { Cell, Pie, PieChart } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { ChartContainer } from "@/components/ui/chart";
import { minutesToHoursLabel } from "@/lib/utils/date";
import { STUDY_TYPE_COLORS } from "@/lib/constants/studyTypes";
import type { TypeMinutes } from "@/lib/services/stats.service";

interface HoursByTypeChartProps {
  data: TypeMinutes[];
}

export function HoursByTypeChart({ data }: HoursByTypeChartProps) {
  const total = data.reduce((sum, d) => sum + d.minutos, 0);

  return (
    <SectionCard title="Distribución por tipo de estudio">
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay sesiones en este periodo.</p>
      ) : (
        <div className="flex items-center gap-4">
          <ChartContainer config={{}} className="aspect-square size-32 shrink-0">
            <PieChart>
              <Pie
                data={data}
                dataKey="minutos"
                nameKey="label"
                innerRadius={38}
                outerRadius={56}
                stroke="none"
                isAnimationActive={false}
              >
                {data.map((entry) => (
                  <Cell key={entry.tipo} fill={STUDY_TYPE_COLORS[entry.tipo]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <ul className="flex flex-1 flex-col gap-1.5">
            {data.map((entry) => (
              <li key={entry.tipo} className="flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: STUDY_TYPE_COLORS[entry.tipo] }}
                    aria-hidden
                  />
                  {entry.label}
                </span>
                <span className="text-foreground">{minutesToHoursLabel(entry.minutos)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {total > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">Total: {minutesToHoursLabel(total)}</p>
      )}
    </SectionCard>
  );
}
