"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { toFechaISO } from "@/lib/utils/date";
import { getActiveGoal } from "@/lib/services/goals.service";
import {
  getContributionCalendar,
  getMinutesByBlock,
  getNextReview,
  getStreak,
  getTestsCount,
  getTopicsCompletedCount,
  getWeeklyMinutes,
} from "@/lib/services/stats.service";

const CONTRIBUTION_WEEKS = 12;

export function useDashboardData() {
  return useLiveQuery(async () => {
    const today = toFechaISO(new Date());

    const [
      weeklyMinutes,
      streak,
      topicsCompleted,
      testsCount,
      nextReview,
      minutesByBlock,
      contributionDays,
      weeklyGoal,
      monthlyGoal,
    ] = await Promise.all([
      getWeeklyMinutes(today),
      getStreak(today),
      getTopicsCompletedCount(),
      getTestsCount(),
      getNextReview(),
      getMinutesByBlock(),
      getContributionCalendar(CONTRIBUTION_WEEKS, today),
      getActiveGoal("semanal", today),
      getActiveGoal("mensual", today),
    ]);

    return {
      weeklyMinutes,
      streak,
      topicsCompleted,
      testsCount,
      nextReview,
      minutesByBlock,
      contributionDays,
      weeklyGoal,
      monthlyGoal,
    };
  }, []);
}

export type DashboardData = NonNullable<ReturnType<typeof useDashboardData>>;
