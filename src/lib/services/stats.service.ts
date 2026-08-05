import { db } from "@/lib/db/db";
import { addDays, isoWeekDates, startOfIsoWeek } from "@/lib/utils/date";
import { applicableWeekdays, getGoalConfig, isApplicableDay } from "@/lib/services/settings.service";
import { STUDY_TYPE_LABELS } from "@/lib/constants/studyTypes";
import type { Block, Topic } from "@/types/topic";
import type { FechaISO, TipoEstudio } from "@/types/common";

export async function getWeeklyMinutes(referenceDate: FechaISO): Promise<number> {
  const dates = isoWeekDates(referenceDate);
  const aggregates = await db.dailyAggregates.where("fecha").anyOf(dates).toArray();
  return aggregates.reduce((sum, a) => sum + a.minutosTotales, 0);
}

export async function getTotalMinutes(): Promise<number> {
  const sessions = await db.studySessions.toArray();
  return sessions.reduce((sum, s) => sum + s.duracionMin, 0);
}

export async function getMonthMinutes(referenceDate: FechaISO): Promise<number> {
  const [year, month] = referenceDate.split("-");
  const prefix = `${year}-${month}`;
  const aggregates = await db.dailyAggregates.where("fecha").startsWith(prefix).toArray();
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

export interface StreakDay {
  fecha: FechaISO;
  minutos: number;
  goalMet: boolean;
}

/** Días de la racha activa (orden cronológico), clasificados por si ese día se cumplió el objetivo. */
export async function getStreakDetail(referenceDate: FechaISO): Promise<StreakDay[]> {
  const config = await getGoalConfig();
  const days: StreakDay[] = [];
  let cursor = referenceDate;
  while (true) {
    const aggregate = await db.dailyAggregates.get(cursor);
    const minutos = aggregate?.minutosTotales ?? 0;
    if (minutos <= 0) break;
    const goalHoras = config.hoursPerDay && isApplicableDay(config, cursor) ? config.hoursPerDay : 0;
    const goalMet = goalHoras > 0 && minutos >= goalHoras * 60;
    days.push({ fecha: cursor, minutos, goalMet });
    cursor = addDays(cursor, -1);
  }
  return days.reverse();
}

/** Semanas consecutivas (contando desde la actual hacia atrás) con al menos 1 día de actividad. */
export async function getConsecutiveActiveWeeks(referenceDate: FechaISO): Promise<number> {
  const totals = await getWeeklyTotals();
  let weeks = 0;
  let cursor = startOfIsoWeek(referenceDate);
  while ((totals.get(cursor) ?? 0) > 0) {
    weeks += 1;
    cursor = addDays(cursor, -7);
  }
  return weeks;
}

export async function getTopicsCompletedCount(): Promise<number> {
  return db.topics.where("estado").equals("acabado").count();
}

export async function getTopicsPendingCount(): Promise<number> {
  return db.topics.where("estado").equals("pendiente").count();
}

export interface TopicProgressBreakdown {
  pendientes: number;
  enCurso: number;
  completados: number;
  total: number;
}

/** 3 segmentos: pendiente / en progreso / acabado. */
export async function getTopicProgressBreakdown(): Promise<TopicProgressBreakdown> {
  const topics = await db.topics.toArray();
  let pendientes = 0;
  let enCurso = 0;
  let completados = 0;
  for (const topic of topics) {
    if (topic.estado === "pendiente") pendientes += 1;
    else if (topic.estado === "acabado") completados += 1;
    else enCurso += 1;
  }
  return { pendientes, enCurso, completados, total: topics.length };
}

/** El tema no acabado estudiado más recientemente (por `ultimoEstudio`). */
export async function getCurrentTopic(): Promise<Topic | null> {
  const topics = (await db.topics.where("estado").notEqual("acabado").toArray()).filter(
    (t) => t.ultimoEstudio
  );
  if (topics.length === 0) return null;
  topics.sort((a, b) => (b.ultimoEstudio! > a.ultimoEstudio! ? 1 : a.ultimoEstudio! < b.ultimoEstudio! ? -1 : 0));
  return topics[0];
}

export async function getMinutesByTypeForTopic(topicId: string): Promise<TypeMinutes[]> {
  const sessions = await db.studySessions.where("topicId").equals(topicId).toArray();
  const minutesByType = new Map<TipoEstudio, number>();
  for (const session of sessions) {
    minutesByType.set(session.tipo, (minutesByType.get(session.tipo) ?? 0) + session.duracionMin);
  }
  return Array.from(minutesByType.entries())
    .filter(([, minutos]) => minutos > 0)
    .map(([tipo, minutos]) => ({ tipo, label: STUDY_TYPE_LABELS[tipo], minutos }))
    .sort((a, b) => b.minutos - a.minutos);
}

/** Desglose de minutos por tipo de estudio, con todas las claves presentes. */
export type MinutesPerTipo = Record<TipoEstudio, number>;

function emptyPerTipo(): MinutesPerTipo {
  return { lectura: 0, estudio: 0, test: 0, otros: 0 };
}

export interface BlockMinutes {
  block: Block;
  minutos: number;
  porTipo: MinutesPerTipo;
}

export async function getMinutesByBlock(): Promise<BlockMinutes[]> {
  const [blocks, topics, sessions] = await Promise.all([
    db.blocks.toArray(),
    db.topics.toArray(),
    db.studySessions.toArray(),
  ]);
  const topicToBlock = new Map(topics.map((t) => [t.id, t.blockId]));
  const perBlock = new Map<string, MinutesPerTipo>();
  for (const session of sessions) {
    if (!session.topicId) continue;
    const blockId = topicToBlock.get(session.topicId);
    if (!blockId) continue;
    const acc = perBlock.get(blockId) ?? emptyPerTipo();
    acc[session.tipo] += session.duracionMin;
    perBlock.set(blockId, acc);
  }
  return [...blocks]
    .sort((a, b) => a.orden - b.orden)
    .map((block) => {
      const porTipo = perBlock.get(block.id) ?? emptyPerTipo();
      const minutos = porTipo.lectura + porTipo.estudio + porTipo.test + porTipo.otros;
      return { block, minutos, porTipo };
    });
}

export interface MonthDayOverview {
  fecha: FechaISO;
  minutos: number;
  /** Minutos objetivo ese día (0 si el día no está previsto para estudiar). */
  goalMinutes: number;
  topics: { nombre: string; color: string }[];
}

/** Resumen día a día de un mes completo: minutos estudiados y temas tocados ese día. */
export async function getMonthOverview(referenceDate: FechaISO): Promise<MonthDayOverview[]> {
  const [year, month] = referenceDate.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthPrefix = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}`;

  const [aggregates, sessions, topics, blocks, config] = await Promise.all([
    db.dailyAggregates.where("fecha").startsWith(monthPrefix).toArray(),
    db.studySessions.where("fecha").startsWith(monthPrefix).toArray(),
    db.topics.toArray(),
    db.blocks.toArray(),
    getGoalConfig(),
  ]);
  const minutesByDate = new Map(aggregates.map((a) => [a.fecha, a.minutosTotales]));
  const topicById = new Map(topics.map((t) => [t.id, t]));
  const blockById = new Map(blocks.map((b) => [b.id, b]));

  const topicsByDate = new Map<FechaISO, Map<string, string>>();
  for (const session of sessions) {
    if (!session.topicId) continue;
    const topic = topicById.get(session.topicId);
    if (!topic) continue;
    const block = blockById.get(topic.blockId);
    const dayMap = topicsByDate.get(session.fecha) ?? new Map<string, string>();
    dayMap.set(topic.nombre, block?.color ?? "#CAD7C5");
    topicsByDate.set(session.fecha, dayMap);
  }

  return Array.from({ length: daysInMonth }, (_, i) => {
    const fecha = `${monthPrefix}-${String(i + 1).padStart(2, "0")}`;
    const dayTopics = topicsByDate.get(fecha);
    const goalMinutes =
      config.hoursPerDay && isApplicableDay(config, fecha) ? config.hoursPerDay * 60 : 0;
    return {
      fecha,
      minutos: minutesByDate.get(fecha) ?? 0,
      goalMinutes,
      topics: dayTopics ? Array.from(dayTopics, ([nombre, color]) => ({ nombre, color })) : [],
    };
  });
}

export interface TopicMinutes {
  topic: Topic;
  minutos: number;
  porTipo: MinutesPerTipo;
}

/** Basado en sesiones (no en `tiempoInvertidoMin`) para poder desglosar por
 *  tipo de estudio con los mismos datos que el resto de gráficas. */
export async function getMinutesByTopic(limit = 8): Promise<TopicMinutes[]> {
  const [topics, sessions] = await Promise.all([db.topics.toArray(), db.studySessions.toArray()]);
  const perTopic = new Map<string, MinutesPerTipo>();
  for (const session of sessions) {
    if (!session.topicId) continue;
    const acc = perTopic.get(session.topicId) ?? emptyPerTipo();
    acc[session.tipo] += session.duracionMin;
    perTopic.set(session.topicId, acc);
  }
  return topics
    .map((topic) => {
      const porTipo = perTopic.get(topic.id) ?? emptyPerTipo();
      const minutos = porTipo.lectura + porTipo.estudio + porTipo.test + porTipo.otros;
      return { topic, minutos, porTipo };
    })
    .filter((t) => t.minutos > 0)
    .sort((a, b) => b.minutos - a.minutos)
    .slice(0, limit);
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

export interface WeeklyReport {
  weekStart: FechaISO;
  totalMinutes: number;
  studyDays: number;
  restDays: number;
  topicNames: string[];
}

/** Resumen de una semana ISO completa (lunes a domingo), para el informe emergente. */
export async function getWeeklyReport(weekStart: FechaISO): Promise<WeeklyReport> {
  const dates = isoWeekDates(weekStart);
  const [aggregates, sessions, topics] = await Promise.all([
    db.dailyAggregates.where("fecha").anyOf(dates).toArray(),
    db.studySessions.where("fecha").anyOf(dates).toArray(),
    db.topics.toArray(),
  ]);

  const totalMinutes = aggregates.reduce((sum, a) => sum + a.minutosTotales, 0);
  const studyDays = aggregates.filter((a) => a.minutosTotales > 0).length;
  const restDays = dates.length - studyDays;

  const topicById = new Map(topics.map((t) => [t.id, t.nombre]));
  const topicNames = Array.from(
    new Set(
      sessions
        .filter((s) => s.topicId)
        .map((s) => topicById.get(s.topicId as string))
        .filter((nombre): nombre is string => !!nombre)
    )
  );

  return { weekStart, totalMinutes, studyDays, restDays, topicNames };
}

/** % de semanas ya cerradas (anteriores a la actual) en las que se cumplió el objetivo semanal configurado. */
export async function getGoalsCompliance(referenceDate: FechaISO): Promise<number> {
  const config = await getGoalConfig();
  if (!config.hoursPerDay) return 0;
  const weeklyTargetMinutes = config.hoursPerDay * applicableWeekdays(config).length * 60;
  if (weeklyTargetMinutes <= 0) return 0;

  const totals = await getWeeklyTotals();
  const currentWeekStart = startOfIsoWeek(referenceDate);
  const pastWeeks = [...totals.entries()].filter(([weekStart]) => weekStart < currentWeekStart);
  if (pastWeeks.length === 0) return 0;

  const met = pastWeeks.filter(([, minutos]) => minutos >= weeklyTargetMinutes).length;
  return Math.round((met / pastWeeks.length) * 100);
}
