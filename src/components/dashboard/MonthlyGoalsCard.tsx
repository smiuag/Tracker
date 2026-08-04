import Link from "next/link";
import { Target } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { Progress } from "@/components/ui/progress";
import { minutesToHoursLabel } from "@/lib/utils/date";

interface MonthlyGoalsCardProps {
  monthMinutes: number;
  goalHours: number | null;
}

export function MonthlyGoalsCard({ monthMinutes, goalHours }: MonthlyGoalsCardProps) {
  if (!goalHours) {
    return (
      <SectionCard
        title="Objetivo mensual"
        action={
          <Link
            href="/configuracion"
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Configurar
          </Link>
        }
      >
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary">
            <Target className="size-4 text-foreground" />
          </span>
          <p className="text-sm text-muted-foreground">
            Todavía no has definido un objetivo diario en Configuración.
          </p>
        </div>
      </SectionCard>
    );
  }

  const goalMinutes = goalHours * 60;
  const percentage = Math.round((monthMinutes / goalMinutes) * 100);

  return (
    <SectionCard title="Objetivo mensual">
      <p className="text-sm text-foreground">
        {minutesToHoursLabel(monthMinutes)} / {goalHours} h
      </p>
      <Progress value={Math.min(100, percentage)} className="mt-2" />
      <p className="mt-1 text-xs text-muted-foreground">{percentage}% completado</p>
    </SectionCard>
  );
}
