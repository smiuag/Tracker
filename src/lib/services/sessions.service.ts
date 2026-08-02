import { db } from "@/lib/db/db";
import { createId } from "@/lib/utils/id";
import { evaluateHourMilestones } from "./badges.service";
import type { DailyLog, StudySession } from "@/types/session";

export type NewStudySession = Omit<StudySession, "id">;

/**
 * Crea una sesión de estudio y mantiene, en la misma transacción, los
 * agregados cacheados que dependen de ella: dailyAggregates del día y
 * (si la sesión tiene tema) Topic.tiempoInvertidoMin / ultimoEstudio.
 */
export async function createSession(input: NewStudySession): Promise<StudySession> {
  const session: StudySession = { ...input, id: createId() };

  await db.transaction("rw", db.studySessions, db.dailyAggregates, db.topics, async () => {
    await db.studySessions.add(session);

    const existingAggregate = await db.dailyAggregates.get(session.fecha);
    await db.dailyAggregates.put({
      fecha: session.fecha,
      minutosTotales: (existingAggregate?.minutosTotales ?? 0) + session.duracionMin,
      sesiones: (existingAggregate?.sesiones ?? 0) + 1,
    });

    if (session.topicId) {
      const topic = await db.topics.get(session.topicId);
      if (topic) {
        await db.topics.put({
          ...topic,
          tiempoInvertidoMin: topic.tiempoInvertidoMin + session.duracionMin,
          ultimoEstudio:
            !topic.ultimoEstudio || session.fecha > topic.ultimoEstudio
              ? session.fecha
              : topic.ultimoEstudio,
          updatedAt: new Date().toISOString(),
        });
      }
    }
  });

  await evaluateHourMilestones(session.fecha);

  return session;
}

export async function getSessionsByFecha(fecha: string): Promise<StudySession[]> {
  return db.studySessions.where("fecha").equals(fecha).reverse().sortBy("inicio");
}

export async function upsertDailyLog(log: DailyLog): Promise<void> {
  await db.dailyLogs.put(log);
}

export async function getDailyLog(fecha: string): Promise<DailyLog | undefined> {
  return db.dailyLogs.get(fecha);
}
