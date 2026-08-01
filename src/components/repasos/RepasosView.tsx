"use client";

import { RotateCcw } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { usePendingReviews } from "@/hooks/useReviews";
import { ReviewList } from "./ReviewList";
import { ReviewPatternPicker } from "./ReviewPatternPicker";

export function RepasosView() {
  const reviews = usePendingReviews();

  if (!reviews) {
    return (
      <EmptyState
        icon={RotateCcw}
        title="Cargando…"
        description="Un momento mientras leemos tus datos locales."
      />
    );
  }

  const { atrasados, hoy, proximos } = reviews;
  const hasAny = atrasados.length + hoy.length + proximos.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {hasAny ? (
        <div className="flex flex-col gap-4">
          <ReviewList title="Atrasados" reviews={atrasados} />
          <ReviewList title="Hoy" reviews={hoy} />
          <ReviewList title="Próximos" reviews={proximos} />
        </div>
      ) : (
        <EmptyState
          icon={RotateCcw}
          title="No tienes repasos pendientes"
          description="Se programan automáticamente cada vez que registras una sesión de estudio sobre un tema."
        />
      )}
      <ReviewPatternPicker />
    </div>
  );
}
