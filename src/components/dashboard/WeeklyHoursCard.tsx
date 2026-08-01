import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProgressDonut } from "./ProgressDonut";
import { minutesToHoursLabel } from "@/lib/utils/date";

interface WeeklyHoursCardProps {
  weeklyMinutes: number;
  goalHours: number | null;
}

export function WeeklyHoursCard({ weeklyMinutes, goalHours }: WeeklyHoursCardProps) {
  const goalMinutes = goalHours ? goalHours * 60 : null;
  const percentage = goalMinutes ? Math.round((weeklyMinutes / goalMinutes) * 100) : 0;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Esta semana</p>
          <p className="text-3xl font-semibold text-foreground">
            {minutesToHoursLabel(weeklyMinutes)}
          </p>
          {goalHours ? (
            <>
              <p className="mt-1 text-sm text-muted-foreground">
                Objetivo: {goalHours} h — {percentage}%
              </p>
              <Progress value={Math.min(100, percentage)} className="mt-2 w-48" />
            </>
          ) : (
            <Link
              href="/objetivos"
              className="mt-1 inline-block text-sm text-foreground underline underline-offset-2"
            >
              Configura tu objetivo semanal
            </Link>
          )}
        </div>
        {goalHours && (
          <ProgressDonut
            percentage={percentage}
            centerLabel={`${percentage}%`}
            centerSublabel="semana"
          />
        )}
      </CardContent>
    </Card>
  );
}
