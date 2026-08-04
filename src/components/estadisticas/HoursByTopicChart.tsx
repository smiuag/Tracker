"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { minutesToCompactTick, minutesToHoursLabel } from "@/lib/utils/date";
import { parseTopicNumber } from "@/lib/utils/topicName";
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
  const blockById = new Map(blocks.map((b) => [b.id, b]));
  // Orden del temario: nº de bloque y, dentro de cada bloque, nº de tema.
  const chartData = [...data]
    .sort((a, b) => {
      const blockDiff =
        (blockById.get(a.topic.blockId)?.orden ?? 0) - (blockById.get(b.topic.blockId)?.orden ?? 0);
      if (blockDiff !== 0) return blockDiff;
      return (parseTopicNumber(a.topic.nombre) ?? Infinity) - (parseTopicNumber(b.topic.nombre) ?? Infinity);
    })
    .map((d) => ({
      tema: `${blockById.get(d.topic.blockId)?.nombre ?? "Sin bloque"} · ${d.topic.nombre}`,
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
              tickFormatter={(v: number) => minutesToCompactTick(v)}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
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
