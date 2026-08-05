"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/db";
import { getDailyLog, getSessionsByFecha } from "@/lib/services/sessions.service";
import { STUDY_TYPE_LABELS } from "@/lib/constants/studyTypes";
import type { FechaISO } from "@/types/common";

export function useDayDetail(fecha: FechaISO | null) {
  return useLiveQuery(async () => {
    if (!fecha) return null;
    const [sessions, topics, blocks, dailyLog] = await Promise.all([
      getSessionsByFecha(fecha),
      db.topics.toArray(),
      db.blocks.toArray(),
      getDailyLog(fecha),
    ]);
    const topicById = new Map(topics.map((t) => [t.id, t]));
    const blockById = new Map(blocks.map((b) => [b.id, b]));
    const enrichedSessions = sessions.map((s) => {
      const topic = s.topicId ? topicById.get(s.topicId) : undefined;
      const block = topic ? blockById.get(topic.blockId) : undefined;
      return {
        ...s,
        topicNombre: s.topicId ? (topic?.nombre ?? "Tema eliminado") : null,
        blockNombre: block?.nombre ?? null,
        blockColor: block?.color ?? null,
        tipoLabel: STUDY_TYPE_LABELS[s.tipo],
      };
    });
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duracionMin, 0);
    return { sessions: enrichedSessions, totalMinutes, dailyLog };
  }, [fecha]);
}
