import type { EstadoRepaso, FechaISO } from "./common";

export interface ReviewPattern {
  id: string;
  nombre: string;
  /** Offsets en días desde el estudio original, p.ej. [1, 3, 7, 15, 30] */
  dias: number[];
  esDefault: boolean;
}

export interface Review {
  id: string;
  topicId: string;
  origenSessionId: string | null;
  numeroRepaso: number;
  fechaProgramada: FechaISO;
  fechaCompletada: FechaISO | null;
  estado: EstadoRepaso;
}
