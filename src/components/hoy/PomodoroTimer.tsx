import { Minus, Plus, TimerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PomodoroTimerProps {
  count: number;
  onChange: (count: number) => void;
}

export function PomodoroTimer({ count, onChange }: PomodoroTimerProps) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">Pomodoros</p>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 rounded-full"
          onClick={() => onChange(Math.max(0, count - 1))}
          disabled={count === 0}
        >
          <Minus className="size-4" />
        </Button>
        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <TimerIcon className="size-4 text-muted-foreground" />
          {count}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 rounded-full"
          onClick={() => onChange(count + 1)}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}
