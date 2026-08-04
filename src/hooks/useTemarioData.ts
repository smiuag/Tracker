"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/db";
import { parseTopicNumber } from "@/lib/utils/topicName";
import type { Topic } from "@/types/topic";

/** Por bloque (en su orden del temario) y dentro de cada bloque por número
 *  de tema; los temas sin prefijo "Tema N" van al final, alfabéticamente. */
function compareTopics(blockOrder: Map<string, number>) {
  return (a: Topic, b: Topic) => {
    const blockDiff = (blockOrder.get(a.blockId) ?? 0) - (blockOrder.get(b.blockId) ?? 0);
    if (blockDiff !== 0) return blockDiff;
    const numA = parseTopicNumber(a.nombre);
    const numB = parseTopicNumber(b.nombre);
    if (numA !== null && numB !== null) return numA - numB;
    if (numA !== null) return -1;
    if (numB !== null) return 1;
    return a.nombre.localeCompare(b.nombre, "es", { numeric: true });
  };
}

export function useTemarioData() {
  return useLiveQuery(async () => {
    const [blocks, topics] = await Promise.all([
      db.blocks.orderBy("orden").toArray(),
      db.topics.toArray(),
    ]);

    const blockOrder = new Map(blocks.map((b) => [b.id, b.orden]));
    topics.sort(compareTopics(blockOrder));

    return { blocks, topics };
  }, []);
}
