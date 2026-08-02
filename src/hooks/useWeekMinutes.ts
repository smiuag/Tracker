"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { getWeeklyMinutes } from "@/lib/services/stats.service";
import type { FechaISO } from "@/types/common";

export function useWeekMinutes(referenceDate: FechaISO) {
  return useLiveQuery(() => getWeeklyMinutes(referenceDate), [referenceDate]);
}
