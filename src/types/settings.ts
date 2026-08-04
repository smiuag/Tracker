import type { FechaISO } from "./common";

export type WeekdaysMode = "todos" | "entre_semana" | "personalizado";

export interface GoalConfig {
  weekdaysMode: WeekdaysMode;
  /** Solo se usa cuando weekdaysMode es "personalizado". 0 = lunes … 6 = domingo. */
  customWeekdays: number[];
  hoursPerDay: number;
  topicsPerWeek: number | null;
  fechaExamen: FechaISO | null;
}
