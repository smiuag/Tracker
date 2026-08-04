import Dexie, { type EntityTable } from "dexie";
import type { Block, Topic, Subtopic } from "@/types/topic";
import type { StudySession, DailyLog, DailyAggregate } from "@/types/session";
import type { Badge, Setting } from "@/types/badge";
import type { DailyTask } from "@/types/task";

export const db = new Dexie("OpoFlowDB") as Dexie & {
  blocks: EntityTable<Block, "id">;
  topics: EntityTable<Topic, "id">;
  subtopics: EntityTable<Subtopic, "id">;
  studySessions: EntityTable<StudySession, "id">;
  dailyLogs: EntityTable<DailyLog, "fecha">;
  dailyAggregates: EntityTable<DailyAggregate, "fecha">;
  badges: EntityTable<Badge, "id">;
  settings: EntityTable<Setting, "key">;
  dailyTasks: EntityTable<DailyTask, "id">;
};

// Esquema completo declarado desde el inicio (aunque algunas tablas no se
// usen hasta fases posteriores) para evitar migraciones Dexie fase a fase.
//
// `reviews`, `reviewPatterns`, `testResults` y `goals` ya no las usa ningún
// código de la app (repasos con repetición espaciada, tracking de aciertos
// de test, y el CRUD manual de objetivos —sustituido por la configuración de
// settings.service.ts— se eliminaron), pero se mantienen declaradas aquí a
// propósito: borrar una tabla en Dexie borra sus datos, y no hay necesidad
// de arriesgar datos ya guardados en dispositivos reales por una tabla que
// simplemente deja de usarse. Quedan "dormidas".
db.version(1).stores({
  blocks: "id, orden",
  topics: "id, blockId, estado",
  subtopics: "id, topicId",
  studySessions: "id, topicId, fecha, tipo",
  reviews: "id, topicId, fechaProgramada, estado",
  reviewPatterns: "id",
  goals: "id, tipo, fechaInicio",
  testResults: "id, topicId, fecha",
  dailyLogs: "fecha",
  dailyAggregates: "fecha",
  badges: "id",
  settings: "key",
});

// v2: remapeo de valores (no borrado de datos) tras simplificar el modelo.
// `topics.estado` y `studySessions.tipo` cambian de nombre pero no de
// índice, así que no hace falta tocar `.stores()` — solo transformar el
// valor ya guardado en cada fila para que siga siendo reconocido por el
// código nuevo.
const ESTADO_TEMA_REMAP: Record<string, string> = {
  no_iniciado: "pendiente",
  en_progreso: "empezado",
  completado: "acabado",
};

const TIPO_ESTUDIO_REMAP: Record<string, string> = {
  memorizacion: "resumen",
  legislacion: "fichas",
};

db.version(2)
  .stores({})
  .upgrade(async (tx) => {
    await tx
      .table("topics")
      .toCollection()
      .modify((topic) => {
        const next = ESTADO_TEMA_REMAP[topic.estado];
        if (next) topic.estado = next;
      });

    await tx
      .table("studySessions")
      .toCollection()
      .modify((session) => {
        const next = TIPO_ESTUDIO_REMAP[session.tipo];
        if (next) session.tipo = next;
      });
  });

// v3: tabla nueva (aditiva, sin datos previos que transformar).
db.version(3).stores({
  dailyTasks: "id, fecha",
});

// v4: el temario pasa de 5 estados (con "vueltas") a 3 (pendiente / en
// progreso / acabado) tras feedback pidiendo un modelo más simple.
db.version(4)
  .stores({})
  .upgrade(async (tx) => {
    await tx
      .table("topics")
      .toCollection()
      .modify((topic) => {
        if (topic.estado === "empezado" || topic.estado === "segunda_vuelta" || topic.estado === "tercera_vuelta") {
          topic.estado = "en_progreso";
        }
      });
  });
