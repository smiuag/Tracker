import type { FechaISO, MetricaObjetivo, TipoObjetivo } from "./common";

export interface Goal {
  id: string;
  tipo: TipoObjetivo;
  metrica: MetricaObjetivo;
  valorObjetivo: number;
  /** Agregado cacheado, mantenido por goals.service.ts */
  valorActual: number;
  fechaInicio: FechaISO;
  fechaFin: FechaISO;
}
