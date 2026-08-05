"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { StatsPeriod } from "@/hooks/useEstadisticasData";

const OPTIONS: { value: StatsPeriod; label: string }[] = [
  { value: "todo", label: "Todo" },
  { value: "mes", label: "Último mes" },
  { value: "semana", label: "Última semana" },
];

interface StatsPeriodSelectorProps {
  value: StatsPeriod;
  onChange: (period: StatsPeriod) => void;
}

export function StatsPeriodSelector({ value, onChange }: StatsPeriodSelectorProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as StatsPeriod)}>
      <TabsList className="w-full">
        {OPTIONS.map((option) => (
          <TabsTrigger key={option.value} value={option.value}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
