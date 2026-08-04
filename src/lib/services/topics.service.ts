import { db } from "@/lib/db/db";
import { createId } from "@/lib/utils/id";
import { evaluateTopicBadges } from "./badges.service";
import { toFechaISO } from "@/lib/utils/date";
import type { Block, Subtopic, Topic } from "@/types/topic";
import type { EstadoTema } from "@/types/common";

const BLOCK_COLORS = ["#CAD7C5", "#E7D9D4", "#E9E1D3", "#A9BBA1", "#C9AFA6"];

export async function listBlocks(): Promise<Block[]> {
  return db.blocks.orderBy("orden").toArray();
}

export async function createBlock(nombre: string): Promise<Block> {
  const orden = await db.blocks.count();
  const block: Block = {
    id: createId(),
    nombre,
    color: BLOCK_COLORS[orden % BLOCK_COLORS.length],
    orden,
  };
  await db.blocks.add(block);
  return block;
}

export type NewTopic = Pick<Topic, "blockId" | "nombre" | "notas">;

export async function createTopic(input: NewTopic): Promise<Topic> {
  const now = new Date().toISOString();
  const topic: Topic = {
    id: createId(),
    blockId: input.blockId,
    nombre: input.nombre,
    estado: "pendiente",
    porcentaje: 0,
    notas: input.notas,
    tiempoInvertidoMin: 0,
    ultimoEstudio: null,
    createdAt: now,
    updatedAt: now,
  };
  await db.topics.add(topic);
  return topic;
}

export interface NewTopicRow {
  nombre: string;
  estado: EstadoTema;
  /** Horas ya dedicadas antes de crear el tema, convertidas a minutos. */
  tiempoInvertidoMin: number;
  notas: string;
}

/**
 * Crea un bloque y todos sus temas de una vez (alta masiva), como se hace al
 * introducir un temario completo por primera vez. Todo o nada: si falla la
 * inserción de un tema no se crea el bloque a medias.
 */
export async function createBlockWithTopics(blockNombre: string, rows: NewTopicRow[]): Promise<Block> {
  const now = new Date().toISOString();
  return db.transaction("rw", db.blocks, db.topics, async () => {
    const orden = await db.blocks.count();
    const block: Block = {
      id: createId(),
      nombre: blockNombre,
      color: BLOCK_COLORS[orden % BLOCK_COLORS.length],
      orden,
    };
    await db.blocks.add(block);

    const topics: Topic[] = rows.map((row) => ({
      id: createId(),
      blockId: block.id,
      nombre: row.nombre,
      estado: row.estado,
      porcentaje: row.estado === "acabado" ? 100 : 0,
      notas: row.notas,
      tiempoInvertidoMin: row.tiempoInvertidoMin,
      ultimoEstudio: null,
      createdAt: now,
      updatedAt: now,
    }));
    await db.topics.bulkAdd(topics);

    return block;
  });
}

export type TopicUpdate = Partial<
  Pick<Topic, "nombre" | "blockId" | "estado" | "porcentaje" | "notas">
>;

export async function updateTopic(id: string, patch: TopicUpdate): Promise<void> {
  await db.topics.update(id, { ...patch, updatedAt: new Date().toISOString() });
  if (patch.estado) {
    await evaluateTopicBadges(id, toFechaISO(new Date()));
  }
}

export async function deleteTopic(id: string): Promise<void> {
  await db.transaction("rw", db.topics, db.subtopics, async () => {
    await db.topics.delete(id);
    await db.subtopics.where("topicId").equals(id).delete();
  });
}

/** Elimina un bloque junto con todos sus temas y subtemas (p. ej. uno creado por error). */
export async function deleteBlock(id: string): Promise<void> {
  await db.transaction("rw", db.blocks, db.topics, db.subtopics, async () => {
    const topicIds = await db.topics.where("blockId").equals(id).primaryKeys();
    await db.subtopics.where("topicId").anyOf(topicIds).delete();
    await db.topics.where("blockId").equals(id).delete();
    await db.blocks.delete(id);
  });
}

export async function listSubtopics(topicId: string): Promise<Subtopic[]> {
  return db.subtopics.where("topicId").equals(topicId).sortBy("orden");
}

export async function addSubtopic(topicId: string, nombre: string): Promise<Subtopic> {
  const orden = await db.subtopics.where("topicId").equals(topicId).count();
  const subtopic: Subtopic = { id: createId(), topicId, nombre, completado: false, orden };
  await db.subtopics.add(subtopic);
  return subtopic;
}

export async function toggleSubtopic(id: string, completado: boolean): Promise<void> {
  await db.subtopics.update(id, { completado });
}

export async function deleteSubtopic(id: string): Promise<void> {
  await db.subtopics.delete(id);
}
