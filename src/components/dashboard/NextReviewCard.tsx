import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { addDays, toFechaISO } from "@/lib/utils/date";
import type { NextReview } from "@/lib/services/stats.service";

interface NextReviewCardProps {
  review: NextReview | null;
}

function describeFecha(fecha: string): string {
  const today = toFechaISO(new Date());
  if (fecha === today) return "Hoy";
  if (fecha === addDays(today, -1)) return "Ayer (atrasado)";
  if (fecha === addDays(today, 1)) return "Mañana";
  return fecha < today ? "Atrasado" : `El ${fecha}`;
}

export function NextReviewCard({ review }: NextReviewCardProps) {
  return (
    <SectionCard title="Próximo repaso">
      {review ? (
        <Link
          href="/repasos"
          className="flex items-center gap-3 rounded-xl px-1 py-1 transition-colors hover:text-muted-foreground"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent">
            <RotateCcw className="size-4 text-foreground" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {review.topicNombre}
            </p>
            <p className="text-xs text-muted-foreground">
              {describeFecha(review.fechaProgramada)}
            </p>
          </div>
        </Link>
      ) : (
        <p className="text-sm text-muted-foreground">No tienes repasos pendientes.</p>
      )}
    </SectionCard>
  );
}
