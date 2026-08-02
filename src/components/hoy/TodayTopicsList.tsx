import { SectionCard } from "@/components/shared/SectionCard";
import { Progress } from "@/components/ui/progress";
import { TOPIC_STATE_LABELS } from "@/lib/constants/topicStates";
import type { EstadoTema } from "@/types/common";
import type { Topic } from "@/types/topic";

interface TodayTopicsListProps {
  topics: Topic[] | undefined;
}

// Orden de progresión pendiente -> acabado. Los 3 estados intermedios se
// ocultan del todo si no hay ningún tema en ellos (pedido explícito del
// feedback); Pendientes y Acabados siempre se muestran.
const GROUPS: { estado: EstadoTema; alwaysShow: boolean }[] = [
  { estado: "pendiente", alwaysShow: true },
  { estado: "empezado", alwaysShow: false },
  { estado: "segunda_vuelta", alwaysShow: false },
  { estado: "tercera_vuelta", alwaysShow: false },
  { estado: "acabado", alwaysShow: true },
];

export function TodayTopicsList({ topics }: TodayTopicsListProps) {
  if (topics === undefined) {
    return (
      <SectionCard title="Temas">
        <p className="text-sm text-muted-foreground">Cargando…</p>
      </SectionCard>
    );
  }

  if (topics.length === 0) {
    return (
      <SectionCard title="Temas">
        <p className="text-sm text-muted-foreground">
          No tienes temas todavía. Añádelos en Temario.
        </p>
      </SectionCard>
    );
  }

  const byEstado = new Map<EstadoTema, Topic[]>();
  for (const topic of topics) {
    const list = byEstado.get(topic.estado) ?? [];
    list.push(topic);
    byEstado.set(topic.estado, list);
  }

  return (
    <SectionCard title="Temas">
      <div className="flex flex-col gap-4">
        {GROUPS.map(({ estado, alwaysShow }) => {
          const group = byEstado.get(estado) ?? [];
          if (group.length === 0 && !alwaysShow) return null;
          return (
            <div key={estado}>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {TOPIC_STATE_LABELS[estado]}
              </p>
              {group.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin temas en este estado.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {group.map((topic) => (
                    <li key={topic.id}>
                      <p className="truncate text-sm font-medium text-foreground">{topic.nombre}</p>
                      <Progress value={topic.porcentaje} className="mt-1.5" />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
