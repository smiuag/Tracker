/** Buckets de intensidad usados en el calendario tipo GitHub (Dashboard/Calendario). */
export type IntensityBucket = "0h" | "1h" | "2h" | "4h" | "6h+";

export function minutesToIntensityBucket(minutes: number): IntensityBucket {
  const hours = minutes / 60;
  if (hours <= 0) return "0h";
  if (hours < 2) return "1h";
  if (hours < 4) return "2h";
  if (hours < 6) return "4h";
  return "6h+";
}

/** Clases Tailwind por bucket, usando la paleta de marca (más intenso = más horas). */
export const INTENSITY_BUCKET_CLASSES: Record<IntensityBucket, string> = {
  "0h": "bg-secondary/40",
  "1h": "bg-primary/30",
  "2h": "bg-primary/55",
  "4h": "bg-primary/80",
  "6h+": "bg-primary",
};
