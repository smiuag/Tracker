export type Nivel1a5 = 1 | 2 | 3 | 4 | 5;

export type TipoEstudio =
  | "lectura"
  | "resumen"
  | "esquema"
  | "test"
  | "repaso"
  | "fichas";

export type EstadoTema = "pendiente" | "en_progreso" | "acabado";

/** Fecha en formato "YYYY-MM-DD", clave de la mayoría de agregados diarios. */
export type FechaISO = string;
