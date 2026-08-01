"use client";

import { Cell, Pie, PieChart } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { ChartContainer } from "@/components/ui/chart";
import { minutesToHoursLabel } from "@/lib/utils/date";
import type { TypeMinutes } from "@/lib/services/stats.service";

interface HoursByTypeChartProps {
  data: TypeMinutes[];
}

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--muted)"];

export function HoursByTypeChart({ data }: HoursByTypeChartProps) {
  const total = data.reduce((sum, d) => sum + d.minutos, 0);

  return (
    <SectionCard title="Distribución por tipo de estudio">
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no hay sesiones registradas.</p>
      ) : (
        <div className="flex items-center gap-4">
          <ChartContainer config={{}} className="aspect-square size-32 shrink-0">
            <PieChart>
              <Pie data={data} dataKey="minutos" nameKey="label" innerRadius={38} outerRadius={56} stroke="none">
                {data.map((entry, i) => (
                  <Cell key={entry.tipo} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <ul className="flex flex-1 flex-col gap-1.5">
            {data.map((entry, i) => (
              <li key={entry.tipo} className="flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
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
