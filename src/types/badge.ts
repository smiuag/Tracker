import type { FechaISO } from "./common";

export interface Badge {
  id: string;
  tipo: string;
  /**
   * Identifica el contexto concreto que ganó esta instancia (topicId, blockId,
   * fecha, "YYYY-MM"...), para no volver a otorgar la misma dos veces. `null`
   * en medallas globales de una sola vez (p.ej. "mitad_temario").
   */
  contexto: string | null;
  fechaObtenida: FechaISO;
  criterio: string;
}

export interface Setting {
  key: string;
  value: unknown;
}
