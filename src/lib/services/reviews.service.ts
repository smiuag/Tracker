import { db } from "@/lib/db/db";
import { createId } from "@/lib/utils/id";
import { addDays } from "@/lib/utils/date";
import { DEFAULT_REVIEW_PATTERN, DEFAULT_REVIEW_PATTERN_ID } from "@/lib/constants/reviewPatterns";
import type { Review, ReviewPattern } from "@/types/review";
import type { FechaISO } from "@/types/common";

async function getPatternForTopic(patronRepasoId: string | null): Promise<ReviewPattern> {
  if (patronRepasoId) {
    const pattern = await db.reviewPatterns.get(patronRepasoId);
    if (pattern) return pattern;
  }
  const defaultPattern = await db.reviewPatterns.get(DEFAULT_REVIEW_PATTERN_ID);
  return defaultPattern ?? DEFAULT_REVIEW_PATTERN;
}

/**
 * Al estudiar un tema (sesión no-repaso), programa los próximos repasos
 * según su patrón (o el patrón por defecto). Sustituye cualquier repaso
 * pendiente previo del tema para no acumular series duplicadas.
 */
export async function scheduleReviewsForTopic(
  topicId: string,
  originSessionId: string,
  fechaSesion: FechaISO
): Promise<void> {
  const topic = await db.topics.get(topicId);
  if (!topic) return;
  const pattern = await getPatternForTopic(topic.patronRepasoId);

  const pending = await db.reviews
    .where("topicId")
    .equals(topicId)
    .filter((r) => r.estado === "pendiente")
    .toArray();

  const nuevos: Review[] = pattern.dias.map((dias, index) => ({
    id: createId(),
    topicId,
    origenSessionId: originSessionId,
    numeroRepaso: index + 1,
    fechaProgramada: addDays(fechaSesion, dias),
    fechaCompletada: null,
    estado: "pendiente",
  }));

  await db.transaction("rw", db.reviews, async () => {
    await db.reviews.bulkDelete(pending.map((r) => r.id));
    await db.reviews.bulkAdd(nuevos);
  });
}

/**
 * Al registrar una sesión de tipo "repaso" sobre un tema, marca completado
 * el repaso pendiente más próximo de ese tema (si existe).
 */
export async function completeNextReviewForTopic(
  topicId: string,
  fechaCompletada: FechaISO
): Promise<void> {
  const pending = await db.reviews
    .where("topicId")
    .equals(topicId)
    .filter((r) => r.estado === "pendiente")
    .sortBy("fechaProgramada");
  const next = pending[0];
  if (next) await completeReview(next.id, fechaCompletada);
}

export async function completeReview(id: string, fechaCompletada: FechaISO): Promise<void> {
  await db.reviews.update(id, { estado: "completado", fechaCompletada });
}

/** Reprograma un repaso a una fecha posterior; sigue apareciendo como pendiente. */
export async function postponeReview(id: string, newFecha: FechaISO): Promise<void> {
  await db.reviews.update(id, { fechaProgramada: newFecha });
}

export interface ReviewWithTopic extends Review {
  topicNombre: string;
}

export async function getPendingReviewsWithTopics(): Promise<ReviewWithTopic[]> {
  const pending = await db.reviews.where("estado").equals("pendiente").sortBy("fechaProgramada");
  const topics = await db.topics.bulkGet(pending.map((r) => r.topicId));
  return pending.map((review, i) => ({
    ...review,
    topicNombre: topics[i]?.nombre ?? "Tema eliminado",
  }));
}

export async function getReviewPattern(): Promise<ReviewPattern> {
  const pattern = await db.reviewPatterns.get(DEFAULT_REVIEW_PATTERN_ID);
  return pattern ?? DEFAULT_REVIEW_PATTERN;
}

export async function updateReviewPattern(dias: number[]): Promise<void> {
  await db.reviewPatterns.put({
    id: DEFAULT_REVIEW_PATTERN_ID,
    nombre: dias.join("-"),
    dias,
    esDefault: true,
  });
}
