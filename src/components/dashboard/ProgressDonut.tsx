"use client";

import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

interface ProgressDonutProps {
  percentage: number;
  centerLabel: string;
  centerSublabel: string;
}

const chartConfig = {
  progreso: { label: "Progreso", color: "var(--primary)" },
  restante: { label: "Restante", color: "var(--secondary)" },
} satisfies ChartConfig;

export function ProgressDonut({ percentage, centerLabel, centerSublabel }: ProgressDonutProps) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const data = [
    { name: "progreso", value: clamped, fill: "var(--color-progreso)" },
    { name: "restante", value: 100 - clamped, fill: "var(--color-restante)" },
  ];

  return (
    <div className="relative mx-auto size-40">
      <ChartContainer config={chartConfig} className="mx-auto aspect-square size-40">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={52}
            outerRadius={70}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-semibold text-foreground">{centerLabel}</span>
        <span className="text-xs text-muted-foreground">{centerSublabel}</span>
      </div>
    </div>
  );
}
