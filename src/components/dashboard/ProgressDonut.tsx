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

/** Salvia intenso de "objetivo superado" (mismo tono que calendario y racha). */
const OVERFLOW_COLOR = "#A9BBA1";

export function ProgressDonut({ percentage, centerLabel, centerSublabel }: ProgressDonutProps) {
  const clamped = Math.min(100, Math.max(0, percentage));
  // Segunda vuelta: el exceso sobre el 100% se dibuja encima, en salvia más
  // oscuro, rellenando de nuevo desde las 12 (tope: una vuelta extra).
  const overflow = Math.min(100, Math.max(0, percentage - 100));
  const data = [
    { name: "progreso", value: clamped, fill: "var(--color-progreso)" },
    { name: "restante", value: 100 - clamped, fill: "var(--color-restante)" },
  ];
  const overflowData = [
    { name: "extra", value: overflow, fill: OVERFLOW_COLOR },
    { name: "resto", value: 100 - overflow, fill: "transparent" },
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
            isAnimationActive={false}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          {overflow > 0 && (
            <Pie
              data={overflowData}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={70}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            >
              {overflowData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          )}
        </PieChart>
      </ChartContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-semibold text-foreground">{centerLabel}</span>
        <span className="text-xs text-muted-foreground">{centerSublabel}</span>
      </div>
    </div>
  );
}
