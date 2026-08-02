import { db } from "@/lib/db/db";
import { createId } from "@/lib/utils/id";
import type { DailyTask } from "@/types/task";
import type { FechaISO } from "@/types/common";

export async function listTasksByFecha(fecha: FechaISO): Promise<DailyTask[]> {
  return db.dailyTasks.where("fecha").equals(fecha).sortBy("orden");
}

export async function createTask(fecha: FechaISO, texto: string): Promise<DailyTask> {
  const orden = await db.dailyTasks.where("fecha").equals(fecha).count();
  const task: DailyTask = { id: createId(), fecha, texto, completado: false, orden };
  await db.dailyTasks.add(task);
  return task;
}

export async function toggleTask(id: string, completado: boolean): Promise<void> {
  await db.dailyTasks.update(id, { completado });
}

export async function deleteTask(id: string): Promise<void> {
  await db.dailyTasks.delete(id);
}
