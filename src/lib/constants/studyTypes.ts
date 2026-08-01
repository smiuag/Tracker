import type { TipoEstudio } from "@/types/common";

export const STUDY_TYPE_LABELS: Record<TipoEstudio, string> = {
  lectura: "Lectura",
  esquema: "Esquema",
  memorizacion: "Memorización",
  test: "Test",
  repaso: "Repaso",
  legislacion: "Legislación",
};

export const STUDY_TYPES: TipoEstudio[] = Object.keys(
  STUDY_TYPE_LABELS
) as TipoEstudio[];
