import { SectionCard } from "@/components/shared/SectionCard";
import { Progress } from "@/components/ui/progress";
import type { Topic } from "@/types/topic";

interface TodayTopicsListProps {
  topics: Topic[] | undefined;
}

export function TodayTopicsList({ topics }: TodayTopicsListProps) {
  const pending = (topics ?? []).filter((t) => t.estado !== "completado");

  return (
    <SectionCard title="Temas pendientes">
      {pending.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {topics === undefined ? "Cargando…" : "No tienes temas pendientes. Añádelos en Temario."}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {pending.slice(0, 5).map((topic) => (
            <li key={topic.id}>
              <p className="truncate text-sm font-medium text-foreground">{topic.nombre}</p>
              <Progress value={topic.porcentaje} className="mt-1.5" />
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
