import { db } from "@/lib/db/db";
import { createId } from "@/lib/utils/id";
import { HOUR_MILESTONE_BASE } from "@/lib/constants/badges";
import { getDailyGoalHours, getMonthlyGoalHours, getWeeklyGoalHours } from "./settings.service";
import { getMonthMinutes, getWeeklyMinutes } from "./stats.service";
import { startOfIsoWeek } from "@/lib/utils/date";
import type { Badge } from "@/types/badge";
import type { FechaISO } from "@/types/common";

async function hasBadge(tipo: string, contexto: string | null): Promise<boolean> {
  const existing = await db.badges.toArray();
  return existing.some((b) => b.tipo === tipo && b.contexto === contexto);
}

async function awardBadge(
  tipo: string,
  contexto: string | null,
  fecha: FechaISO,
  criterio: string
): Promise<void> {
  if (await hasBadge(tipo, contexto)) return;
  const badge: Badge = { id: createId(), tipo, contexto, fechaObtenida: fecha, criterio };
  await db.badges.add(badge);
}

/** Se llama al cerrar el día ("Terminar el día"): día/semana/mes perfectos. */
export async function evaluateDayEndBadges(fecha: FechaISO): Promise<void> {
  const dailyAggregate = await db.dailyAggregates.get(fecha);
  const minutosDia = dailyAggregate?.minutosTotales ?? 0;

  const dailyGoalHours = await getDailyGoalHours(fecha);
  if (dailyGoalHours > 0 && minutosDia >= dailyGoalHours * 60) {
    await awardBadge("dia_perfecto", fecha, fecha, "Objetivo diario cumplido");
  }

  const weekStart = startOfIsoWeek(fecha);
  const [weeklyGoalHours, weeklyMinutes] = await Promise.all([
    getWeeklyGoalHours(),
    getWeeklyMinutes(fecha),
  ]);
  if (weeklyGoalHours > 0 && weeklyMinutes >= weeklyGoalHours * 60) {
    await awardBadge("semana_perfecta", weekStart, fecha, "Objetivo semanal cumplido");
  }

  const monthKey = fecha.slice(0, 7);
  const [monthlyGoalHours, monthMinutes] = await Promise.all([
    getMonthlyGoalHours(fecha),
    getMonthMinutes(fecha),
  ]);
  if (monthlyGoalHours > 0 && monthMinutes >= monthlyGoalHours * 60) {
    await awardBadge("mes_perfecto", monthKey, fecha, "Objetivo mensual cumplido");
  }
}

/** Se llama tras cambiar el estado de un tema: tema/bloque acabado, mitades. */
export async function evaluateTopicBadges(topicId: string, fecha: FechaISO): Promise<void> {
  const topic = await db.topics.get(topicId);
  if (!topic) return;

  if (topic.estado === "acabado") {
    await awardBadge("tema_acabado", topicId, fecha, `Tema "${topic.nombre}" acabado`);
  }

  const blockTopics = await db.topics.where("blockId").equals(topic.blockId).toArray();
  if (blockTopics.length === 0) return;

  if (blockTopics.every((t) => t.estado === "acabado")) {
    await awardBadge("bloque_acabado", topic.blockId, fecha, "Bloque completado");
  }

  const doneInBlock = blockTopics.filter((t) => t.estado === "acabado").length;
  if (doneInBlock / blockTopics.length >= 0.5) {
    await awardBadge("mitad_bloque", topic.blockId, fecha, "Mitad del bloque completada");
  }

  const allTopics = await db.topics.toArray();
  const doneTotal = allTopics.filter((t) => t.estado === "acabado").length;
  if (allTopics.length > 0 && doneTotal / allTopics.length >= 0.5) {
    await awardBadge("mitad_temario", "global", fecha, "Mitad del temario completada");
  }
}

/**
 * Se llama tras guardar cualquier sesión: hitos de horas totales de estudio
 * (cuentan todas las sesiones, sea cual sea el modo de registro usado).
 */
export async function evaluateHourMilestones(fecha: FechaISO): Promise<void> {
  const sessions = await db.studySessions.toArray();
  const totalHours = sessions.reduce((sum, s) => sum + s.duracionMin, 0) / 60;

  const thresholds = [...HOUR_MILESTONE_BASE];
  for (let next = 200; next <= totalHours; next += 50) {
    thresholds.push(next);
  }

  for (const threshold of thresholds) {
    if (totalHours >= threshold) {
      await awardBadge(`horas_${threshold}`, null, fecha, `${threshold} horas de estudio efectivo`);
    }
  }
}
