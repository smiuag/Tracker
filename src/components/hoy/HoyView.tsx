"use client";

import { Sun } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { useTodayData } from "@/hooks/useTodayData";
import { useTopics } from "@/hooks/useTopics";
import { TodayGoalCard } from "./TodayGoalCard";
import { DailyTaskChecklist } from "./DailyTaskChecklist";
import { SessionRecorderCard } from "./SessionRecorderCard";
import { TodaySessionsList } from "./TodaySessionsList";
import { EndOfDaySummarySheet } from "./EndOfDaySummarySheet";

export function HoyView() {
  const data = useTodayData();
  const topics = useTopics();

  if (!data) {
    return (
      <EmptyState
        icon={Sun}
        title="Cargando…"
        description="Un momento mientras leemos tus datos locales."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <TodayGoalCard totalMinutes={data.totalMinutes} goalHours={data.dailyGoalHours || null} />
      <DailyTaskChecklist fecha={data.today} />
      <SessionRecorderCard />
      <TodaySessionsList sessions={data.sessions} topics={topics} />
      <div className="flex justify-end">
        <EndOfDaySummarySheet
          fecha={data.today}
          totalMinutes={data.totalMinutes}
          sessionCount={data.sessions.length}
          horasObjetivo={data.dailyGoalHours}
        />
      </div>
    </div>
  );
}
