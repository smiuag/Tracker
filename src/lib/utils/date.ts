import type { FechaISO } from "@/types/common";

export function toFechaISO(date: Date): FechaISO {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromFechaISO(fecha: FechaISO): Date {
  const [year, month, day] = fecha.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(fecha: FechaISO, days: number): FechaISO {
  const date = fromFechaISO(fecha);
  date.setDate(date.getDate() + days);
  return toFechaISO(date);
}

/** Lunes de la semana ISO a la que pertenece `fecha`. */
export function startOfIsoWeek(fecha: FechaISO): FechaISO {
  const date = fromFechaISO(fecha);
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diffToMonday);
  return toFechaISO(date);
}

/** Las 7 fechas (lunes a domingo) de la semana ISO de `fecha`. */
export function isoWeekDates(fecha: FechaISO): FechaISO[] {
  const monday = startOfIsoWeek(fecha);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export function startOfMonth(fecha: FechaISO): FechaISO {
  const date = fromFechaISO(fecha);
  return toFechaISO(new Date(date.getFullYear(), date.getMonth(), 1));
}

export function endOfMonth(fecha: FechaISO): FechaISO {
  const date = fromFechaISO(fecha);
  return toFechaISO(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

/** Días naturales entre dos fechas ISO (positivo si `to` es posterior a `from`). */
export function daysBetween(from: FechaISO, to: FechaISO): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((fromFechaISO(to).getTime() - fromFechaISO(from).getTime()) / msPerDay);
}

export function minutesToHoursLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} h`;
  return `${hours} h ${mins} min`;
}
