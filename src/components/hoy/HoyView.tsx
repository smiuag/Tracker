"use client";

import { Sun } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { useTodayData } from "@/hooks/useTodayData";
import { useTopics } from "@/hooks/useTopics";
import { usePendingReviews } from "@/hooks/useReviews";
import { TodayGoalCard } from "./TodayGoalCard";
import { SessionRecorderCard } from "./SessionRecorderCard";
import { TodaySessionsList } from "./TodaySessionsList";
import { TodayTopicsList } from "./TodayTopicsList";
import { TodayReviewsList } from "./TodayReviewsList";
import { EndOfDaySummarySheet } from "./EndOfDaySummarySheet";

export function HoyView() {
  const data = useTodayData();
  const topics = useTopics();
  const reviews = usePendingReviews();

  if (!data) {
    return (
      <EmptyState
        icon={Sun}
        title="Cargando…"
        description="Un momento mientras leemos tus datos locales."
      />
    );
  }

  // Solo objetivos diarios medidos en horas tienen sentido en esta tarjeta;
  // objetivos de "temas" o "tests" se gestionan en Objetivos/Estadísticas.
  const hoursGoal = data.dailyGoal?.metrica === "horas" ? data.dailyGoal : null;

  return (
    <div className="flex flex-col gap-4">
      <TodayGoalCard totalMinutes={data.totalMinutes} goal={hoursGoal} />
      <SessionRecorderCard />
      <TodayReviewsList reviews={reviews ? [...reviews.atrasados, ...reviews.hoy] : []} />
      <TodaySessionsList sessions={data.sessions} topics={topics} />
      <TodayTopicsList topics={topics} />
      <div className="flex justify-end">
        <EndOfDaySummarySheet
          fecha={data.today}
          totalMinutes={data.totalMinutes}
          sessionCount={data.sessions.length}
          horasObjetivo={hoursGoal?.valorObjetivo ?? 0}
        />
      </div>
    </div>
  );
}
