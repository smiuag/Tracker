"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { toFechaISO } from "@/lib/utils/date";
import { getActiveGoal } from "@/lib/services/goals.service";
import { getDailyLog, getSessionsByFecha } from "@/lib/services/sessions.service";

export function useTodayData() {
  return useLiveQuery(async () => {
    const today = toFechaISO(new Date());
    const [sessions, dailyGoal, dailyLog] = await Promise.all([
      getSessionsByFecha(today),
      getActiveGoal("diario", today),
      getDailyLog(today),
    ]);
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duracionMin, 0);
    return { today, sessions, dailyGoal, dailyLog, totalMinutes };
  }, []);
}
