"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { minutesToHoursLabel } from "@/lib/utils/date";
import type { TopicMinutes } from "@/lib/services/stats.service";

interface HoursByTopicChartProps {
  data: TopicMinutes[];
}

const chartConfig = {
  minutos: { label: "Tiempo invertido", color: "var(--primary)" },
} satisfies ChartConfig;

export function HoursByTopicChart({ data }: HoursByTopicChartProps) {
  const chartData = data.map((d) => ({ tema: d.topic.nombre, minutos: d.minutos }));

  return (
    <SectionCard title="Horas por tema">
      {chartData.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no hay sesiones registradas.</p>
      ) : (
        <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 8 }}>
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis
              type="number"
              tickFormatter={(v: number) => minutesToHoursLabel(v)}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              dataKey="tema"
              type="category"
              width={140}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
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
