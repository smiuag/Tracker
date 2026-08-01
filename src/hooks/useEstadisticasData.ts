"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { toFechaISO } from "@/lib/utils/date";
import {
  getAverageWeeklyMinutes,
  getBestWeek,
  getGoalsCompliance,
  getMinutesByBlock,
  getMinutesByTopic,
  getMinutesByType,
  getStreak,
  getTestAccuracy,
  getTestsCount,
  getTopicsCompletedCount,
  getWeeklyEvolution,
} from "@/lib/services/stats.service";

const WEEKS_BACK = 10;

export function useEstadisticasData() {
  return useLiveQuery(async () => {
    const today = toFechaISO(new Date());

    const [
      streak,
      topicsCompleted,
      testsCount,
      minutesByBlock,
      minutesByTopic,
      minutesByType,
      testAccuracy,
      bestWeek,
      averageWeeklyMinutes,
      goalsCompliance,
      weeklyEvolution,
    ] = await Promise.all([
      getStreak(today),
      getTopicsCompletedCount(),
      getTestsCount(),
      getMinutesByBlock(),
      getMinutesByTopic(),
      getMinutesByType(),
      getTestAccuracy(),
      getBestWeek(),
      getAverageWeeklyMinutes(),
      getGoalsCompliance(today),
      getWeeklyEvolution(WEEKS_BACK, today),
    ]);

    const totalMinutes = minutesByBlock.reduce((sum, b) => sum + b.minutos, 0);

    return {
      totalMinutes,
      streak,
      topicsCompleted,
      testsCount,
      minutesByBlock,
      minutesByTopic,
      minutesByType,
      testAccuracy,
      bestWeek,
      averageWeeklyMinutes,
      goalsCompliance,
      weeklyEvolution,
    };
  }, []);
}
