"use client";

import { BookCheck, ClipboardCheck, LayoutDashboard } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatTile } from "@/components/shared/StatTile";
import { useDashboardData } from "@/hooks/useDashboardData";
import { WeeklyHoursCard } from "./WeeklyHoursCard";
import { StreakBadge } from "./StreakBadge";
import { NextReviewCard } from "./NextReviewCard";
import { BlockTimeChart } from "./BlockTimeChart";
import { ContributionCalendar } from "./ContributionCalendar";
import { MonthlyGoalsCard } from "./MonthlyGoalsCard";

export function DashboardView() {
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

  const hasAnyData = data.weeklyMinutes > 0 || data.topicsCompleted > 0 || data.testsCount > 0;

  if (!hasAnyData) {
    return (
      <EmptyState
        icon={LayoutDashboard}
        title="Aún no has estudiado nada"
        description="Registra tu primera sesión desde 'Hoy' y aquí verás tu progreso al instante."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <WeeklyHoursCard
          weeklyMinutes={data.weeklyMinutes}
          goalHours={data.weeklyGoal?.valorObjetivo ?? null}
        />
        <StreakBadge streak={data.streak} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatTile icon={BookCheck} label="Temas completados" value={String(data.topicsCompleted)} />
        <StatTile icon={ClipboardCheck} label="Tests realizados" value={String(data.testsCount)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <NextReviewCard review={data.nextReview} />
        <MonthlyGoalsCard goal={data.monthlyGoal} />
      </div>

      <BlockTimeChart data={data.minutesByBlock} />
      <ContributionCalendar days={data.contributionDays} />
    </div>
  );
}
