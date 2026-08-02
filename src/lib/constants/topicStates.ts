import type { EstadoTema } from "@/types/common";

export const TOPIC_STATE_LABELS: Record<EstadoTema, string> = {
  pendiente: "Pendiente",
  empezado: "Empezado",
  segunda_vuelta: "2ª vuelta",
  tercera_vuelta: "3ª vuelta",
  acabado: "Acabado",
};

export const TOPIC_STATES: EstadoTema[] = Object.keys(TOPIC_STATE_LABELS) as EstadoTema[];
