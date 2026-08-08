"use client";

import { useEffect, useState } from "react";
import { TopicCard } from "./TopicCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Block, Topic } from "@/types/topic";

interface TopicListProps {
  topics: Topic[];
  blocks: Block[];
  onSelect: (topic: Topic) => void;
}

interface DisplayItem {
  topic: Topic;
  /** En retirada: sigue en pantalla desvaneciéndose antes de eliminarse. */
  leaving: boolean;
}

const EXIT_MS = 300;

export function TopicList({ topics, blocks, onSelect }: TopicListProps) {
  const blockById = new Map(blocks.map((b) => [b.id, b]));

  // Salida suave: cuando un tema deja de cumplir el filtro (p. ej. al cambiar
  // su estado), su tarjeta no desaparece de golpe — se mantiene un instante
  // desvaneciéndose y luego se retira. Evita la sensación de parpadeo/fallo.
  const [display, setDisplay] = useState<DisplayItem[]>(() =>
    topics.map((topic) => ({ topic, leaving: false }))
  );
  const [lastTopics, setLastTopics] = useState(topics);
  if (topics !== lastTopics) {
    setLastTopics(topics);
    const currentIds = new Set(topics.map((t) => t.id));
    // La base es SIEMPRE el orden actual del temario (bloque + nº de tema)…
    const next: DisplayItem[] = topics.map((topic) => ({ topic, leaving: false }));
    // …y cada tarjeta saliente se reinserta en su hueco anterior mientras se
    // desvanece: delante del primer vecino que siga presente.
    const leavingNow = display.filter((d) => !currentIds.has(d.topic.id) && !d.leaving);
    for (const item of leavingNow) {
      const prevIndex = display.findIndex((d) => d.topic.id === item.topic.id);
      let insertAt = next.length;
      for (let i = prevIndex + 1; i < display.length; i++) {
        const idx = next.findIndex((n) => n.topic.id === display[i].topic.id);
        if (idx !== -1) {
          insertAt = idx;
          break;
        }
      }
      next.splice(insertAt, 0, { ...item, leaving: true });
    }
    setDisplay(next);
  }

  const anyLeaving = display.some((d) => d.leaving);
  useEffect(() => {
    if (!anyLeaving) return;
    const timer = setTimeout(
      () => setDisplay((current) => current.filter((d) => !d.leaving)),
      EXIT_MS
    );
    return () => clearTimeout(timer);
  }, [anyLeaving, display]);

  if (topics.length === 0 && !anyLeaving) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Sin temas todavía"
        description="Crea tu primer tema con el botón 'Nuevo tema' para empezar a organizar tu temario."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {display.map(({ topic, leaving }) => (
        <div
          key={topic.id}
          className={cn(
            "transition-all duration-300 ease-out",
            leaving && "pointer-events-none scale-95 opacity-0"
          )}
        >
          <TopicCard
            topic={topic}
            block={blockById.get(topic.blockId)}
            onClick={() => onSelect(topic)}
          />
        </div>
      ))}
    </div>
  );
}
