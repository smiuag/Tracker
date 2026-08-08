import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { minutesToHoursLabel } from "@/lib/utils/date";
import { GOAL_EXCEEDED_TEXT } from "@/lib/utils/colors";
import { cn } from "@/lib/utils";

interface TodayGoalCardProps {
  totalMinutes: number;
  goalHours: number | null;
}

export function TodayGoalCard({ totalMinutes, goalHours }: TodayGoalCardProps) {
  const goalMinutes = goalHours ? goalHours * 60 : null;
  const percentage = goalMinutes ? Math.round((totalMinutes / goalMinutes) * 100) : 0;
  const exceeded = goalMinutes !== null && totalMinutes > goalMinutes;

  return (
    <Card>
      <CardContent>
        <p className="text-sm text-muted-foreground">Objetivo del día</p>
        {/* La estrella se alinea con el final de la barra: ambos comparten el
            mismo contenedor con el mismo ancho máximo. */}
        <div className="w-full max-w-xs">
          <div className="flex items-center justify-between gap-2">
            <p className="text-2xl font-semibold text-foreground">
              {minutesToHoursLabel(totalMinutes)}
              {goalHours && (
                <span className="ml-1 text-base font-normal text-muted-foreground">
                  / {goalHours} h
                </span>
              )}
            </p>
            {exceeded && (
              <Star
                className={cn("size-5 shrink-0", GOAL_EXCEEDED_TEXT)}
                fill="currentColor"
                aria-label="Objetivo superado"
              />
            )}
          </div>
        </div>
        {goalHours ? (
          <Progress value={Math.min(100, percentage)} className="mt-2 w-full max-w-xs" />
        ) : (
          <Link
            href="/configuracion"
            className="mt-1 inline-block text-sm text-foreground underline underline-offset-2"
          >
            Configura tu objetivo diario
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
