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
