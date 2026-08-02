import type { TipoEstudio } from "@/types/common";

export const STUDY_TYPE_LABELS: Record<TipoEstudio, string> = {
  lectura: "Lectura",
  resumen: "Resumen",
  esquema: "Esquema",
  test: "Test",
  repaso: "Repaso",
  fichas: "Fichas",
};

export const STUDY_TYPES: TipoEstudio[] = Object.keys(
  STUDY_TYPE_LABELS
) as TipoEstudio[];
