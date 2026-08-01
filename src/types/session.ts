import type { FechaISO, Nivel1a5, TipoEstudio } from "./common";

export interface StudySession {
  id: string;
  topicId: string | null;
  tipo: TipoEstudio;
  /** ISO datetime completo */
  inicio: string;
  /** ISO datetime completo */
  fin: string;
  duracionMin: number;
  fecha: FechaISO;
  observaciones: string;
  energia: Nivel1a5;
  concentracion: Nivel1a5;
  pomodoros: number;
}

export interface DailyLog {
  fecha: FechaISO;
  horasObjetivo: number;
  reflexion: string;
  productividad: Nivel1a5;
}

/** Agregado cacheado por día, mantenido transaccionalmente por sessions.service.ts */
export interface DailyAggregate {
  fecha: FechaISO;
  minutosTotales: number;
  sesiones: number;
}
