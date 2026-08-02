import type { FechaISO } from "./common";

export interface DailyTask {
  id: string;
  fecha: FechaISO;
  texto: string;
  completado: boolean;
  orden: number;
}
