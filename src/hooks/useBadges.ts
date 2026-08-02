"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/db";

export function useBadges() {
  return useLiveQuery(() => db.badges.toArray(), []);
}
