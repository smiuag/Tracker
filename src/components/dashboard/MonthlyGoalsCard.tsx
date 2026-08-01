import Link from "next/link";
import { Target } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { Progress } from "@/components/ui/progress";
import type { Goal } from "@/types/goal";

interface MonthlyGoalsCardProps {
  goal: Goal | null;
}

const METRIC_LABEL: Record<Goal["metrica"], string> = {
  horas: "horas",
  temas: "temas",
  tests: "tests",
};

export function MonthlyGoalsCard({ goal }: MonthlyGoalsCardProps) {
  const action = (
    <Link
      href="/objetivos"
      className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
    >
      {goal ? "Ver todos" : "Configurar"}
    </Link>
  );

  if (!goal) {
    return (
      <SectionCard title="Objetivo mensual" action={action}>
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary">
            <Target className="size-4 text-foreground" />
          </span>
          <p className="text-sm text-muted-foreground">
            Todavía no has definido un objetivo para este mes.
          </p>
        </div>
      </SectionCard>
    );
  }

  const percentage = goal.valorObjetivo
    ? Math.round((goal.valorActual / goal.valorObjetivo) * 100)
    : 0;

  return (
    <SectionCard title="Objetivo mensual" action={action}>
      <p className="text-sm text-foreground">
        {Math.round(goal.valorActual)} / {goal.valorObjetivo} {METRIC_LABEL[goal.metrica]}
      </p>
      <Progress value={Math.min(100, percentage)} className="mt-2" />
      <p className="mt-1 text-xs text-muted-foreground">{percentage}% completado</p>
    </SectionCard>
  );
}
