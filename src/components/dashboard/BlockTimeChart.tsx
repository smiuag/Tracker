"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { minutesToCompactTick, minutesToHoursLabel } from "@/lib/utils/date";
import { STUDY_TYPES, STUDY_TYPE_COLORS, STUDY_TYPE_LABELS } from "@/lib/constants/studyTypes";
import type { BlockMinutes } from "@/lib/services/stats.service";

interface BlockTimeChartProps {
  data: BlockMinutes[];
  emptyMessage?: string;
}

const chartConfig = Object.fromEntries(
  STUDY_TYPES.map((tipo) => [tipo, { label: STUDY_TYPE_LABELS[tipo], color: STUDY_TYPE_COLORS[tipo] }])
) satisfies ChartConfig;

export function BlockTimeChart({
  data,
  emptyMessage = "Todavía no hay sesiones registradas por bloque.",
}: BlockTimeChartProps) {
  const chartData = data.map((d) => ({
    bloque: d.block.nombre,
    ...d.porTipo,
  }));
  const hasData = data.some((d) => d.minutos > 0);

  return (
    <SectionCard title="Tiempo por bloques">
      {hasData ? (
        <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
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
              <Bar
                key={tipo}
                dataKey={tipo}
                stackId="tipo"
                fill={STUDY_TYPE_COLORS[tipo]}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ChartContainer>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      )}
    </SectionCard>
  );
}
