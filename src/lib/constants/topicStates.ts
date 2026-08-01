import type { EstadoTema } from "@/types/common";

export const TOPIC_STATE_LABELS: Record<EstadoTema, string> = {
  no_iniciado: "No iniciado",
  en_progreso: "En progreso",
  completado: "Completado",
};

export const TOPIC_STATES: EstadoTema[] = Object.keys(TOPIC_STATE_LABELS) as EstadoTema[];
