"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { getTotalMinutes } from "@/lib/services/stats.service";

export function useTotalMinutes() {
  return useLiveQuery(() => getTotalMinutes(), []);
}
