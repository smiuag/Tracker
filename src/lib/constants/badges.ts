export interface BadgeDefinition {
  tipo: string;
  nombre: string;
  descripcion: string;
  repetible: boolean;
}

export const BADGE_CATALOG: BadgeDefinition[] = [
  { tipo: "dia_perfecto", nombre: "Día perfecto", descripcion: "Cumpliste el objetivo del día.", repetible: true },
  { tipo: "semana_perfecta", nombre: "Semana perfecta", descripcion: "Cumpliste el objetivo semanal.", repetible: true },
  { tipo: "mes_perfecto", nombre: "Mes perfecto", descripcion: "Cumpliste el objetivo mensual.", repetible: true },
  { tipo: "tema_acabado", nombre: "Tema acabado", descripcion: "Terminaste un tema.", repetible: true },
  { tipo: "bloque_acabado", nombre: "Bloque acabado", descripcion: "Terminaste todos los temas de un bloque.", repetible: true },
  {
    tipo: "mitad_bloque",
    nombre: "Mitad de bloque",
    descripcion: "Acabaste la mitad de los temas de un bloque.",
    repetible: true,
  },
  {
    tipo: "mitad_temario",
    nombre: "Mitad del temario",
    descripcion: "Acabaste la mitad de todos tus temas.",
    repetible: false,
  },
];

/** A partir de estos, se generan hitos cada +50h indefinidamente (200, 250, 300…). */
export const HOUR_MILESTONE_BASE = [10, 50, 100, 150];

export function hourMilestoneLabel(hours: number): string {
  return `${hours} horas de estudio`;
}
