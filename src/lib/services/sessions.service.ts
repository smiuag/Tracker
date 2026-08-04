import { db } from "@/lib/db/db";
import { createId } from "@/lib/utils/id";
import { evaluateHourMilestones } from "./badges.service";
import type { DailyLog, StudySession } from "@/types/session";

export type NewStudySession = Omit<StudySession, "id">;
export type SessionUpdate = Partial<
  Pick<StudySession, "topicId" | "tipo" | "duracionMin" | "observaciones">
>;

/** Añade los efectos de una sesión a los agregados cacheados (dailyAggregates + topic). */
async function applySessionEffects(session: StudySession): Promise<void> {
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
}

/**
 * Deshace los efectos cacheados de una sesión (antes de editarla o borrarla).
 * `tiempoInvertidoMin`/`ultimoEstudio` del tema se recalculan desde el resto
 * de sus sesiones en vez de restar de forma incremental, para no arrastrar
 * desajustes si esta función se llama más de una vez sobre los mismos datos.
 */
async function revertSessionEffects(session: StudySession): Promise<void> {
  const aggregate = await db.dailyAggregates.get(session.fecha);
  if (aggregate) {
    const minutosTotales = Math.max(0, aggregate.minutosTotales - session.duracionMin);
    const sesiones = Math.max(0, aggregate.sesiones - 1);
    if (sesiones === 0) {
      await db.dailyAggregates.delete(session.fecha);
    } else {
      await db.dailyAggregates.put({ fecha: session.fecha, minutosTotales, sesiones });
    }
  }

  if (session.topicId) {
    const topic = await db.topics.get(session.topicId);
    if (topic) {
      const remaining = await db.studySessions
        .where("topicId")
        .equals(session.topicId)
        .and((s) => s.id !== session.id)
        .toArray();
      const tiempoInvertidoMin = remaining.reduce((sum, s) => sum + s.duracionMin, 0);
      const ultimoEstudio =
        remaining.length > 0
          ? remaining.reduce((max, s) => (s.fecha > max ? s.fecha : max), remaining[0].fecha)
          : null;
      await db.topics.put({
        ...topic,
        tiempoInvertidoMin,
        ultimoEstudio,
        updatedAt: new Date().toISOString(),
      });
    }
  }
}

/**
 * Crea una sesión de estudio y mantiene, en la misma transacción, los
 * agregados cacheados que dependen de ella: dailyAggregates del día y
 * (si la sesión tiene tema) Topic.tiempoInvertidoMin / ultimoEstudio.
 */
export async function createSession(input: NewStudySession): Promise<StudySession> {
  const session: StudySession = { ...input, id: createId() };

  await db.transaction("rw", db.studySessions, db.dailyAggregates, db.topics, async () => {
    await db.studySessions.add(session);
    await applySessionEffects(session);
  });

  await evaluateHourMilestones(session.fecha);

  return session;
}

/** Edita una sesión ya registrada, recalculando los agregados cacheados. */
export async function updateSession(id: string, patch: SessionUpdate): Promise<void> {
  await db.transaction("rw", db.studySessions, db.dailyAggregates, db.topics, async () => {
    const existing = await db.studySessions.get(id);
    if (!existing) return;

    await revertSessionEffects(existing);
    const updated: StudySession = { ...existing, ...patch };
    await db.studySessions.put(updated);
    await applySessionEffects(updated);
  });
}

/** Elimina una sesión ya registrada, revirtiendo los agregados cacheados que mantenía. */
export async function deleteSession(id: string): Promise<void> {
  await db.transaction("rw", db.studySessions, db.dailyAggregates, db.topics, async () => {
    const existing = await db.studySessions.get(id);
    if (!existing) return;

    await revertSessionEffects(existing);
    await db.studySessions.delete(id);
  });
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
