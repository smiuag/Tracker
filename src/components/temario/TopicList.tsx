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
    const knownIds = new Set(display.map((d) => d.topic.id));
    const kept = display.map((d) =>
      currentIds.has(d.topic.id)
        ? { topic: topics.find((t) => t.id === d.topic.id)!, leaving: false }
        : { ...d, leaving: true }
    );
    const added = topics
      .filter((t) => !knownIds.has(t.id))
      .map((topic) => ({ topic, leaving: false }));
    setDisplay([...kept, ...added]);
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
