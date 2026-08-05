"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { minutesToCompactTick, minutesToHoursLabel } from "@/lib/utils/date";
import { parseTopicNumber } from "@/lib/utils/topicName";
import { STUDY_TYPES, STUDY_TYPE_COLORS, STUDY_TYPE_LABELS } from "@/lib/constants/studyTypes";
import type { TopicMinutes } from "@/lib/services/stats.service";
import type { Block } from "@/types/topic";

interface HoursByTopicChartProps {
  data: TopicMinutes[];
  blocks: Block[];
}

const chartConfig = Object.fromEntries(
  STUDY_TYPES.map((tipo) => [tipo, { label: STUDY_TYPE_LABELS[tipo], color: STUDY_TYPE_COLORS[tipo] }])
) satisfies ChartConfig;

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
      ...d.porTipo,
    }));

  return (
    <SectionCard title="Horas por tema">
      {chartData.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay sesiones en este periodo.</p>
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
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) =>
                    Number(value) > 0 ? (
                      <span className="flex w-full items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: item?.color }}
                            aria-hidden
                          />
                          {chartConfig[name as keyof typeof chartConfig]?.label ?? name}
                        </span>
                        <span className="text-foreground">{minutesToHoursLabel(Number(value))}</span>
                      </span>
                    ) : null
                  }
                />
              }
            />
            {STUDY_TYPES.map((tipo) => (
              <Bar key={tipo} dataKey={tipo} stackId="tipo" fill={STUDY_TYPE_COLORS[tipo]} />
            ))}
          </BarChart>
        </ChartContainer>
      )}
    </SectionCard>
  );
}
