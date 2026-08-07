"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/db";
import { toFechaISO } from "@/lib/utils/date";
import {
  getDailyGoalHours,
  getGoalConfig,
  getMonthlyGoalHours,
  getWeeklyGoalHours,
} from "@/lib/services/settings.service";
import {
  getConsecutiveActiveWeeks,
  getCurrentTopic,
  getMinutesByBlock,
  getMinutesByTypeForTopic,
  getMonthMinutes,
  getStreak,
  getStreakDetail,
  getTopicProgressBreakdown,
  getTopicsCompletedCount,
  getTopicsPendingCount,
  getWeeklyMinutes,
} from "@/lib/services/stats.service";

export function useDashboardData() {
  return useLiveQuery(async () => {
    const today = toFechaISO(new Date());

    const [
      weeklyMinutes,
      monthMinutes,
      dailyGoalHours,
      dailyAggregate,
      streak,
      streakDays,
      consecutiveActiveWeeks,
      topicsCompleted,
      topicsPending,
      topicProgress,
      currentTopic,
      minutesByBlock,
      weeklyGoalHours,
      monthlyGoalHours,
      goalConfig,
    ] = await Promise.all([
      getWeeklyMinutes(today),
      getMonthMinutes(today),
      getDailyGoalHours(today),
      db.dailyAggregates.get(today),
      getStreak(today),
      getStreakDetail(today),
      getConsecutiveActiveWeeks(today),
      getTopicsCompletedCount(),
      getTopicsPendingCount(),
      getTopicProgressBreakdown(),
      getCurrentTopic(),
      getMinutesByBlock(),
      getWeeklyGoalHours(today),
      getMonthlyGoalHours(today),
      getGoalConfig(),
    ]);

    const currentTopicMinutesByType = currentTopic
      ? await getMinutesByTypeForTopic(currentTopic.id)
      : [];

    return {
      today,
      weeklyMinutes,
      monthMinutes,
      dailyMinutes: dailyAggregate?.minutosTotales ?? 0,
      dailyGoalHours,
      streak,
      streakDays,
      consecutiveActiveWeeks,
      topicsCompleted,
      topicsPending,
      topicProgress,
      currentTopic,
      currentTopicMinutesByType,
      minutesByBlock,
      weeklyGoalHours,
      monthlyGoalHours,
      fechaExamen: goalConfig.fechaExamen,
    };
  }, []);
}

export type DashboardData = NonNullable<ReturnType<typeof useDashboardData>>;
