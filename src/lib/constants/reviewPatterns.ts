import type { ReviewPattern } from "@/types/review";

export const DEFAULT_REVIEW_PATTERN_ID = "pattern-default";

export const DEFAULT_REVIEW_PATTERN: ReviewPattern = {
  id: DEFAULT_REVIEW_PATTERN_ID,
  nombre: "1-3-7-15-30",
  dias: [1, 3, 7, 15, 30],
  esDefault: true,
};
