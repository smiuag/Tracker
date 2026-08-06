/**
 * Escala de color compartida por la racha y el calendario mensual (Progreso),
 * con la paleta de la app: verde si se cumplió el objetivo diario, verde suave
 * si se estudió un día sin objetivo previsto (estudio extra), rosa empolvado
 * si se estudió pero no se llegó, y tono base si no hubo estudio.
 */
export function dayCellClass(minutos: number, goalMinutes: number): string {
  if (minutos <= 0) return "bg-secondary/40";
  if (goalMinutes <= 0) return "bg-primary/50";
  return minutos >= goalMinutes ? "bg-primary" : "bg-accent";
}
