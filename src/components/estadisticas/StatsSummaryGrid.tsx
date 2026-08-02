import { BookCheck, Flame, TrendingUp, Trophy, Target } from "lucide-react";
import { StatTile } from "@/components/shared/StatTile";
import { minutesToHoursLabel } from "@/lib/utils/date";
import type { WeekMinutes } from "@/lib/services/stats.service";

interface StatsSummaryGridProps {
  totalMinutes: number;
  streak: number;
  topicsCompleted: number;
  bestWeek: WeekMinutes | null;
  averageWeeklyMinutes: number;
  goalsCompliance: number;
}

export function StatsSummaryGrid({
  totalMinutes,
  streak,
  topicsCompleted,
  bestWeek,
  averageWeeklyMinutes,
  goalsCompliance,
}: StatsSummaryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatTile icon={TrendingUp} label="Horas totales" value={minutesToHoursLabel(totalMinutes)} />
      <StatTile icon={Flame} label="Racha activa" value={`${streak} días`} />
      <StatTile icon={BookCheck} label="Temas completados" value={String(topicsCompleted)} />
      <StatTile
        icon={Trophy}
        label="Mejor semana"
        value={bestWeek ? minutesToHoursLabel(bestWeek.minutos) : "—"}
      />
      <StatTile icon={Target} label="Media semanal" value={minutesToHoursLabel(Math.round(averageWeeklyMinutes))} />
      <StatTile icon={Target} label="Objetivos cumplidos" value={`${goalsCompliance}%`} />
    </div>
  );
}
