"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { useTemarioData } from "@/hooks/useTemarioData";
import { BlockFilterTabs, ALL_BLOCKS_VALUE } from "./BlockFilterTabs";
import { TopicList } from "./TopicList";
import { NewBlockSheet } from "./NewBlockSheet";
import { NewTopicSheet } from "./NewTopicSheet";
import { TopicDetailSheet } from "./TopicDetailSheet";
import type { Topic } from "@/types/topic";

export function TemarioView() {
  const data = useTemarioData();
  const [selectedBlock, setSelectedBlock] = useState(ALL_BLOCKS_VALUE);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  if (!data) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Cargando…"
        description="Un momento mientras leemos tus datos locales."
      />
    );
  }

  const { blocks, topics } = data;
  const filteredTopics =
    selectedBlock === ALL_BLOCKS_VALUE ? topics : topics.filter((t) => t.blockId === selectedBlock);

  return (
    <div className="flex flex-col gap-4">
      {/*
        Grid en vez de flex: un track `minmax(0, 1fr)` se cabe de verdad al
        espacio disponible aunque su contenido (las pestañas) sea más ancho,
        cosa que "flex-1" solo no garantiza (los flex items no se encogen
        por debajo del ancho de su contenido salvo min-width:0, y aun con
        eso el resultado es frágil con contenido dinámico como los bloques).
      */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <BlockFilterTabs blocks={blocks} value={selectedBlock} onChange={setSelectedBlock} />
        <div className="flex shrink-0 gap-2">
          {blocks.length > 0 && <NewTopicSheet blocks={blocks} />}
          <NewBlockSheet />
        </div>
      </div>

      <TopicList topics={filteredTopics} blocks={blocks} onSelect={setSelectedTopic} />

      <TopicDetailSheet
        topic={selectedTopic ? topics.find((t) => t.id === selectedTopic.id) ?? null : null}
        block={selectedTopic ? blocks.find((b) => b.id === selectedTopic.blockId) : undefined}
        blocks={blocks}
        onClose={() => setSelectedTopic(null)}
      />
    </div>
  );
}
