import { db } from "./db";
import { DEFAULT_REVIEW_PATTERN, DEFAULT_REVIEW_PATTERN_ID } from "@/lib/constants/reviewPatterns";

/**
 * Garantiza datos mínimos indispensables (p.ej. el patrón de repaso por
 * defecto) tanto en desarrollo como en producción. Idempotente.
 */
export async function ensureBootstrapData(): Promise<void> {
  const existing = await db.reviewPatterns.get(DEFAULT_REVIEW_PATTERN_ID);
  if (!existing) {
    await db.reviewPatterns.add(DEFAULT_REVIEW_PATTERN);
  }
}
