"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { toFechaISO } from "@/lib/utils/date";
import { getDailyGoalHours } from "@/lib/services/settings.service";
import { getDailyLog, getSessionsByFecha } from "@/lib/services/sessions.service";

export function useTodayData() {
  return useLiveQuery(async () => {
    const today = toFechaISO(new Date());
    const [sessions, dailyGoalHours, dailyLog] = await Promise.all([
      getSessionsByFecha(today),
      getDailyGoalHours(today),
      getDailyLog(today),
    ]);
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duracionMin, 0);
    return { today, sessions, dailyGoalHours, dailyLog, totalMinutes };
  }, []);
}
