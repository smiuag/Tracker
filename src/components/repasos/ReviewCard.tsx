"use client";

import { toast } from "sonner";
import { Check, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { completeReview, postponeReview } from "@/lib/services/reviews.service";
import { addDays, toFechaISO } from "@/lib/utils/date";
import type { ReviewWithTopic } from "@/lib/services/reviews.service";

interface ReviewCardProps {
  review: ReviewWithTopic;
}

function describeFecha(fechaProgramada: string): string {
  const today = toFechaISO(new Date());
  if (fechaProgramada === today) return "Hoy";
  if (fechaProgramada < today) return "Atrasado";
  if (fechaProgramada === addDays(today, 1)) return "Mañana";
  return `El ${fechaProgramada}`;
}

export function ReviewCard({ review }: ReviewCardProps) {
  async function handleComplete() {
    await completeReview(review.id, toFechaISO(new Date()));
    toast.success("Repaso completado");
  }

  async function handlePostpone() {
    await postponeReview(review.id, addDays(review.fechaProgramada, 1));
    toast.success("Repaso pospuesto un día");
  }

  return (
    <Card className="gap-2 py-3">
      <CardContent className="flex items-center justify-between gap-3 px-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{review.topicNombre}</p>
          <p className="text-xs text-muted-foreground">
            Repaso #{review.numeroRepaso} · {describeFecha(review.fechaProgramada)}
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <Button size="icon-sm" variant="outline" onClick={handlePostpone} aria-label="Posponer">
            <Clock className="size-4" />
          </Button>
          <Button size="icon-sm" onClick={handleComplete} aria-label="Completar">
            <Check className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
