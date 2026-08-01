"use client";

import { Target } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { useGoals } from "@/hooks/useGoals";
import { GoalCard } from "./GoalCard";
import { NewGoalSheet } from "./NewGoalSheet";
import type { Goal } from "@/types/goal";
import type { TipoObjetivo } from "@/types/common";

const TIPO_ORDER: TipoObjetivo[] = ["diario", "semanal", "mensual", "anual"];
const TIPO_LABELS: Record<TipoObjetivo, string> = {
  diario: "Diarios",
  semanal: "Semanales",
  mensual: "Mensuales",
  anual: "Anuales",
};

export function ObjetivosView() {
  const goals = useGoals();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <NewGoalSheet />
      </div>

      {!goals ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Aún no tienes objetivos"
          description="Crea uno diario, semanal, mensual o anual con el botón 'Nuevo objetivo'."
        />
      ) : (
        TIPO_ORDER.map((tipo) => {
          const goalsForTipo = goals.filter((g: Goal) => g.tipo === tipo);
          if (goalsForTipo.length === 0) return null;
          return (
            <div key={tipo}>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {TIPO_LABELS[tipo]}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {goalsForTipo.map((goal: Goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
