"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/db";

export function useTemarioData() {
  return useLiveQuery(async () => {
    const [blocks, topics] = await Promise.all([
      db.blocks.orderBy("orden").toArray(),
      db.topics.toArray(),
    ]);

    return { blocks, topics };
  }, []);
}
