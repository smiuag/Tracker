"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { getTopicProgressBreakdown } from "@/lib/services/stats.service";

interface TopicsPaceHintProps {
  /** Valor del campo "Temas por semana" tal y como se está tecleando. */
  topicsPerWeek: string;
}

/**
 * Estimación de cuándo se completa una vuelta al temario al ritmo configurado.
 * Los temas pendientes cuentan como tema completo (sin empezar) y los que están
 * en progreso como medio tema (leídos pero aún no estudiados).
 */
export function TopicsPaceHint({ topicsPerWeek }: TopicsPaceHintProps) {
  const breakdown = useLiveQuery(() => getTopicProgressBreakdown(), []);
  const perWeek = Number(topicsPerWeek);
  if (!breakdown || !Number.isFinite(perWeek) || perWeek <= 0) return null;

  const restantes = breakdown.pendientes + breakdown.enCurso;
  if (restantes <= 0) return null;

  const temasEquivalentes = breakdown.pendientes + breakdown.enCurso * 0.5;
  const dias = Math.ceil((temasEquivalentes / perWeek) * 7);
  const objetivo = new Date();
  objetivo.setDate(objetivo.getDate() + dias);
  const fecha = objetivo.toLocaleDateString("es-ES", { day: "numeric", month: "long" });

  return (
    <p className="mt-1.5 text-xs text-muted-foreground">
      A este ritmo darás una vuelta completa a los {restantes} temas que te
      quedan en unos {dias} días (hacia el {fecha}), contando los temas en
      progreso como medio tema. Es orientativo: no todos los temas tienen la
      misma extensión.
    </p>
  );
}
