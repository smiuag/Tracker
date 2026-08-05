"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { addDays, toFechaISO } from "@/lib/utils/date";
import {
  getAverageWeeklyMinutes,
  getBestWeek,
  getGoalsCompliance,
  getMinutesByBlock,
  getMinutesByTopic,
  getMinutesByType,
  getStreak,
  getTopicsCompletedCount,
  getTotalMinutes,
  getWeeklyEvolution,
} from "@/lib/services/stats.service";

const WEEKS_BACK = 10;

export type StatsPeriod = "todo" | "mes" | "semana";

/** Primer día incluido en el periodo (ventana móvil), o sin límite para "todo". */
function periodFromDate(period: StatsPeriod, today: string): string | undefined {
  if (period === "semana") return addDays(today, -6);
  if (period === "mes") return addDays(today, -29);
  return undefined;
}

export function useEstadisticasData(period: StatsPeriod) {
  return useLiveQuery(async () => {
    const today = toFechaISO(new Date());
    const fromDate = periodFromDate(period, today);

    const [
      totalMinutes,
      streak,
      topicsCompleted,
      minutesByBlock,
      minutesByTopic,
      minutesByType,
      bestWeek,
      averageWeeklyMinutes,
      goalsCompliance,
      weeklyEvolution,
    ] = await Promise.all([
      getTotalMinutes(),
      getStreak(today),
      getTopicsCompletedCount(),
      getMinutesByBlock(fromDate),
      getMinutesByTopic(8, fromDate),
      getMinutesByType(fromDate),
      getBestWeek(),
      getAverageWeeklyMinutes(),
      getGoalsCompliance(today),
      getWeeklyEvolution(WEEKS_BACK, today),
    ]);

    return {
      totalMinutes,
      streak,
      topicsCompleted,
      minutesByBlock,
      minutesByTopic,
      minutesByType,
      bestWeek,
      averageWeeklyMinutes,
      goalsCompliance,
      weeklyEvolution,
    };
  }, [period]);
}
