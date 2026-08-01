export type Nivel1a5 = 1 | 2 | 3 | 4 | 5;

export type TipoEstudio =
  | "lectura"
  | "esquema"
  | "memorizacion"
  | "test"
  | "repaso"
  | "legislacion";

export type EstadoTema = "no_iniciado" | "en_progreso" | "completado";

export type EstadoRepaso = "pendiente" | "completado" | "pospuesto";

export type TipoObjetivo = "diario" | "semanal" | "mensual" | "anual";

export type MetricaObjetivo = "horas" | "temas" | "tests";

/** Fecha en formato "YYYY-MM-DD", clave de la mayoría de agregados diarios. */
export type FechaISO = string;
