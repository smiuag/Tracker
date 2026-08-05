import { db } from "@/lib/db/db";
import { STUDY_TYPE_LABELS } from "@/lib/constants/studyTypes";
import type { Block, Topic } from "@/types/topic";
import type { FechaISO, TipoEstudio } from "@/types/common";

/** Sesiones desde `fromDate` (inclusive), o todas si no se indica. */
function sessionsFrom(fromDate?: FechaISO) {
  if (!fromDate) return db.studySessions.toArray();
  return db.studySessions.where("fecha").aboveOrEqual(fromDate).toArray();
}

/** Desglose de minutos por tipo de estudio, con todas las claves presentes. */
export type MinutesPerTipo = Record<TipoEstudio, number>;

function emptyPerTipo(): MinutesPerTipo {
  return { lectura: 0, estudio: 0, test: 0, otros: 0 };
}

export interface TypeMinutes {
  tipo: TipoEstudio;
  label: string;
  minutos: number;
}

function toTypeMinutes(minutesByType: Map<TipoEstudio, number>): TypeMinutes[] {
  return Array.from(minutesByType.entries())
    .filter(([, minutos]) => minutos > 0)
    .map(([tipo, minutos]) => ({ tipo, label: STUDY_TYPE_LABELS[tipo], minutos }))
    .sort((a, b) => b.minutos - a.minutos);
}

export async function getMinutesByType(fromDate?: FechaISO): Promise<TypeMinutes[]> {
  const sessions = await sessionsFrom(fromDate);
  const minutesByType = new Map<TipoEstudio, number>();
  for (const session of sessions) {
    minutesByType.set(session.tipo, (minutesByType.get(session.tipo) ?? 0) + session.duracionMin);
  }
  return toTypeMinutes(minutesByType);
}

export async function getMinutesByTypeForTopic(topicId: string): Promise<TypeMinutes[]> {
  const sessions = await db.studySessions.where("topicId").equals(topicId).toArray();
  const minutesByType = new Map<TipoEstudio, number>();
  for (const session of sessions) {
    minutesByType.set(session.tipo, (minutesByType.get(session.tipo) ?? 0) + session.duracionMin);
  }
  return toTypeMinutes(minutesByType);
}

export interface BlockMinutes {
  block: Block;
  minutos: number;
  porTipo: MinutesPerTipo;
}

export async function getMinutesByBlock(fromDate?: FechaISO): Promise<BlockMinutes[]> {
  const [blocks, topics, sessions] = await Promise.all([
    db.blocks.toArray(),
    db.topics.toArray(),
    sessionsFrom(fromDate),
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

export interface TopicMinutes {
  topic: Topic;
  minutos: number;
  porTipo: MinutesPerTipo;
}

/** Basado en sesiones (no en `tiempoInvertidoMin`) para poder desglosar por
 *  tipo de estudio con los mismos datos que el resto de gráficas. */
export async function getMinutesByTopic(limit = 8, fromDate?: FechaISO): Promise<TopicMinutes[]> {
  const [topics, sessions] = await Promise.all([db.topics.toArray(), sessionsFrom(fromDate)]);
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
