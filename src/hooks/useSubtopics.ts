"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/db";

export function useSubtopics(topicId: string | null) {
  return useLiveQuery(
    () => (topicId ? db.subtopics.where("topicId").equals(topicId).sortBy("orden") : []),
    [topicId]
  );
}
