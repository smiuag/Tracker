import { db } from "@/lib/db/db";
import { fromFechaISO } from "@/lib/utils/date";
import type { GoalConfig } from "@/types/settings";
import type { FechaISO } from "@/types/common";

const GOAL_CONFIG_KEY = "goalConfig";
const BLOCK_DURATION_KEY = "blockDurationMin";
const LAST_SEEN_WEEK_KEY = "lastSeenWeekStart";

export const DEFAULT_GOAL_CONFIG: GoalConfig = {
  weekdaysMode: "todos",
  customWeekdays: [],
  hoursPerDay: 0,
  topicsPerWeek: null,
  fechaExamen: null,
};

export const DEFAULT_BLOCK_DURATION_MIN = 30;

export async function getGoalConfig(): Promise<GoalConfig> {
  const row = await db.settings.get(GOAL_CONFIG_KEY);
  return (row?.value as GoalConfig | undefined) ?? DEFAULT_GOAL_CONFIG;
}

export async function setGoalConfig(config: GoalConfig): Promise<void> {
  await db.settings.put({ key: GOAL_CONFIG_KEY, value: config });
}

export async function getBlockDurationMin(): Promise<number> {
  const row = await db.settings.get(BLOCK_DURATION_KEY);
  return (row?.value as number | undefined) ?? DEFAULT_BLOCK_DURATION_MIN;
}

export async function setBlockDurationMin(minutes: number): Promise<void> {
  await db.settings.put({ key: BLOCK_DURATION_KEY, value: minutes });
}

/** Lunes de la última semana en la que se abrió la app (para el informe semanal emergente). */
export async function getLastSeenWeekStart(): Promise<FechaISO | null> {
  const row = await db.settings.get(LAST_SEEN_WEEK_KEY);
  return (row?.value as FechaISO | undefined) ?? null;
}

export async function setLastSeenWeekStart(weekStart: FechaISO): Promise<void> {
  await db.settings.put({ key: LAST_SEEN_WEEK_KEY, value: weekStart });
}

/** Días de la semana (0 = lunes … 6 = domingo) en los que aplica el objetivo diario. */
export function applicableWeekdays(config: GoalConfig): number[] {
  if (config.weekdaysMode === "todos") return [0, 1, 2, 3, 4, 5, 6];
  if (config.weekdaysMode === "entre_semana") return [0, 1, 2, 3, 4];
  return config.customWeekdays;
}

function isoWeekday(fecha: FechaISO): number {
  const jsDay = fromFechaISO(fecha).getDay(); // 0 = domingo … 6 = sábado
  return jsDay === 0 ? 6 : jsDay - 1; // 0 = lunes … 6 = domingo
}

export function isApplicableDay(config: GoalConfig, fecha: FechaISO): boolean {
  return applicableWeekdays(config).includes(isoWeekday(fecha));
}

/** Objetivo de horas para un día concreto (0 si ese día de la semana no aplica). */
export async function getDailyGoalHours(fecha: FechaISO): Promise<number> {
  const config = await getGoalConfig();
  if (!config.hoursPerDay) return 0;
  return isApplicableDay(config, fecha) ? config.hoursPerDay : 0;
}

/** Objetivo semanal derivado: horas/día × nº de días aplicables por semana. */
export async function getWeeklyGoalHours(): Promise<number> {
  const config = await getGoalConfig();
  if (!config.hoursPerDay) return 0;
  return config.hoursPerDay * applicableWeekdays(config).length;
}

/** Objetivo mensual derivado: horas/día × nº de días aplicables en el mes de referencia. */
export async function getMonthlyGoalHours(referenceDate: FechaISO): Promise<number> {
  const config = await getGoalConfig();
  if (!config.hoursPerDay) return 0;
  const applicable = new Set(applicableWeekdays(config));
  const [year, month] = referenceDate.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  let count = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const jsDay = new Date(year, month - 1, day).getDay();
    const isoDay = jsDay === 0 ? 6 : jsDay - 1;
    if (applicable.has(isoDay)) count++;
  }
  return config.hoursPerDay * count;
}
