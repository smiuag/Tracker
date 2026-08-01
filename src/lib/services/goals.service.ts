import { db } from "@/lib/db/db";
import { createId } from "@/lib/utils/id";
import type { Goal } from "@/types/goal";
import type { FechaISO, TipoObjetivo } from "@/types/common";

/**
 * Progreso calculado en el momento de la lectura (no cacheado): más simple
 * y siempre correcto que mantener un agregado sincronizado desde cada
 * sesión/test/tema. A la escala de un usuario local (cientos de filas) el
 * coste de recalcular es trivial.
 *
 * Para la métrica "temas" se usa `ultimoEstudio` como aproximación de la
 * fecha de finalización, ya que Topic no registra una fecha de completado
 * explícita.
 */
export async function computeGoalProgress(goal: Goal): Promise<number> {
  if (goal.metrica === "horas") {
    const sessions = await db.studySessions
      .where("fecha")
      .between(goal.fechaInicio, goal.fechaFin, true, true)
      .toArray();
    return sessions.reduce((sum, s) => sum + s.duracionMin, 0) / 60;
  }
  if (goal.metrica === "tests") {
    return db.testResults
      .where("fecha")
      .between(goal.fechaInicio, goal.fechaFin, true, true)
      .count();
  }
  const topics = await db.topics.where("estado").equals("completado").toArray();
  return topics.filter(
    (t) => t.ultimoEstudio && t.ultimoEstudio >= goal.fechaInicio && t.ultimoEstudio <= goal.fechaFin
  ).length;
}

/**
 * Objetivo activo de un tipo dado (fechaInicio <= referenceDate <= fechaFin),
 * con `valorActual` sustituido por el progreso real calculado al vuelo.
 * Si no hay ninguno vigente, cae al más reciente de ese tipo (o null).
 */
export async function getActiveGoal(
  tipo: TipoObjetivo,
  referenceDate: FechaISO
): Promise<Goal | null> {
  const goals = await db.goals.where("tipo").equals(tipo).toArray();
  const active = goals.find((g) => g.fechaInicio <= referenceDate && referenceDate <= g.fechaFin);
  const goal = active ?? [...goals].sort((a, b) => b.fechaFin.localeCompare(a.fechaFin))[0];
  if (!goal) return null;
  return { ...goal, valorActual: await computeGoalProgress(goal) };
}

export async function listGoalsWithProgress(): Promise<Goal[]> {
  const goals = await db.goals.toArray();
  const withProgress = await Promise.all(
    goals.map(async (g) => ({ ...g, valorActual: await computeGoalProgress(g) }))
  );
  return withProgress.sort((a, b) => b.fechaInicio.localeCompare(a.fechaInicio));
}

export type NewGoal = Pick<Goal, "tipo" | "metrica" | "valorObjetivo" | "fechaInicio" | "fechaFin">;

export async function createGoal(input: NewGoal): Promise<Goal> {
  const goal: Goal = { id: createId(), ...input, valorActual: 0 };
  await db.goals.add(goal);
  return goal;
}

export async function updateGoal(id: string, patch: Partial<NewGoal>): Promise<void> {
  await db.goals.update(id, patch);
}

export async function deleteGoal(id: string): Promise<void> {
  await db.goals.delete(id);
}
