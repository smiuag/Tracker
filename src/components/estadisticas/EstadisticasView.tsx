"use client";

import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { BlockTimeChart } from "@/components/dashboard/BlockTimeChart";
import { useEstadisticasData } from "@/hooks/useEstadisticasData";
import { useBlocks } from "@/hooks/useBlocks";
import { StatsSummaryGrid } from "./StatsSummaryGrid";
import { HoursByTopicChart } from "./HoursByTopicChart";
import { HoursByTypeChart } from "./HoursByTypeChart";
import { WeeklyEvolutionChart } from "./WeeklyEvolutionChart";

export function EstadisticasView() {
  const data = useEstadisticasData();
  const blocks = useBlocks();

  if (!data) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Cargando…"
        description="Un momento mientras leemos tus datos locales."
      />
    );
  }

  if (data.totalMinutes === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Todavía no hay estadísticas"
        description="Registra tus primeras sesiones desde 'Hoy' para ver aquí tu evolución."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <StatsSummaryGrid
        totalMinutes={data.totalMinutes}
        streak={data.streak}
        topicsCompleted={data.topicsCompleted}
        bestWeek={data.bestWeek}
        averageWeeklyMinutes={data.averageWeeklyMinutes}
        goalsCompliance={data.goalsCompliance}
      />
      <WeeklyEvolutionChart data={data.weeklyEvolution} />
      <HoursByTypeChart data={data.minutesByType} />
      <BlockTimeChart data={data.minutesByBlock} />
      <HoursByTopicChart data={data.minutesByTopic} blocks={blocks ?? []} />
    </div>
  );
}
