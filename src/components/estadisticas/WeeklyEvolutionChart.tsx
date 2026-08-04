"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { minutesToCompactTick, minutesToHoursLabel } from "@/lib/utils/date";
import type { WeekMinutes } from "@/lib/services/stats.service";

interface WeeklyEvolutionChartProps {
  data: WeekMinutes[];
}

const chartConfig = {
  minutos: { label: "Horas", color: "var(--primary)" },
} satisfies ChartConfig;

export function WeeklyEvolutionChart({ data }: WeeklyEvolutionChartProps) {
  const chartData = data.map((d) => ({ semana: d.weekStart.slice(5), minutos: d.minutos }));
  const hasData = chartData.some((d) => d.minutos > 0);

  return (
    <SectionCard title="Evolución semanal">
      {!hasData ? (
        <p className="text-sm text-muted-foreground">Todavía no hay suficientes semanas con datos.</p>
      ) : (
        <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
          <BarChart data={chartData} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="semana" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis
              tickFormatter={(v: number) => minutesToCompactTick(v)}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              width={44}
            />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value) => minutesToHoursLabel(Number(value))} />}
            />
            <Bar dataKey="minutos" fill="var(--color-minutos)" radius={6} />
          </BarChart>
        </ChartContainer>
      )}
    </SectionCard>
  );
}
