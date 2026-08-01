"use client";

import { Cell, Pie, PieChart } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { ChartContainer } from "@/components/ui/chart";
import type { TestAccuracy } from "@/lib/services/stats.service";

interface TestAccuracyChartProps {
  data: TestAccuracy;
}

export function TestAccuracyChart({ data }: TestAccuracyChartProps) {
  const chartData = [
    { name: "aciertos", value: data.aciertos, fill: "var(--primary)" },
    { name: "errores", value: data.errores, fill: "var(--accent)" },
  ];

  return (
    <SectionCard title="Aciertos en test">
      {data.totalPreguntas === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no has registrado ningún test.</p>
      ) : (
        <div className="flex items-center gap-4">
          <div className="relative size-28 shrink-0">
            <ChartContainer config={{}} className="aspect-square size-28">
              <PieChart>
                <Pie data={chartData} dataKey="value" innerRadius={38} outerRadius={54} stroke="none">
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold text-foreground">{data.porcentaje}%</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <p className="text-foreground">{data.aciertos} aciertos</p>
            <p className="text-muted-foreground">{data.errores} errores</p>
            <p className="text-muted-foreground">{data.totalPreguntas} preguntas totales</p>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
