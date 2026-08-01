"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { toFechaISO } from "@/lib/utils/date";
import { getPendingReviewsWithTopics } from "@/lib/services/reviews.service";

export function usePendingReviews() {
  return useLiveQuery(async () => {
    const today = toFechaISO(new Date());
    const reviews = await getPendingReviewsWithTopics();
    return {
      atrasados: reviews.filter((r) => r.fechaProgramada < today),
      hoy: reviews.filter((r) => r.fechaProgramada === today),
      proximos: reviews.filter((r) => r.fechaProgramada > today),
    };
  }, []);
}
