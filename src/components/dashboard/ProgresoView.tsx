"use client";

import { CheckCircle2, LayoutDashboard, ListTodo, Target } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatTile } from "@/components/shared/StatTile";
import { useDashboardData } from "@/hooks/useDashboardData";
import { ExamCountdownCard } from "./ExamCountdownCard";
import { WeeklyHoursCard } from "./WeeklyHoursCard";
import { StreakBadge } from "./StreakBadge";
import { TopicProgressBar } from "./TopicProgressBar";
import { CurrentTopicCard } from "./CurrentTopicCard";
import { BlockTimeChart } from "./BlockTimeChart";
import { MonthCalendar } from "./MonthCalendar";
import { MonthlyGoalsCard } from "./MonthlyGoalsCard";

export function ProgresoView() {
  const data = useDashboardData();

  if (!data) {
    return (
      <EmptyState
        icon={LayoutDashboard}
        title="Cargando tu progreso…"
        description="Un momento mientras leemos tus datos locales."
      />
    );
  }

  const hasAnyData = data.weeklyMinutes > 0 || data.topicsCompleted > 0 || data.topicProgress.total > 0;

  if (!hasAnyData) {
    return (
      <EmptyState
        icon={LayoutDashboard}
        title="Aún no has estudiado nada"
        description="Registra tu primera sesión desde 'Hoy' y aquí verás tu progreso al instante."
      />
    );
  }

  const dailyGoalMinutes = data.dailyGoalHours * 60;
  const dailyPercentage =
    dailyGoalMinutes > 0 ? Math.round((data.dailyMinutes / dailyGoalMinutes) * 100) : null;
  const weeklyGoalMinutes = data.weeklyGoalHours * 60;
  const weeklyPercentage =
    weeklyGoalMinutes > 0 ? Math.round((data.weeklyMinutes / weeklyGoalMinutes) * 100) : null;

  return (
    <div className="flex flex-col gap-4">
      {data.fechaExamen && <ExamCountdownCard fechaExamen={data.fechaExamen} />}

      <TopicProgressBar breakdown={data.topicProgress} />

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <WeeklyHoursCard goalHours={data.weeklyGoalHours || null} />
        <StreakBadge
          streak={data.streak}
          streakDays={data.streakDays}
          consecutiveActiveWeeks={data.consecutiveActiveWeeks}
        />
      </div>

      {(dailyPercentage !== null || weeklyPercentage !== null) && (
        <div className="grid grid-cols-2 gap-4">
          {dailyPercentage !== null && (
            <StatTile icon={Target} label="Cumplimiento diario" value={`${dailyPercentage}%`} />
          )}
          {weeklyPercentage !== null && (
            <StatTile icon={Target} label="Cumplimiento semanal" value={`${weeklyPercentage}%`} />
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <StatTile icon={CheckCircle2} label="Temas completados" value={String(data.topicsCompleted)} />
        <StatTile icon={ListTodo} label="Temas restantes" value={String(data.topicsPending)} />
      </div>

      <CurrentTopicCard topic={data.currentTopic} minutesByType={data.currentTopicMinutesByType} />

      <MonthlyGoalsCard monthMinutes={data.monthMinutes} goalHours={data.monthlyGoalHours || null} />

      <BlockTimeChart data={data.minutesByBlock} />
      <MonthCalendar />
    </div>
  );
}
