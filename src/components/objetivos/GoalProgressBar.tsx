import { Progress } from "@/components/ui/progress";

interface GoalProgressBarProps {
  valorActual: number;
  valorObjetivo: number;
}

export function GoalProgressBar({ valorActual, valorObjetivo }: GoalProgressBarProps) {
  const percentage = valorObjetivo > 0 ? Math.round((valorActual / valorObjetivo) * 100) : 0;
  return (
    <div>
      <Progress value={Math.min(100, percentage)} />
      <p className="mt-1 text-xs text-muted-foreground">{percentage}% completado</p>
    </div>
  );
}
