import { db } from "@/lib/db/db";
import { addDays, fromFechaISO } from "@/lib/utils/date";
import type { GoalConfig, LegacyGoalConfig } from "@/types/settings";
import type { FechaISO } from "@/types/common";

export const BACKUP_REMINDER_INTERVAL_DAYS = 21;

const GOAL_CONFIG_KEY = "goalConfig";
const BLOCK_DURATION_KEY = "blockDurationMin";
const LAST_SEEN_WEEK_KEY = "lastSeenWeekStart";
const LAST_BACKUP_AT_KEY = "lastBackupAt";
const NEXT_BACKUP_REMINDER_AT_KEY = "nextBackupReminderAt";
const BACKUP_REMINDER_DISMISSED_KEY = "backupReminderDismissed";

export const DEFAULT_GOAL_CONFIG: GoalConfig = {
  rules: [],
  topicsPerWeek: null,
  fechaExamen: null,
};

export const DEFAULT_BLOCK_DURATION_MIN = 30;

/** Convierte la forma antigua (una sola franja implícita) al modelo de franjas. */
function normalizeGoalConfig(raw: GoalConfig | LegacyGoalConfig): GoalConfig {
  if ("rules" in raw) return raw;
  const weekdays =
    raw.weekdaysMode === "todos"
      ? [0, 1, 2, 3, 4, 5, 6]
      : raw.weekdaysMode === "entre_semana"
        ? [0, 1, 2, 3, 4]
        : raw.customWeekdays;
  return {
    rules: raw.hoursPerDay > 0 && weekdays.length > 0 ? [{ weekdays, hours: raw.hoursPerDay }] : [],
    topicsPerWeek: raw.topicsPerWeek,
    fechaExamen: raw.fechaExamen,
  };
}

export async function getGoalConfig(): Promise<GoalConfig> {
  const row = await db.settings.get(GOAL_CONFIG_KEY);
  const raw = row?.value as GoalConfig | LegacyGoalConfig | undefined;
  return raw ? normalizeGoalConfig(raw) : DEFAULT_GOAL_CONFIG;
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

/** Fecha de la última exportación de copia de seguridad realizada por el usuario. */
export async function getLastBackupAt(): Promise<FechaISO | null> {
  const row = await db.settings.get(LAST_BACKUP_AT_KEY);
  return (row?.value as FechaISO | undefined) ?? null;
}

export async function setLastBackupAt(fecha: FechaISO): Promise<void> {
  await db.settings.put({ key: LAST_BACKUP_AT_KEY, value: fecha });
}

/** Próxima fecha en la que procede volver a mostrar el recordatorio de copia de seguridad. */
export async function getNextBackupReminderAt(): Promise<FechaISO | null> {
  const row = await db.settings.get(NEXT_BACKUP_REMINDER_AT_KEY);
  return (row?.value as FechaISO | undefined) ?? null;
}

export async function setNextBackupReminderAt(fecha: FechaISO): Promise<void> {
  await db.settings.put({ key: NEXT_BACKUP_REMINDER_AT_KEY, value: fecha });
}

export async function isBackupReminderDismissed(): Promise<boolean> {
  const row = await db.settings.get(BACKUP_REMINDER_DISMISSED_KEY);
  return (row?.value as boolean | undefined) ?? false;
}

/** El usuario ha elegido "No volver a recordar": no se vuelve a mostrar nunca más. */
export async function dismissBackupReminderForever(): Promise<void> {
  await db.settings.put({ key: BACKUP_REMINDER_DISMISSED_KEY, value: true });
}

/** Se llama tras cada exportación exitosa: reinicia el conteo del recordatorio. */
export async function recordBackupExported(fecha: FechaISO): Promise<void> {
  await setLastBackupAt(fecha);
  await setNextBackupReminderAt(addDays(fecha, BACKUP_REMINDER_INTERVAL_DAYS));
}

/** Días de la semana (0 = lunes … 6 = domingo) en los que aplica alguna franja. */
export function applicableWeekdays(config: GoalConfig): number[] {
  const days = new Set<number>();
  for (const rule of config.rules) rule.weekdays.forEach((d) => days.add(d));
  return [...days].sort((a, b) => a - b);
}

function isoWeekday(fecha: FechaISO): number {
  const jsDay = fromFechaISO(fecha).getDay(); // 0 = domingo … 6 = sábado
  return jsDay === 0 ? 6 : jsDay - 1; // 0 = lunes … 6 = domingo
}

export function isApplicableDay(config: GoalConfig, fecha: FechaISO): boolean {
  return applicableWeekdays(config).includes(isoWeekday(fecha));
}

/** Horas objetivo de un día concreto según su franja (0 si ninguna lo incluye). */
export function dailyGoalHoursFor(config: GoalConfig, fecha: FechaISO): number {
  const day = isoWeekday(fecha);
  return config.rules.find((r) => r.weekdays.includes(day))?.hours ?? 0;
}

/** Horas objetivo de una semana completa: suma de todas las franjas. */
export function weeklyGoalHoursFor(config: GoalConfig): number {
  return config.rules.reduce((sum, r) => sum + r.hours * r.weekdays.length, 0);
}

/** Objetivo de horas para un día concreto (0 si ese día de la semana no aplica). */
export async function getDailyGoalHours(fecha: FechaISO): Promise<number> {
  const config = await getGoalConfig();
  return dailyGoalHoursFor(config, fecha);
}

/** Objetivo semanal derivado de las franjas configuradas. */
export async function getWeeklyGoalHours(): Promise<number> {
  const config = await getGoalConfig();
  return weeklyGoalHoursFor(config);
}

/** Objetivo mensual derivado: suma del objetivo de cada día del mes de referencia. */
export async function getMonthlyGoalHours(referenceDate: FechaISO): Promise<number> {
  const config = await getGoalConfig();
  if (config.rules.length === 0) return 0;
  const hoursByWeekday = new Map<number, number>();
  for (const rule of config.rules) {
    for (const day of rule.weekdays) {
      if (!hoursByWeekday.has(day)) hoursByWeekday.set(day, rule.hours);
    }
  }
  const [year, month] = referenceDate.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  let total = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const jsDay = new Date(year, month - 1, day).getDay();
    const isoDay = jsDay === 0 ? 6 : jsDay - 1;
    total += hoursByWeekday.get(isoDay) ?? 0;
  }
  return total;
}
