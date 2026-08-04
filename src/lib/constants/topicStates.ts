import type { EstadoTema } from "@/types/common";

export const TOPIC_STATE_LABELS: Record<EstadoTema, string> = {
  pendiente: "Pendiente",
  en_progreso: "En progreso",
  acabado: "Acabado",
};

export const TOPIC_STATES: EstadoTema[] = Object.keys(TOPIC_STATE_LABELS) as EstadoTema[];

/** Color de marca por estado: beige = pendiente, rosa = en progreso, verde salvia = acabado. */
export const TOPIC_STATE_BADGE_CLASSES: Record<EstadoTema, string> = {
  pendiente: "bg-secondary text-secondary-foreground",
  en_progreso: "bg-accent text-accent-foreground",
  acabado: "bg-primary text-primary-foreground",
};
