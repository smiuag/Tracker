"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TopicForm } from "./TopicForm";
import type { Block } from "@/types/topic";

interface NewTopicSheetProps {
  blocks: Block[];
}

export function NewTopicSheet({ blocks }: NewTopicSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" className="gap-1.5" />}>
        <Plus className="size-4" />
        Añadir tema
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Nuevo tema</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-4 pb-16">
          {/* key: remonta el formulario en cada apertura para no arrastrar
              el estado (título, notas…) de la creación anterior. */}
          <TopicForm key={String(open)} blocks={blocks} onSaved={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
