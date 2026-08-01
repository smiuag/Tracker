"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/db";

export function useBlocks() {
  return useLiveQuery(() => db.blocks.orderBy("orden").toArray(), []);
}
