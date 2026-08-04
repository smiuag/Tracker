"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TopicForm } from "./TopicForm";
import type { Block, Topic } from "@/types/topic";

interface TopicDetailSheetProps {
  topic: Topic | null;
  block: Block | undefined;
  blocks: Block[];
  onClose: () => void;
}

export function TopicDetailSheet({ topic, block, blocks, onClose }: TopicDetailSheetProps) {
  return (
    <Sheet open={!!topic} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right">
        {topic && (
          <>
            <SheetHeader>
              <SheetTitle>{topic.nombre}</SheetTitle>
              <SheetDescription>{block?.nombre ?? "Sin bloque"}</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-6">
              <TopicForm key={topic.id} topic={topic} blocks={blocks} onSaved={onClose} onDeleted={onClose} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
