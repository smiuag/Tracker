import { db } from "@/lib/db/db";
import { addDays, fromFechaISO, isoWeekDates, toFechaISO } from "@/lib/utils/date";
import type { GoalConfig, GoalRule, GoalRulesEpoch, LegacyGoalConfig } from "@/types/settings";
import type { FechaISO } from "@/types/common";

export const BACKUP_REMINDER_INTERVAL_DAYS = 21;

const GOAL_CONFIG_KEY = "goalConfig";
const GOAL_RULES_HISTORY_KEY = "goalRulesHistory";
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

/**
 * Guarda el objetivo y, si las franjas cambiaron, abre un tramo nuevo en el
 * historial con vigencia desde hoy: los días anteriores se siguen evaluando
 * con las franjas que tenían entonces.
 */
export async function setGoalConfig(config: GoalConfig): Promise<void> {
  const history = await getGoalRulesHistory();
  const today = toFechaISO(new Date());
  const last = history[history.length - 1];
  if (!last || JSON.stringify(last.rules) !== JSON.stringify(config.rules)) {
    const next =
      last && last.desde === today
        ? [...history.slice(0, -1), { desde: today, rules: config.rules }]
        : [...history, { desde: today, rules: config.rules }];
    await db.settings.put({ key: GOAL_RULES_HISTORY_KEY, value: next });
  }
  await db.settings.put({ key: GOAL_CONFIG_KEY, value: config });
}

/** Historial de franjas ordenado por vigencia. Si aún no existe (datos de
 *  versiones anteriores), las franjas actuales rigen también el pasado. */
export async function getGoalRulesHistory(): Promise<GoalRulesEpoch[]> {
  const row = await db.settings.get(GOAL_RULES_HISTORY_KEY);
  const stored = row?.value as GoalRulesEpoch[] | undefined;
  if (stored && stored.length > 0) return stored;
  const config = await getGoalConfig();
  return [{ desde: "0000-01-01", rules: config.rules }];
}

/** Franjas vigentes en una fecha concreta. */
export function rulesAt(history: GoalRulesEpoch[], fecha: FechaISO): GoalRule[] {
  let rules: GoalRule[] = [];
  for (const epoch of history) {
    if (epoch.desde <= fecha) rules = epoch.rules;
    else break;
  }
  return rules;
}

/** Horas objetivo de un día según las franjas vigentes ese día. */
export function dailyGoalHoursAt(history: GoalRulesEpoch[], fecha: FechaISO): number {
  const day = isoWeekday(fecha);
  return rulesAt(history, fecha).find((r) => r.weekdays.includes(day))?.hours ?? 0;
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

function isoWeekday(fecha: FechaISO): number {
  const jsDay = fromFechaISO(fecha).getDay(); // 0 = domingo … 6 = sábado
  return jsDay === 0 ? 6 : jsDay - 1; // 0 = lunes … 6 = domingo
}

/** Objetivo de horas para un día concreto según las franjas vigentes entonces. */
export async function getDailyGoalHours(fecha: FechaISO): Promise<number> {
  const history = await getGoalRulesHistory();
  return dailyGoalHoursAt(history, fecha);
}

/** Objetivo de la semana ISO de `referenceDate`: suma del objetivo vigente de cada día. */
export async function getWeeklyGoalHours(referenceDate: FechaISO): Promise<number> {
  const history = await getGoalRulesHistory();
  return isoWeekDates(referenceDate).reduce((sum, d) => sum + dailyGoalHoursAt(history, d), 0);
}

/** Objetivo mensual: suma del objetivo vigente de cada día del mes de referencia. */
export async function getMonthlyGoalHours(referenceDate: FechaISO): Promise<number> {
  const history = await getGoalRulesHistory();
  const [year, month] = referenceDate.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  let total = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    total += dailyGoalHoursAt(history, toFechaISO(new Date(year, month - 1, day)));
  }
  return total;
}
