import { db } from "@/lib/db/db";
import { addDays, isoWeekDates, startOfIsoWeek } from "@/lib/utils/date";
import { dailyGoalHoursAt, getGoalRulesHistory, rulesAt } from "@/lib/services/settings.service";
import type { Topic } from "@/types/topic";
import type { FechaISO } from "@/types/common";

export * from "@/lib/services/minutes.service";

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
  return (await getStreakDetail(referenceDate)).length;
}

export interface StreakDay {
  fecha: FechaISO;
  minutos: number;
  /** Minutos objetivo ese día (0 solo cuando no hay ninguna franja configurada). */
  goalMinutes: number;
}

/**
 * Días de la racha activa (orden cronológico). Reglas:
 * - Solo cuentan los días con objetivo de estudio configurado; los días de
 *   descanso se saltan sin romper la racha.
 * - Sin ninguna franja configurada, cuenta cualquier día con estudio.
 * - El día en curso solo suma, nunca resta: con hoy aún a cero la racha sigue
 *   viva, y solo muere cuando un día evaluable ya cerrado quedó sin estudiar.
 */
export async function getStreakDetail(referenceDate: FechaISO): Promise<StreakDay[]> {
  const history = await getGoalRulesHistory();
  const aggregates = await db.dailyAggregates.toArray();
  const minutesByDate = new Map(aggregates.map((a) => [a.fecha, a.minutosTotales]));
  const activeDates = aggregates.filter((a) => a.minutosTotales > 0).map((a) => a.fecha);
  if (activeDates.length === 0) return [];
  // Cota inferior del recorrido: sin ella, un calendario sin objetivos (todo
  // descanso) haría retroceder el cursor indefinidamente.
  const firstDate = activeDates.reduce((min, fecha) => (fecha < min ? fecha : min));

  const days: StreakDay[] = [];
  let cursor = referenceDate;
  while (cursor >= firstDate) {
    const goalMinutes = dailyGoalHoursAt(history, cursor) * 60;
    const minutos = minutesByDate.get(cursor) ?? 0;
    // Cada día se evalúa con las franjas vigentes entonces; si ese día no
    // había ninguna configurada, cuenta cualquier estudio.
    const evaluable = rulesAt(history, cursor).length > 0 ? goalMinutes > 0 : true;
    if (evaluable) {
      if (minutos > 0) days.push({ fecha: cursor, minutos, goalMinutes });
      else if (cursor !== referenceDate) break;
    }
    cursor = addDays(cursor, -1);
  }
  return days.reverse();
}

/** Semanas consecutivas (contando desde la actual hacia atrás) con al menos 1 día de actividad. */
export async function getConsecutiveActiveWeeks(referenceDate: FechaISO): Promise<number> {
  const totals = await getWeeklyTotals();
  let weeks = 0;
  let cursor = startOfIsoWeek(referenceDate);
  // Mismo criterio que la racha diaria: la semana en curso solo suma, nunca
  // resta — si aún está a cero, se cuenta desde la semana pasada.
  if ((totals.get(cursor) ?? 0) <= 0) cursor = addDays(cursor, -7);
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

  const [aggregates, sessions, topics, blocks, history] = await Promise.all([
    db.dailyAggregates.where("fecha").startsWith(monthPrefix).toArray(),
    db.studySessions.where("fecha").startsWith(monthPrefix).toArray(),
    db.topics.toArray(),
    db.blocks.toArray(),
    getGoalRulesHistory(),
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
    const goalMinutes = dailyGoalHoursAt(history, fecha) * 60;
    return {
      fecha,
      minutos: minutesByDate.get(fecha) ?? 0,
      goalMinutes,
      topics: dayTopics ? Array.from(dayTopics, ([nombre, color]) => ({ nombre, color })) : [],
    };
  });
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
  const weeks = Array.from({ length: weeksBack }, (_, i) => {
    const weekStart = addDays(currentWeekStart, -(weeksBack - 1 - i) * 7);
    return { weekStart, minutos: totals.get(weekStart) ?? 0 };
  });
  // La evolución empieza en la primera semana con actividad: las semanas
  // vacías anteriores al inicio del estudio no aportan información.
  const firstActive = weeks.findIndex((w) => w.minutos > 0);
  return firstActive === -1 ? [] : weeks.slice(firstActive);
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

/** % de días con objetivo diario (desde el primer día con actividad registrada) en los que
 *  se cumplió ese objetivo. El día de hoy solo entra en el cómputo si ya está cumplido,
 *  para no penalizar una jornada aún a medias. */
export async function getGoalsCompliance(referenceDate: FechaISO): Promise<number> {
  const history = await getGoalRulesHistory();
  const aggregates = await db.dailyAggregates.toArray();
  const minutesByDate = new Map(aggregates.map((a) => [a.fecha, a.minutosTotales]));
  const activeDates = aggregates.filter((a) => a.minutosTotales > 0).map((a) => a.fecha);
  if (activeDates.length === 0) return 0;
  const firstDate = activeDates.reduce((min, fecha) => (fecha < min ? fecha : min));

  let applicable = 0;
  let met = 0;
  for (let fecha = firstDate; fecha <= referenceDate; fecha = addDays(fecha, 1)) {
    const goalMinutes = dailyGoalHoursAt(history, fecha) * 60;
    if (goalMinutes <= 0) continue;
    const isMet = (minutesByDate.get(fecha) ?? 0) >= goalMinutes;
    if (fecha === referenceDate && !isMet) continue;
    applicable += 1;
    if (isMet) met += 1;
  }
  return applicable === 0 ? 0 : Math.round((met / applicable) * 100);
}
