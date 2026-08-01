"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { getReviewPattern } from "@/lib/services/reviews.service";

export function useReviewPattern() {
  return useLiveQuery(() => getReviewPattern(), []);
}
