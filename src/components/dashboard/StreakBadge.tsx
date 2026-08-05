import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { dayCellClass } from "@/lib/utils/colors";
import type { StreakDay } from "@/lib/services/stats.service";

interface StreakBadgeProps {
  streak: number;
  streakDays: StreakDay[];
  consecutiveActiveWeeks: number;
}

export function StreakBadge({ streak, streakDays, consecutiveActiveWeeks }: StreakBadgeProps) {
  return (
    <Card className="gap-2 py-4">
      <CardContent className="flex flex-col gap-3 px-4">
        {consecutiveActiveWeeks > 0 && (
          <p className="text-xs font-medium text-muted-foreground">
            Llevas {consecutiveActiveWeeks} {consecutiveActiveWeeks === 1 ? "semana" : "semanas"} estudiando
          </p>
        )}
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent">
            <Flame className="size-4 text-foreground" />
          </span>
          <div>
            <p className="text-lg font-semibold leading-none text-foreground">
              {streak} {streak === 1 ? "día" : "días"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Racha activa</p>
          </div>
        </div>
        {streakDays.length > 0 && (
          <div className="flex gap-1">
            {streakDays.map((day) => (
              <span
                key={day.fecha}
                title={day.fecha}
                className={cn("h-2.5 flex-1 rounded-full", dayCellClass(day.minutos, day.goalMinutes))}
              />
            ))}
          </div>
        )}
        {streak > 0 && (
          <p className="text-xs text-muted-foreground">
            Estudia, repasa o lee 30 minutos para no perder tu racha
          </p>
        )}
      </CardContent>
    </Card>
  );
}
