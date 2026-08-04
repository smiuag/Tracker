const TEMA_PREFIX_RE = /^tema\s*(\d+)/i;

/** Número parseado de un nombre tipo "Tema 12. …", o null si no lo lleva. */
export function parseTopicNumber(nombre: string): number | null {
  const match = nombre.match(TEMA_PREFIX_RE);
  return match ? Number(match[1]) : null;
}

/**
 * Compone el nombre final de un tema a partir de su número y el título
 * opcional escrito por el usuario. Si el usuario ya escribió su propio
 * prefijo "Tema N", se respeta tal cual.
 */
export function composeTopicName(numero: number, title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return `Tema ${numero}`;
  if (TEMA_PREFIX_RE.test(trimmed)) return trimmed;
  return `Tema ${numero}. ${trimmed}`;
}
