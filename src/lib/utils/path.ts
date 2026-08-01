/**
 * trailingSlash:true (requerido por el export estático) hace que
 * usePathname() devuelva "/hoy/" en vez de "/hoy". Normaliza antes de
 * comparar con hrefs sin barra final.
 */
export function normalizePathname(pathname: string): string {
  return pathname === "/" ? "/" : pathname.replace(/\/$/, "");
}
