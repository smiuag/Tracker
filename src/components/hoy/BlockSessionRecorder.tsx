"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSession } from "@/lib/services/sessions.service";
import { updateTopic } from "@/lib/services/topics.service";
import { toFechaISO } from "@/lib/utils/date";
import { useBlockDurationMin } from "@/hooks/useBlockDurationMin";
import type { Topic } from "@/types/topic";
import type { TipoEstudio } from "@/types/common";

interface BlockSessionRecorderProps {
  topics: Topic[];
  topicId: string;
  tipo: TipoEstudio;
  observaciones: string;
  canSave: boolean;
  onSaved: () => void;
}

export function BlockSessionRecorder({
  topics,
  topicId,
  tipo,
  observaciones,
  canSave,
  onSaved,
}: BlockSessionRecorderProps) {
  const blockDurationMin = useBlockDurationMin();
  const [saving, setSaving] = useState(false);

  async function handleAddBlock() {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      const fin = new Date();
      const inicio = new Date(fin.getTime() - blockDurationMin * 60000);
      await createSession({
        topicId,
        tipo,
        inicio: inicio.toISOString(),
        fin: fin.toISOString(),
        duracionMin: blockDurationMin,
        fecha: toFechaISO(fin),
        observaciones,
      });

      // Estudiar un tema pendiente lo pasa solo a "en progreso"; marcarlo
      // como acabado se hace desde la tarjeta del tema en el Temario.
      const topic = topics.find((t) => t.id === topicId);
      if (topic?.estado === "pendiente") {
        await updateTopic(topicId, { estado: "en_progreso" });
      }

      toast.success(`Bloque de ${blockDurationMin} min guardado`);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button onClick={handleAddBlock} disabled={saving || !canSave} className="gap-1.5">
        <Plus className="size-4" />
        Bloque de {blockDurationMin} min
      </Button>
    </div>
  );
}
