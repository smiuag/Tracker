import { db } from "./db";
import { createId } from "@/lib/utils/id";
import { toFechaISO, addDays } from "@/lib/utils/date";
import type { Block, Topic, Subtopic } from "@/types/topic";
import type { StudySession, DailyAggregate } from "@/types/session";
import type { GoalConfig } from "@/types/settings";

/** Solo para desarrollo: puebla la base local con datos de ejemplo si está vacía. */
export async function seedDatabaseIfEmpty(): Promise<void> {
  const blockCount = await db.blocks.count();
  if (blockCount > 0) return;

  const now = new Date();
  const today = toFechaISO(now);
  const nowIso = now.toISOString();

  const blocks: Block[] = [
    { id: createId(), nombre: "Derecho Constitucional", color: "#CAD7C5", orden: 0 },
    { id: createId(), nombre: "Organización Administrativa", color: "#E7D9D4", orden: 1 },
    { id: createId(), nombre: "Gestión y Procedimiento", color: "#E9E1D3", orden: 2 },
  ];

  const topics: Topic[] = [
    {
      id: createId(),
      blockId: blocks[0].id,
      nombre: "Tema 1. La Constitución Española de 1978",
      estado: "acabado",
      porcentaje: 100,
      notas: "Repasar título preliminar antes del simulacro.",
      tiempoInvertidoMin: 0,
      ultimoEstudio: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: createId(),
      blockId: blocks[0].id,
      nombre: "Tema 2. Derechos y deberes fundamentales",
      estado: "empezado",
      porcentaje: 60,
      notas: "",
      tiempoInvertidoMin: 0,
      ultimoEstudio: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: createId(),
      blockId: blocks[1].id,
      nombre: "Tema 3. La Administración General del Estado",
      estado: "empezado",
      porcentaje: 35,
      notas: "",
      tiempoInvertidoMin: 0,
      ultimoEstudio: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: createId(),
      blockId: blocks[1].id,
      nombre: "Tema 4. El acto administrativo",
      estado: "pendiente",
      porcentaje: 0,
      notas: "",
      tiempoInvertidoMin: 0,
      ultimoEstudio: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: createId(),
      blockId: blocks[2].id,
      nombre: "Tema 5. El procedimiento administrativo común",
      estado: "empezado",
      porcentaje: 20,
      notas: "Es el tema que más me cuesta, dedicar más sesiones.",
      tiempoInvertidoMin: 0,
      ultimoEstudio: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: createId(),
      blockId: blocks[2].id,
      nombre: "Tema 6. Los contratos del sector público",
      estado: "pendiente",
      porcentaje: 0,
      notas: "",
      tiempoInvertidoMin: 0,
      ultimoEstudio: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ];

  const subtopics: Subtopic[] = [
    { id: createId(), topicId: topics[1].id, nombre: "Derechos fundamentales (art. 14-29)", completado: true, orden: 0 },
    { id: createId(), topicId: topics[1].id, nombre: "Garantías y suspensión de derechos", completado: false, orden: 1 },
    { id: createId(), topicId: topics[4].id, nombre: "Fases del procedimiento", completado: true, orden: 0 },
    { id: createId(), topicId: topics[4].id, nombre: "Recursos administrativos", completado: false, orden: 1 },
    { id: createId(), topicId: topics[4].id, nombre: "Silencio administrativo", completado: false, orden: 2 },
  ];

  // Sesiones de estudio de los últimos 12 días (con algún hueco para que la racha sea realista).
  const sessionPlan: Array<{
    daysAgo: number;
    topicIndex: number | null;
    tipo: StudySession["tipo"];
    horaInicio: string;
    minutos: number;
    observaciones: string;
  }> = [
    { daysAgo: 0, topicIndex: 4, tipo: "lectura", horaInicio: "09:00", minutos: 50, observaciones: "Buen enfoque por la mañana." },
    { daysAgo: 0, topicIndex: 4, tipo: "esquema", horaInicio: "10:00", minutos: 40, observaciones: "" },
    { daysAgo: 1, topicIndex: 1, tipo: "test", horaInicio: "18:00", minutos: 45, observaciones: "Me distraje un poco." },
    { daysAgo: 2, topicIndex: 2, tipo: "lectura", horaInicio: "09:30", minutos: 60, observaciones: "" },
    { daysAgo: 3, topicIndex: 2, tipo: "esquema", horaInicio: "17:00", minutos: 35, observaciones: "" },
    { daysAgo: 4, topicIndex: 1, tipo: "repaso", horaInicio: "09:00", minutos: 30, observaciones: "" },
    { daysAgo: 6, topicIndex: 0, tipo: "test", horaInicio: "19:00", minutos: 50, observaciones: "" },
    { daysAgo: 7, topicIndex: 4, tipo: "lectura", horaInicio: "09:00", minutos: 70, observaciones: "Mejor sesión de la semana." },
    { daysAgo: 8, topicIndex: 2, tipo: "fichas", horaInicio: "10:15", minutos: 40, observaciones: "" },
    { daysAgo: 10, topicIndex: 1, tipo: "resumen", horaInicio: "18:30", minutos: 30, observaciones: "Poca energía por la tarde." },
  ];

  const sessions: StudySession[] = sessionPlan.map((plan) => {
    const fecha = addDays(today, -plan.daysAgo);
    const [h, m] = plan.horaInicio.split(":").map(Number);
    const inicio = new Date(fromFechaISOLocal(fecha));
    inicio.setHours(h, m, 0, 0);
    const fin = new Date(inicio.getTime() + plan.minutos * 60_000);
    return {
      id: createId(),
      topicId: plan.topicIndex === null ? null : topics[plan.topicIndex].id,
      tipo: plan.tipo,
      inicio: inicio.toISOString(),
      fin: fin.toISOString(),
      duracionMin: plan.minutos,
      fecha,
      observaciones: plan.observaciones,
    };
  });

  const dailyAggregateMap = new Map<string, DailyAggregate>();
  for (const session of sessions) {
    const existing = dailyAggregateMap.get(session.fecha);
    if (existing) {
      existing.minutosTotales += session.duracionMin;
      existing.sesiones += 1;
    } else {
      dailyAggregateMap.set(session.fecha, {
        fecha: session.fecha,
        minutosTotales: session.duracionMin,
        sesiones: 1,
      });
    }
  }

  for (const topic of topics) {
    const topicSessions = sessions.filter((s) => s.topicId === topic.id);
    topic.tiempoInvertidoMin = topicSessions.reduce((sum, s) => sum + s.duracionMin, 0);
    topic.ultimoEstudio =
      topicSessions.length > 0
        ? topicSessions.reduce((latest, s) => (s.fecha > latest ? s.fecha : latest), topicSessions[0].fecha)
        : null;
  }

  const goalConfig: GoalConfig = {
    weekdaysMode: "todos",
    customWeekdays: [],
    hoursPerDay: 3,
    topicsPerWeek: null,
    fechaExamen: null,
  };

  await db.transaction(
    "rw",
    [db.blocks, db.topics, db.subtopics, db.studySessions, db.dailyAggregates, db.settings],
    async () => {
      await db.blocks.bulkAdd(blocks);
      await db.topics.bulkAdd(topics);
      await db.subtopics.bulkAdd(subtopics);
      await db.studySessions.bulkAdd(sessions);
      await db.dailyAggregates.bulkAdd(Array.from(dailyAggregateMap.values()));
      await db.settings.put({ key: "goalConfig", value: goalConfig });
    }
  );
}

function fromFechaISOLocal(fecha: string): number {
  const [year, month, day] = fecha.split("-").map(Number);
  return new Date(year, month - 1, day).getTime();
}
