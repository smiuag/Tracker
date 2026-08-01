import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <Card className="gap-2 py-4">
      <CardContent className="flex items-center gap-3 px-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent">
          <Flame className="size-4 text-foreground" />
        </span>
        <div>
          <p className="text-lg font-semibold leading-none text-foreground">
            {streak} {streak === 1 ? "día" : "días"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Racha activa</p>
        </div>
      </CardContent>
    </Card>
  );
}
