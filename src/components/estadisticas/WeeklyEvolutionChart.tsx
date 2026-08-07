"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatShortDayMonth, minutesToCompactTick, minutesToHoursLabel } from "@/lib/utils/date";
import type { WeekMinutes } from "@/lib/services/stats.service";

interface WeeklyEvolutionChartProps {
  data: WeekMinutes[];
}

const chartConfig = {
  minutos: { label: "Horas", color: "var(--primary)" },
} satisfies ChartConfig;

export function WeeklyEvolutionChart({ data }: WeeklyEvolutionChartProps) {
  const chartData = data.map((d) => ({ semana: formatShortDayMonth(d.weekStart), minutos: d.minutos }));

  return (
    <SectionCard title="Evolución semanal">
      {chartData.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no hay suficientes semanas con datos.</p>
      ) : (
        <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
          <BarChart data={chartData} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="semana"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              interval={chartData.length > 6 ? 1 : 0}
            />
            <YAxis
              tickFormatter={(v: number) => minutesToCompactTick(v)}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              width={44}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => <>Semana del {label}</>}
                  formatter={(value) => minutesToHoursLabel(Number(value))}
                />
              }
            />
            {/* Sin animación: al cambiar de periodo la gráfica se pinta al instante
                y no retiene los toques sobre las pestañas. */}
            <Bar dataKey="minutos" fill="var(--color-minutos)" radius={6} maxBarSize={48} isAnimationActive={false} />
          </BarChart>
        </ChartContainer>
      )}
    </SectionCard>
  );
}
