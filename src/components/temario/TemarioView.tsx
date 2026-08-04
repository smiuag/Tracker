"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { useTemarioData } from "@/hooks/useTemarioData";
import { BlockFilterTabs, ALL_BLOCKS_VALUE } from "./BlockFilterTabs";
import { EstadoFilterTabs, ALL_STATES_VALUE } from "./EstadoFilterTabs";
import { TopicList } from "./TopicList";
import { NewBlockSheet } from "./NewBlockSheet";
import { NewTopicSheet } from "./NewTopicSheet";
import { TopicDetailSheet } from "./TopicDetailSheet";
import type { Topic } from "@/types/topic";

export function TemarioView() {
  const data = useTemarioData();
  const [selectedBlock, setSelectedBlock] = useState(ALL_BLOCKS_VALUE);
  const [selectedEstado, setSelectedEstado] = useState(ALL_STATES_VALUE);
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
  const filteredTopics = topics
    .filter((t) => selectedBlock === ALL_BLOCKS_VALUE || t.blockId === selectedBlock)
    .filter((t) => selectedEstado === ALL_STATES_VALUE || t.estado === selectedEstado);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex justify-end gap-2">
          {blocks.length > 0 && <NewTopicSheet blocks={blocks} />}
          <NewBlockSheet />
        </div>
        <BlockFilterTabs blocks={blocks} value={selectedBlock} onChange={setSelectedBlock} />
        <EstadoFilterTabs value={selectedEstado} onChange={setSelectedEstado} />
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
