"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { getBlockDurationMin, getGoalConfig } from "@/lib/services/settings.service";

export function useAppSettings() {
  return useLiveQuery(async () => {
    const [goalConfig, blockDurationMin] = await Promise.all([
      getGoalConfig(),
      getBlockDurationMin(),
    ]);
    return { goalConfig, blockDurationMin };
  }, []);
}
