"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { minutesToHoursLabel } from "@/lib/utils/date";
import type { BlockMinutes } from "@/lib/services/stats.service";

interface BlockTimeChartProps {
  data: BlockMinutes[];
}

const chartConfig = {
  minutos: { label: "Tiempo invertido", color: "var(--primary)" },
} satisfies ChartConfig;

export function BlockTimeChart({ data }: BlockTimeChartProps) {
  const chartData = data.map((d) => ({
    bloque: d.block.nombre,
    minutos: d.minutos,
  }));
  const hasData = chartData.some((d) => d.minutos > 0);

  return (
    <SectionCard title="Tiempo por bloques">
      {hasData ? (
        <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 8 }}>
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis
              type="number"
              tickFormatter={(v: number) => minutesToHoursLabel(v)}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              dataKey="bloque"
              type="category"
              width={140}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => minutesToHoursLabel(Number(value))}
                />
              }
            />
            <Bar dataKey="minutos" fill="var(--color-minutos)" radius={6} />
          </BarChart>
        </ChartContainer>
      ) : (
        <p className="text-sm text-muted-foreground">
          Todavía no hay sesiones registradas por bloque.
        </p>
      )}
    </SectionCard>
  );
}
