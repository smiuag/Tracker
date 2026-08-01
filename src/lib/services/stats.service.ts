import { db } from "@/lib/db/db";
import { addDays, isoWeekDates, startOfIsoWeek } from "@/lib/utils/date";
import { computeGoalProgress } from "@/lib/services/goals.service";
import { STUDY_TYPE_LABELS } from "@/lib/constants/studyTypes";
import type { Block, Topic } from "@/types/topic";
import type { Review } from "@/types/review";
import type { FechaISO, TipoEstudio } from "@/types/common";

export async function getWeeklyMinutes(referenceDate: FechaISO): Promise<number> {
  const dates = isoWeekDates(referenceDate);
  const aggregates = await db.dailyAggregates.where("fecha").anyOf(dates).toArray();
  return aggregates.reduce((sum, a) => sum + a.minutosTotales, 0);
}

export async function getStreak(referenceDate: FechaISO): Promise<number> {
  let streak = 0;
  let cursor = referenceDate;
  // Acotado a la racha activa: se detiene en el primer día sin minutos.
  while (true) {
    const aggregate = await db.dailyAggregates.get(cursor);
    if (!aggregate || aggregate.minutosTotales <= 0) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export async function getTopicsCompletedCount(): Promise<number> {
  return db.topics.where("estado").equals("completado").count();
}

export async function getTestsCount(): Promise<number> {
  return db.testResults.count();
}

export interface NextReview extends Review {
  topicNombre: string;
}

export async function getNextReview(): Promise<NextReview | null> {
  const pending = await db.reviews.where("estado").equals("pendiente").sortBy("fechaProgramada");
  const next = pending[0];
  if (!next) return null;
  const topic = await db.topics.get(next.topicId);
  return { ...next, topicNombre: topic?.nombre ?? "Tema eliminado" };
}

export interface BlockMinutes {
  block: Block;
  minutos: number;
}

export async function getMinutesByBlock(): Promise<BlockMinutes[]> {
  const [blocks, topics, sessions] = await Promise.all([
    db.blocks.toArray(),
    db.topics.toArray(),
    db.studySessions.toArray(),
  ]);
  const topicToBlock = new Map(topics.map((t) => [t.id, t.blockId]));
  const minutesByBlock = new Map<string, number>();
  for (const session of sessions) {
    if (!session.topicId) continue;
    const blockId = topicToBlock.get(session.topicId);
    if (!blockId) continue;
    minutesByBlock.set(blockId, (minutesByBlock.get(blockId) ?? 0) + session.duracionMin);
  }
  return [...blocks]
    .sort((a, b) => a.orden - b.orden)
    .map((block) => ({ block, minutos: minutesByBlock.get(block.id) ?? 0 }));
}

export interface ContributionDay {
  fecha: FechaISO;
  minutos: number;
}

export async function getContributionCalendar(
  weeks: number,
  referenceDate: FechaISO
): Promise<ContributionDay[]> {
  const days = weeks * 7;
  // Alineado al lunes de la semana ISO para que el grid quede en columnas
  // completas (una semana por columna), como en un calendario de GitHub.
  const start = startOfIsoWeek(addDays(referenceDate, -(weeks - 1) * 7));
  const aggregates = await db.dailyAggregates.where("fecha").aboveOrEqual(start).toArray();
  const minutesByDate = new Map(aggregates.map((a) => [a.fecha, a.minutosTotales]));
  return Array.from({ length: days }, (_, i) => {
    const fecha = addDays(start, i);
    return { fecha, minutos: minutesByDate.get(fecha) ?? 0 };
  });
}

export interface TopicMinutes {
  topic: Topic;
  minutos: number;
}

export async function getMinutesByTopic(limit = 8): Promise<TopicMinutes[]> {
  const topics = await db.topics.toArray();
  return topics
    .filter((t) => t.tiempoInvertidoMin > 0)
    .sort((a, b) => b.tiempoInvertidoMin - a.tiempoInvertidoMin)
    .slice(0, limit)
    .map((topic) => ({ topic, minutos: topic.tiempoInvertidoMin }));
}

export interface TypeMinutes {
  tipo: TipoEstudio;
  label: string;
  minutos: number;
}

export async function getMinutesByType(): Promise<TypeMinutes[]> {
  const sessions = await db.studySessions.toArray();
  const minutesByType = new Map<TipoEstudio, number>();
  for (const session of sessions) {
    minutesByType.set(session.tipo, (minutesByType.get(session.tipo) ?? 0) + session.duracionMin);
  }
  return Array.from(minutesByType.entries())
    .filter(([, minutos]) => minutos > 0)
    .map(([tipo, minutos]) => ({ tipo, label: STUDY_TYPE_LABELS[tipo], minutos }))
    .sort((a, b) => b.minutos - a.minutos);
}

export interface TestAccuracy {
  aciertos: number;
  errores: number;
  totalPreguntas: number;
  porcentaje: number;
}

export async function getTestAccuracy(): Promise<TestAccuracy> {
  const tests = await db.testResults.toArray();
  const aciertos = tests.reduce((sum, t) => sum + t.aciertos, 0);
  const errores = tests.reduce((sum, t) => sum + t.errores, 0);
  const totalPreguntas = aciertos + errores;
  return {
    aciertos,
    errores,
    totalPreguntas,
    porcentaje: totalPreguntas > 0 ? Math.round((aciertos / totalPreguntas) * 100) : 0,
  };
}

async function getWeeklyTotals(): Promise<Map<FechaISO, number>> {
  const aggregates = await db.dailyAggregates.toArray();
  const totalsByWeekStart = new Map<FechaISO, number>();
  for (const aggregate of aggregates) {
    const weekStart = startOfIsoWeek(aggregate.fecha);
    totalsByWeekStart.set(
      weekStart,
      (totalsByWeekStart.get(weekStart) ?? 0) + aggregate.minutosTotales
    );
  }
  return totalsByWeekStart;
}

export interface WeekMinutes {
  weekStart: FechaISO;
  minutos: number;
}

export async function getBestWeek(): Promise<WeekMinutes | null> {
  const totals = await getWeeklyTotals();
  let best: WeekMinutes | null = null;
  for (const [weekStart, minutos] of totals) {
    if (!best || minutos > best.minutos) best = { weekStart, minutos };
  }
  return best;
}

/** Media semanal de minutos, contando solo semanas con alguna sesión registrada. */
export async function getAverageWeeklyMinutes(): Promise<number> {
  const totals = await getWeeklyTotals();
  if (totals.size === 0) return 0;
  const sum = [...totals.values()].reduce((a, b) => a + b, 0);
  return sum / totals.size;
}

export async function getWeeklyEvolution(weeksBack: number, referenceDate: FechaISO): Promise<WeekMinutes[]> {
  const totals = await getWeeklyTotals();
  const currentWeekStart = startOfIsoWeek(referenceDate);
  return Array.from({ length: weeksBack }, (_, i) => {
    const weekStart = addDays(currentWeekStart, -(weeksBack - 1 - i) * 7);
    return { weekStart, minutos: totals.get(weekStart) ?? 0 };
  });
}

/** % de objetivos ya finalizados (fechaFin pasada) que se cumplieron (>=100%). */
export async function getGoalsCompliance(referenceDate: FechaISO): Promise<number> {
  // "fechaFin" no está indexado (solo "tipo"/"fechaInicio"): se filtra en memoria.
  const goals = (await db.goals.toArray()).filter((g) => g.fechaFin < referenceDate);
  if (goals.length === 0) return 0;
  const results = await Promise.all(
    goals.map(async (g) => (await computeGoalProgress(g)) >= g.valorObjetivo)
  );
  return Math.round((results.filter(Boolean).length / goals.length) * 100);
}
