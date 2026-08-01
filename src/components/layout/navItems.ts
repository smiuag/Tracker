import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Sun, BookOpen, RotateCcw, BarChart3, Settings } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Orden y contenido según la sección "Navegación" del claude.md.
// "Objetivos" no tiene icono propio en la barra: se gestiona desde
// Configuración y se enlaza desde las tarjetas del Dashboard (UX: <3 clics).
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hoy", label: "Hoy", icon: Sun },
  { href: "/temario", label: "Temario", icon: BookOpen },
  { href: "/repasos", label: "Repasos", icon: RotateCcw },
  { href: "/estadisticas", label: "Estadísticas", icon: BarChart3 },
  { href: "/configuracion", label: "Configuración", icon: Settings },
];
