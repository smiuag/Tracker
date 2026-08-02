"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { listTasksByFecha } from "@/lib/services/tasks.service";
import type { FechaISO } from "@/types/common";

export function useDailyTasks(fecha: FechaISO) {
  return useLiveQuery(() => listTasksByFecha(fecha), [fecha]);
}
