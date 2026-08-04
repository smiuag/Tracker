import type { MouseEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { TOPIC_STATES, TOPIC_STATE_LABELS, TOPIC_STATE_BADGE_CLASSES } from "@/lib/constants/topicStates";
import { updateTopic } from "@/lib/services/topics.service";
import { minutesToHoursLabel } from "@/lib/utils/date";
import type { Block, Topic } from "@/types/topic";
import type { EstadoTema } from "@/types/common";

interface TopicCardProps {
  topic: Topic;
  block: Block | undefined;
  onClick: () => void;
}

export function TopicCard({ topic, block, onClick }: TopicCardProps) {
  function handleEstadoClick(e: MouseEvent, estado: EstadoTema) {
    e.stopPropagation();
    if (estado === topic.estado) return;
    void updateTopic(topic.id, { estado });
  }

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
          <Badge className={cn("shrink-0 border-transparent", TOPIC_STATE_BADGE_CLASSES[topic.estado])}>
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
        </div>

        <div className="flex gap-1.5">
          {TOPIC_STATES.map((estado) => (
            <button
              key={estado}
              type="button"
              onClick={(e) => handleEstadoClick(e, estado)}
              className={cn(
                "flex-1 rounded-full border px-2 py-1 text-[11px] font-medium transition-colors",
                topic.estado === estado
                  ? cn("border-transparent", TOPIC_STATE_BADGE_CLASSES[estado])
                  : "border-border text-muted-foreground hover:bg-secondary/60"
              )}
            >
              {TOPIC_STATE_LABELS[estado]}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
