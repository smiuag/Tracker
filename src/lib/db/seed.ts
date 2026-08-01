import { db } from "./db";
import { createId } from "@/lib/utils/id";
import { toFechaISO, addDays } from "@/lib/utils/date";
import { DEFAULT_REVIEW_PATTERN } from "@/lib/constants/reviewPatterns";
import type { Block, Topic, Subtopic } from "@/types/topic";
import type { StudySession, DailyAggregate } from "@/types/session";
import type { Review } from "@/types/review";
import type { Goal } from "@/types/goal";
import type { TestResult } from "@/types/test";

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
      estado: "completado",
      porcentaje: 100,
      dificultad: 3,
      notas: "Repasar título preliminar antes del simulacro.",
      patronRepasoId: null,
      tiempoInvertidoMin: 0,
      ultimoEstudio: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: createId(),
      blockId: blocks[0].id,
      nombre: "Tema 2. Derechos y deberes fundamentales",
      estado: "en_progreso",
      porcentaje: 60,
      dificultad: 4,
      notas: "",
      patronRepasoId: null,
      tiempoInvertidoMin: 0,
      ultimoEstudio: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: createId(),
      blockId: blocks[1].id,
      nombre: "Tema 3. La Administración General del Estado",
      estado: "en_progreso",
      porcentaje: 35,
      dificultad: 3,
      notas: "",
      patronRepasoId: null,
      tiempoInvertidoMin: 0,
      ultimoEstudio: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: createId(),
      blockId: blocks[1].id,
      nombre: "Tema 4. El acto administrativo",
      estado: "no_iniciado",
      porcentaje: 0,
      dificultad: 2,
      notas: "",
      patronRepasoId: null,
      tiempoInvertidoMin: 0,
      ultimoEstudio: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: createId(),
      blockId: blocks[2].id,
      nombre: "Tema 5. El procedimiento administrativo común",
      estado: "en_progreso",
      porcentaje: 20,
      dificultad: 5,
      notas: "Es el tema que más me cuesta, dedicar más sesiones.",
      patronRepasoId: null,
      tiempoInvertidoMin: 0,
      ultimoEstudio: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: createId(),
      blockId: blocks[2].id,
      nombre: "Tema 6. Los contratos del sector público",
      estado: "no_iniciado",
      porcentaje: 0,
      dificultad: 4,
      notas: "",
      patronRepasoId: null,
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
    energia: StudySession["energia"];
    concentracion: StudySession["concentracion"];
    pomodoros: number;
    observaciones: string;
  }> = [
    { daysAgo: 0, topicIndex: 4, tipo: "lectura", horaInicio: "09:00", minutos: 50, energia: 4, concentracion: 4, pomodoros: 2, observaciones: "Buen enfoque por la mañana." },
    { daysAgo: 0, topicIndex: 4, tipo: "esquema", horaInicio: "10:00", minutos: 40, energia: 4, concentracion: 5, pomodoros: 2, observaciones: "" },
    { daysAgo: 1, topicIndex: 1, tipo: "test", horaInicio: "18:00", minutos: 45, energia: 3, concentracion: 3, pomodoros: 2, observaciones: "Me distraje un poco." },
    { daysAgo: 2, topicIndex: 2, tipo: "lectura", horaInicio: "09:30", minutos: 60, energia: 4, concentracion: 4, pomodoros: 2, observaciones: "" },
    { daysAgo: 3, topicIndex: 2, tipo: "esquema", horaInicio: "17:00", minutos: 35, energia: 3, concentracion: 3, pomodoros: 1, observaciones: "" },
    { daysAgo: 4, topicIndex: 1, tipo: "repaso", horaInicio: "09:00", minutos: 30, energia: 4, concentracion: 4, pomodoros: 1, observaciones: "" },
    { daysAgo: 6, topicIndex: 0, tipo: "test", horaInicio: "19:00", minutos: 50, energia: 3, concentracion: 4, pomodoros: 2, observaciones: "" },
    { daysAgo: 7, topicIndex: 4, tipo: "lectura", horaInicio: "09:00", minutos: 70, energia: 5, concentracion: 5, pomodoros: 3, observaciones: "Mejor sesión de la semana." },
    { daysAgo: 8, topicIndex: 2, tipo: "legislacion", horaInicio: "10:15", minutos: 40, energia: 3, concentracion: 3, pomodoros: 1, observaciones: "" },
    { daysAgo: 10, topicIndex: 1, tipo: "memorizacion", horaInicio: "18:30", minutos: 30, energia: 2, concentracion: 3, pomodoros: 1, observaciones: "Poca energía por la tarde." },
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
      energia: plan.energia,
      concentracion: plan.concentracion,
      pomodoros: plan.pomodoros,
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

  const reviews: Review[] = [
    {
      id: createId(),
      topicId: topics[1].id,
      origenSessionId: null,
      numeroRepaso: 1,
      fechaProgramada: today,
      fechaCompletada: null,
      estado: "pendiente",
    },
    {
      id: createId(),
      topicId: topics[4].id,
      origenSessionId: null,
      numeroRepaso: 1,
      fechaProgramada: addDays(today, 1),
      fechaCompletada: null,
      estado: "pendiente",
    },
    {
      id: createId(),
      topicId: topics[0].id,
      origenSessionId: null,
      numeroRepaso: 1,
      fechaProgramada: addDays(today, -2),
      fechaCompletada: addDays(today, -2),
      estado: "completado",
    },
  ];

  const goals: Goal[] = [
    {
      id: createId(),
      tipo: "semanal",
      metrica: "horas",
      valorObjetivo: 20,
      valorActual: Array.from(dailyAggregateMap.values()).reduce((sum, a) => sum + a.minutosTotales, 0) / 60,
      fechaInicio: addDays(today, -6),
      fechaFin: today,
    },
    {
      id: createId(),
      tipo: "diario",
      metrica: "horas",
      valorObjetivo: 3,
      valorActual: (dailyAggregateMap.get(today)?.minutosTotales ?? 0) / 60,
      fechaInicio: today,
      fechaFin: today,
    },
  ];

  const testResults: TestResult[] = [
    {
      id: createId(),
      topicId: topics[1].id,
      fecha: addDays(today, -1),
      aciertos: 18,
      errores: 4,
      totalPreguntas: 22,
      notas: "",
    },
    {
      id: createId(),
      topicId: topics[0].id,
      fecha: addDays(today, -6),
      aciertos: 20,
      errores: 2,
      totalPreguntas: 22,
      notas: "Muy buen resultado.",
    },
  ];

  await db.transaction(
    "rw",
    [db.blocks, db.topics, db.subtopics, db.studySessions, db.dailyAggregates, db.reviews, db.reviewPatterns, db.goals, db.testResults],
    async () => {
      await db.blocks.bulkAdd(blocks);
      await db.topics.bulkAdd(topics);
      await db.subtopics.bulkAdd(subtopics);
      await db.studySessions.bulkAdd(sessions);
      await db.dailyAggregates.bulkAdd(Array.from(dailyAggregateMap.values()));
      await db.reviews.bulkAdd(reviews);
      await db.reviewPatterns.put(DEFAULT_REVIEW_PATTERN);
      await db.goals.bulkAdd(goals);
      await db.testResults.bulkAdd(testResults);
    }
  );
}

function fromFechaISOLocal(fecha: string): number {
  const [year, month, day] = fecha.split("-").map(Number);
  return new Date(year, month - 1, day).getTime();
}
