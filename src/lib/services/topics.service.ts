import { db } from "@/lib/db/db";
import { createId } from "@/lib/utils/id";
import type { Block, Subtopic, Topic } from "@/types/topic";

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

export type NewTopic = Pick<Topic, "blockId" | "nombre" | "dificultad" | "notas">;

export async function createTopic(input: NewTopic): Promise<Topic> {
  const now = new Date().toISOString();
  const topic: Topic = {
    id: createId(),
    blockId: input.blockId,
    nombre: input.nombre,
    estado: "no_iniciado",
    porcentaje: 0,
    dificultad: input.dificultad,
    notas: input.notas,
    patronRepasoId: null,
    tiempoInvertidoMin: 0,
    ultimoEstudio: null,
    createdAt: now,
    updatedAt: now,
  };
  await db.topics.add(topic);
  return topic;
}

export type TopicUpdate = Partial<
  Pick<Topic, "nombre" | "blockId" | "estado" | "porcentaje" | "dificultad" | "notas">
>;

export async function updateTopic(id: string, patch: TopicUpdate): Promise<void> {
  await db.topics.update(id, { ...patch, updatedAt: new Date().toISOString() });
}

export async function deleteTopic(id: string): Promise<void> {
  await db.transaction("rw", db.topics, db.subtopics, async () => {
    await db.topics.delete(id);
    await db.subtopics.where("topicId").equals(id).delete();
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
