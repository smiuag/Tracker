"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { listGoalsWithProgress } from "@/lib/services/goals.service";

export function useGoals() {
  return useLiveQuery(() => listGoalsWithProgress(), []);
}
