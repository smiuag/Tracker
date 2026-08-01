"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TopicForm } from "./TopicForm";
import { SubtopicChecklist } from "./SubtopicChecklist";
import { deleteTopic } from "@/lib/services/topics.service";
import { TOPIC_STATE_LABELS } from "@/lib/constants/topicStates";
import { minutesToHoursLabel } from "@/lib/utils/date";
import type { Block, Topic } from "@/types/topic";

interface TopicDetailSheetProps {
  topic: Topic | null;
  block: Block | undefined;
  blocks: Block[];
  onClose: () => void;
}

export function TopicDetailSheet({ topic, block, blocks, onClose }: TopicDetailSheetProps) {
  const [editing, setEditing] = useState(false);

  function handleOpenChange(open: boolean) {
    if (!open) {
      setEditing(false);
      onClose();
    }
  }

  async function handleDelete() {
    if (!topic) return;
    await deleteTopic(topic.id);
    toast.success("Tema eliminado");
    handleOpenChange(false);
  }

  return (
    <Sheet open={!!topic} onOpenChange={handleOpenChange}>
      <SheetContent side="right">
        {topic && (
          <>
            <SheetHeader>
              <SheetTitle>{topic.nombre}</SheetTitle>
              <SheetDescription>{block?.nombre ?? "Sin bloque"}</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 overflow-y-auto px-4">
              {editing ? (
                <TopicForm
                  topic={topic}
                  blocks={blocks}
                  onSaved={() => setEditing(false)}
                />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{TOPIC_STATE_LABELS[topic.estado]}</Badge>
                    <Badge variant="outline">Dificultad {topic.dificultad}/5</Badge>
                  </div>

                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">
                      Progreso — {topic.porcentaje}%
                    </p>
                    <Progress value={topic.porcentaje} />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Tiempo invertido: {minutesToHoursLabel(topic.tiempoInvertidoMin)}
                    {topic.ultimoEstudio && ` · Último estudio: ${topic.ultimoEstudio}`}
                  </p>

                  {topic.notas && (
                    <p className="rounded-lg bg-secondary/40 p-2.5 text-sm text-foreground">
                      {topic.notas}
                    </p>
                  )}

                  <SubtopicChecklist topicId={topic.id} />

                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-1.5" onClick={() => setEditing(true)}>
                      <Pencil className="size-3.5" />
                      Editar
                    </Button>
                    <Button variant="ghost" className="gap-1.5 text-destructive" onClick={handleDelete}>
                      <Trash2 className="size-3.5" />
                      Eliminar
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
