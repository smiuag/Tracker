"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { getMonthOverview } from "@/lib/services/stats.service";
import type { FechaISO } from "@/types/common";

export function useMonthOverview(referenceDate: FechaISO) {
  return useLiveQuery(() => getMonthOverview(referenceDate), [referenceDate]);
}
