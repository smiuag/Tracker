import { BookOpen } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { minutesToHoursLabel } from "@/lib/utils/date";
import type { TypeMinutes } from "@/lib/services/stats.service";
import type { Topic } from "@/types/topic";

interface CurrentTopicCardProps {
  topic: Topic | null;
  minutesByType: TypeMinutes[];
}

export function CurrentTopicCard({ topic, minutesByType }: CurrentTopicCardProps) {
  if (!topic) {
    return (
      <SectionCard title="Tema en curso">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary">
            <BookOpen className="size-4 text-foreground" />
          </span>
          <p className="text-sm text-muted-foreground">
            Todavía no has registrado ninguna sesión con tema.
          </p>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Tema en curso">
      <p className="text-sm font-medium text-foreground">{topic.nombre}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {minutesToHoursLabel(topic.tiempoInvertidoMin)} en total
      </p>
      {minutesByType.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1.5">
          {minutesByType.map((item) => (
            <li key={item.tipo} className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{item.label}</span>
              <span>{minutesToHoursLabel(item.minutos)}</span>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
