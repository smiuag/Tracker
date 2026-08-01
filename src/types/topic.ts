import type { EstadoTema, FechaISO, Nivel1a5 } from "./common";

export interface Block {
  id: string;
  nombre: string;
  color: string;
  orden: number;
}

export interface Topic {
  id: string;
  blockId: string;
  nombre: string;
  estado: EstadoTema;
  porcentaje: number;
  dificultad: Nivel1a5;
  notas: string;
  patronRepasoId: string | null;
  /** Agregado cacheado, mantenido por sessions.service.ts */
  tiempoInvertidoMin: number;
  /** Agregado cacheado, mantenido por sessions.service.ts */
  ultimoEstudio: FechaISO | null;
  createdAt: string;
  updatedAt: string;
}

export interface Subtopic {
  id: string;
  topicId: string;
  nombre: string;
  completado: boolean;
  orden: number;
}
