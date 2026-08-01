import Dexie, { type EntityTable } from "dexie";
import type { Block, Topic, Subtopic } from "@/types/topic";
import type { StudySession, DailyLog, DailyAggregate } from "@/types/session";
import type { Review, ReviewPattern } from "@/types/review";
import type { Goal } from "@/types/goal";
import type { TestResult } from "@/types/test";
import type { Badge, Setting } from "@/types/badge";

export const db = new Dexie("OpoFlowDB") as Dexie & {
  blocks: EntityTable<Block, "id">;
  topics: EntityTable<Topic, "id">;
  subtopics: EntityTable<Subtopic, "id">;
  studySessions: EntityTable<StudySession, "id">;
  reviews: EntityTable<Review, "id">;
  reviewPatterns: EntityTable<ReviewPattern, "id">;
  goals: EntityTable<Goal, "id">;
  testResults: EntityTable<TestResult, "id">;
  dailyLogs: EntityTable<DailyLog, "fecha">;
  dailyAggregates: EntityTable<DailyAggregate, "fecha">;
  badges: EntityTable<Badge, "id">;
  settings: EntityTable<Setting, "key">;
};

// Esquema completo declarado desde el inicio (aunque algunas tablas no se
// usen hasta fases posteriores) para evitar migraciones Dexie fase a fase.
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
