import { TopicCard } from "./TopicCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { BookOpen } from "lucide-react";
import type { Block, Topic } from "@/types/topic";

interface TopicListProps {
  topics: Topic[];
  blocks: Block[];
  onSelect: (topic: Topic) => void;
}

export function TopicList({ topics, blocks, onSelect }: TopicListProps) {
  const blockById = new Map(blocks.map((b) => [b.id, b]));

  if (topics.length === 0) {
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
      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          block={blockById.get(topic.blockId)}
          onClick={() => onSelect(topic)}
        />
      ))}
    </div>
  );
}
