"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/db";
import type { FechaISO } from "@/types/common";

export function useTemarioData() {
  return useLiveQuery(async () => {
    const [blocks, topics, pendingReviews] = await Promise.all([
      db.blocks.orderBy("orden").toArray(),
      db.topics.toArray(),
      db.reviews.where("estado").equals("pendiente").sortBy("fechaProgramada"),
    ]);

    const nextReviewByTopic = new Map<string, FechaISO>();
    for (const review of pendingReviews) {
      if (!nextReviewByTopic.has(review.topicId)) {
        nextReviewByTopic.set(review.topicId, review.fechaProgramada);
      }
    }

    return { blocks, topics, nextReviewByTopic };
  }, []);
}
