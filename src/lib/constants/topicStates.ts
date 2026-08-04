import type { EstadoTema } from "@/types/common";

export const TOPIC_STATE_LABELS: Record<EstadoTema, string> = {
  pendiente: "Pendiente",
  en_progreso: "En progreso",
  acabado: "Acabado",
};

export const TOPIC_STATES: EstadoTema[] = Object.keys(TOPIC_STATE_LABELS) as EstadoTema[];

/**
 * Color de marca por estado: beige = pendiente, rosa = en progreso, verde
 * salvia = acabado. Usa las variantes "chart" (más saturadas que
 * primary/accent) para que los 3 estados se distingan bien uno de otro
 * cuando aparecen juntos (barra de progreso del temario, botones rápidos).
 */
export const TOPIC_STATE_BADGE_CLASSES: Record<EstadoTema, string> = {
  pendiente: "bg-secondary text-secondary-foreground",
  en_progreso: "bg-chart-5 text-primary-foreground",
  acabado: "bg-chart-4 text-primary-foreground",
};
