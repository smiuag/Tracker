import { SectionCard } from "@/components/shared/SectionCard";
import { EditSessionSheet } from "./EditSessionSheet";
import { STUDY_TYPE_LABELS } from "@/lib/constants/studyTypes";
import { minutesToHoursLabel } from "@/lib/utils/date";
import type { StudySession } from "@/types/session";
import type { Block, Topic } from "@/types/topic";

interface TodaySessionsListProps {
  sessions: StudySession[];
  topics: Topic[] | undefined;
  blocks: Block[] | undefined;
}

export function TodaySessionsList({ sessions, topics, blocks }: TodaySessionsListProps) {
  const topicById = new Map((topics ?? []).map((t) => [t.id, t]));
  const blockById = new Map((blocks ?? []).map((b) => [b.id, b]));

  return (
    <SectionCard title="Sesiones de hoy">
      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aún no has registrado ninguna sesión hoy.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {sessions.map((session) => {
            const topic = session.topicId ? topicById.get(session.topicId) : undefined;
            const block = topic ? blockById.get(topic.blockId) : undefined;
            return (
            <li key={session.id} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {session.topicId ? topic?.nombre ?? "Tema eliminado" : "Sin tema"}
                </p>
                <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                  {block && (
                    <>
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: block.color }}
                        aria-hidden
                      />
                      <span className="shrink-0">{block.nombre} ·</span>
                    </>
                  )}
                  <span className="truncate">
                    {STUDY_TYPE_LABELS[session.tipo]}
                    {session.observaciones && ` · ${session.observaciones}`}
                  </span>
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
                {minutesToHoursLabel(session.duracionMin)}
                <EditSessionSheet session={session} topics={topics} blocks={blocks} />
              </span>
            </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}
