"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/db";

export function useTopics() {
  // "nombre" no está indexado en el esquema Dexie (no hace falta para el
  // volumen esperado): se ordena en memoria tras leer la tabla completa.
  // `numeric: true` para que "Tema 2" vaya antes que "Tema 10".
  return useLiveQuery(
    async () =>
      (await db.topics.toArray()).sort((a, b) =>
        a.nombre.localeCompare(b.nombre, "es", { numeric: true })
      ),
    []
  );
}
