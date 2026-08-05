import type { TipoEstudio } from "@/types/common";

export const STUDY_TYPE_LABELS: Record<TipoEstudio, string> = {
  lectura: "Lectura",
  estudio: "Estudio",
  test: "Test",
  otros: "Otros",
};

export const STUDY_TYPES: TipoEstudio[] = Object.keys(
  STUDY_TYPE_LABELS
) as TipoEstudio[];

/** Color fijo por tipo de estudio, compartido por todas las gráficas para que
 *  la misma actividad se pinte igual en todas. (chart-3 se omite: es casi
 *  idéntico al fondo de tarjeta y no se distinguiría.) */
export const STUDY_TYPE_COLORS: Record<TipoEstudio, string> = {
  lectura: "var(--chart-1)",
  estudio: "var(--chart-2)",
  test: "var(--chart-4)",
  otros: "var(--chart-5)",
};
