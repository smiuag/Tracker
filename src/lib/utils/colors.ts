/**
 * Color de cada celda del calendario mensual (Progreso), según el objetivo
 * diario configurado: verde si se cumplió, naranja si se estudió pero no se
 * llegó, arena oscuro si se estudió un día no previsto, y tono base si no
 * hubo estudio.
 */
export function dayCellClass(minutos: number, goalMinutes: number): string {
  if (minutos <= 0) return "bg-secondary/40";
  if (goalMinutes <= 0) return "bg-[#D3BE94] dark:bg-[#5A5240]";
  return minutos >= goalMinutes ? "bg-primary" : "bg-[#D9A15C]/70";
}
