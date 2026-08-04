import { SectionCard } from "@/components/shared/SectionCard";
import { EditSessionSheet } from "./EditSessionSheet";
import { STUDY_TYPE_LABELS } from "@/lib/constants/studyTypes";
import { minutesToHoursLabel } from "@/lib/utils/date";
import type { StudySession } from "@/types/session";
import type { Topic } from "@/types/topic";

interface TodaySessionsListProps {
  sessions: StudySession[];
  topics: Topic[] | undefined;
}

export function TodaySessionsList({ sessions, topics }: TodaySessionsListProps) {
  const topicById = new Map((topics ?? []).map((t) => [t.id, t.nombre]));

  return (
    <SectionCard title="Sesiones de hoy">
      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aún no has registrado ninguna sesión hoy.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {sessions.map((session) => (
            <li key={session.id} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {session.topicId ? topicById.get(session.topicId) ?? "Tema eliminado" : "Sin tema"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {STUDY_TYPE_LABELS[session.tipo]}
                  {session.observaciones && ` · ${session.observaciones}`}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
                {minutesToHoursLabel(session.duracionMin)}
                <EditSessionSheet session={session} topics={topics} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
