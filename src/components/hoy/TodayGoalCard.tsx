import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { minutesToHoursLabel } from "@/lib/utils/date";
import type { Goal } from "@/types/goal";

interface TodayGoalCardProps {
  totalMinutes: number;
  goal: Goal | null;
}

export function TodayGoalCard({ totalMinutes, goal }: TodayGoalCardProps) {
  const goalMinutes = goal ? goal.valorObjetivo * 60 : null;
  const percentage = goalMinutes ? Math.round((totalMinutes / goalMinutes) * 100) : 0;

  return (
    <Card>
      <CardContent>
        <p className="text-sm text-muted-foreground">Objetivo del día</p>
        <p className="text-2xl font-semibold text-foreground">
          {minutesToHoursLabel(totalMinutes)}
          {goal && (
            <span className="ml-1 text-base font-normal text-muted-foreground">
              / {goal.valorObjetivo} h
            </span>
          )}
        </p>
        {goal ? (
          <Progress value={Math.min(100, percentage)} className="mt-2 w-full max-w-xs" />
        ) : (
          <Link
            href="/objetivos"
            className="mt-1 inline-block text-sm text-foreground underline underline-offset-2"
          >
            Configura tu objetivo diario
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
