import { RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TOPIC_STATE_LABELS } from "@/lib/constants/topicStates";
import { addDays, minutesToHoursLabel, toFechaISO } from "@/lib/utils/date";
import type { Block, Topic } from "@/types/topic";
import type { FechaISO } from "@/types/common";

interface TopicCardProps {
  topic: Topic;
  block: Block | undefined;
  nextReview: FechaISO | undefined;
  onClick: () => void;
}

function describeReview(fecha: FechaISO): string {
  const today = toFechaISO(new Date());
  if (fecha <= today) return fecha === today ? "Repaso hoy" : "Repaso atrasado";
  if (fecha === addDays(today, 1)) return "Repaso mañana";
  return `Repaso el ${fecha}`;
}

export function TopicCard({ topic, block, nextReview, onClick }: TopicCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="cursor-pointer gap-3 py-4 transition-colors hover:bg-secondary/40"
    >
      <CardContent className="flex flex-col gap-2 px-4">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
            {topic.nombre}
          </p>
          <Badge variant="secondary" className="shrink-0">
            {TOPIC_STATE_LABELS[topic.estado]}
          </Badge>
        </div>

        {block && (
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: block.color }}
              aria-hidden
            />
            <span className="truncate">{block.nombre}</span>
          </span>
        )}

        <Progress value={topic.porcentaje} />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{minutesToHoursLabel(topic.tiempoInvertidoMin)}</span>
          {nextReview && (
            <span className="flex items-center gap-1">
              <RotateCcw className="size-3" />
              {describeReview(nextReview)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
