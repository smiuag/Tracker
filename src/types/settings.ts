import type { FechaISO } from "./common";

/** Una franja del objetivo: los días seleccionados comparten horas diarias. */
export interface GoalRule {
  /** 0 = lunes … 6 = domingo */
  weekdays: number[];
  hours: number;
}

export interface GoalConfig {
  /** Franjas de estudio; un día de la semana pertenece como mucho a una. */
  rules: GoalRule[];
  topicsPerWeek: number | null;
  fechaExamen: FechaISO | null;
}

/** Tramo del historial de franjas: `rules` rige desde `desde` (inclusive)
 *  hasta el `desde` del siguiente tramo. Cambiar el objetivo solo añade un
 *  tramo nuevo, sin alterar cómo se evalúan los días anteriores. */
export interface GoalRulesEpoch {
  desde: FechaISO;
  rules: GoalRule[];
}

/** Forma antigua (una sola franja implícita), aún presente en datos guardados. */
export interface LegacyGoalConfig {
  weekdaysMode: "todos" | "entre_semana" | "personalizado";
  customWeekdays: number[];
  hoursPerDay: number;
  topicsPerWeek: number | null;
  fechaExamen: FechaISO | null;
}
