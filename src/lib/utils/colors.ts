/** Verde salvia intenso para "objetivo superado", como clases de fondo y de texto. */
export const GOAL_EXCEEDED_BG = "bg-[#A9BBA1] dark:bg-[#93A98B]";
export const GOAL_EXCEEDED_TEXT = "text-[#A9BBA1] dark:text-[#93A98B]";

/**
 * Escala de color compartida por la racha y el calendario mensual (Progreso),
 * con la paleta de la app: verde intenso si se superó el objetivo diario,
 * verde si se cumplió justo, verde suave si se estudió un día sin objetivo
 * previsto (estudio extra), rosa empolvado si se estudió pero no se llegó,
 * y tono base si no hubo estudio.
 */
export function dayCellClass(minutos: number, goalMinutes: number): string {
  if (minutos <= 0) return "bg-secondary/40";
  if (goalMinutes <= 0) return "bg-primary/50";
  if (minutos > goalMinutes) return GOAL_EXCEEDED_BG;
  return minutos >= goalMinutes ? "bg-primary" : "bg-accent";
}
