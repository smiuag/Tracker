"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { DEFAULT_BLOCK_DURATION_MIN, getBlockDurationMin } from "@/lib/services/settings.service";

export function useBlockDurationMin(): number {
  const value = useLiveQuery(() => getBlockDurationMin(), []);
  return value ?? DEFAULT_BLOCK_DURATION_MIN;
}
