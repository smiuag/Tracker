"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/db";
import { parseTopicNumber } from "@/lib/utils/topicName";

/**
 * Siguiente número de tema dentro de un bloque: el mayor "Tema N" existente
 * más uno, o el nº de temas más uno si ninguno lleva prefijo numérico.
 * Con `blockId` null (bloque aún sin crear) el siguiente es siempre 1.
 */
export function useNextTopicNumber(blockId: string | null): number {
  return (
    useLiveQuery(async () => {
      if (!blockId) return 1;
      const topics = await db.topics.where("blockId").equals(blockId).toArray();
      const numbers = topics
        .map((t) => parseTopicNumber(t.nombre))
        .filter((n): n is number => n !== null);
      return numbers.length > 0 ? Math.max(...numbers) + 1 : topics.length + 1;
    }, [blockId]) ?? 1
  );
}
