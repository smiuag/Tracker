import type { FechaISO } from "./common";

export interface Badge {
  id: string;
  tipo: string;
  fechaObtenida: FechaISO;
  criterio: string;
}

export interface Setting {
  key: string;
  value: unknown;
}
