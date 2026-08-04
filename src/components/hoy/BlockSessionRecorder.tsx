"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSession } from "@/lib/services/sessions.service";
import { updateTopic } from "@/lib/services/topics.service";
import { toFechaISO, minutesToHoursLabel } from "@/lib/utils/date";
import { useBlockDurationMin } from "@/hooks/useBlockDurationMin";
import type { Topic } from "@/types/topic";
import type { TipoEstudio } from "@/types/common";

/** Tras guardar, el botón desaparece este tiempo y reaparece con un fundido:
 *  feedback claro de que la pulsación registró, y freno a dobles toques. */
const COOLDOWN_MS = 2000;

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
  const [justSaved, setJustSaved] = useState(false);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    };
  }, []);

  async function handleAddBlock() {
    if (!canSave || saving || justSaved) return;
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

      toast.success(`Bloque de ${minutesToHoursLabel(blockDurationMin)} guardado`);
      setJustSaved(true);
      cooldownTimer.current = setTimeout(() => setJustSaved(false), COOLDOWN_MS);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-9 items-center gap-3">
      {justSaved ? (
        <span className="flex items-center gap-1.5 rounded-full bg-primary/40 px-4 py-2 text-sm font-medium text-foreground transition-opacity duration-300 starting:opacity-0">
          <Check className="size-4" />
          Bloque guardado
        </span>
      ) : (
        <Button
          onClick={handleAddBlock}
          disabled={saving || !canSave}
          className="gap-1.5 transition-opacity duration-700 starting:opacity-0"
        >
          <Plus className="size-4" />
          Bloque de {blockDurationMin} min
        </Button>
      )}
    </div>
  );
}
