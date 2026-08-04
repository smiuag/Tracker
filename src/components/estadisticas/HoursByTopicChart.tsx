"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { minutesToHoursLabel } from "@/lib/utils/date";
import type { TopicMinutes } from "@/lib/services/stats.service";
import type { Block } from "@/types/topic";

interface HoursByTopicChartProps {
  data: TopicMinutes[];
  blocks: Block[];
}

const chartConfig = {
  minutos: { label: "Tiempo invertido", color: "var(--primary)" },
} satisfies ChartConfig;

export function HoursByTopicChart({ data, blocks }: HoursByTopicChartProps) {
  const blockById = new Map(blocks.map((b) => [b.id, b.nombre]));
  const chartData = data.map((d) => ({
    tema: `${blockById.get(d.topic.blockId) ?? "Sin bloque"} · ${d.topic.nombre}`,
    minutos: d.minutos,
  }));

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
              width={180}
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
