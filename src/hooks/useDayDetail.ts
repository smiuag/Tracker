"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/db";
import { getSessionsByFecha } from "@/lib/services/sessions.service";
import { STUDY_TYPE_LABELS } from "@/lib/constants/studyTypes";
import type { FechaISO } from "@/types/common";

export function useDayDetail(fecha: FechaISO | null) {
  return useLiveQuery(async () => {
    if (!fecha) return null;
    const [sessions, topics] = await Promise.all([getSessionsByFecha(fecha), db.topics.toArray()]);
    const topicById = new Map(topics.map((t) => [t.id, t.nombre]));
    const enrichedSessions = sessions.map((s) => ({
      ...s,
      topicNombre: s.topicId ? (topicById.get(s.topicId) ?? "Tema eliminado") : null,
      tipoLabel: STUDY_TYPE_LABELS[s.tipo],
    }));
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duracionMin, 0);
    return { sessions: enrichedSessions, totalMinutes };
  }, [fecha]);
}
