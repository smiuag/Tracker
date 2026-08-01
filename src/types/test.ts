import type { FechaISO } from "./common";

export interface TestResult {
  id: string;
  topicId: string;
  fecha: FechaISO;
  aciertos: number;
  errores: number;
  totalPreguntas: number;
  notas: string;
}
