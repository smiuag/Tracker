"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSession } from "@/lib/services/sessions.service";
import { updateTopic } from "@/lib/services/topics.service";
import { toFechaISO, minutesToHoursLabel } from "@/lib/utils/date";
import { useBlockDurationMin } from "@/hooks/useBlockDurationMin";
import type { Topic } from "@/types/topic";
import type { TipoEstudio } from "@/types/common";

interface BlockSessionRecorderProps {
  topics: Topic[];
  topicId: string;
  setTopicId: (id: string) => void;
  tipo: TipoEstudio;
  observaciones: string;
  canSave: boolean;
  onSaved: () => void;
}

type ConfirmStep = "none" | "acabado" | "nuevo";

export function BlockSessionRecorder({
  topics,
  topicId,
  setTopicId,
  tipo,
  observaciones,
  canSave,
  onSaved,
}: BlockSessionRecorderProps) {
  const blockDurationMin = useBlockDurationMin();
  const [blockCount, setBlockCount] = useState(0);
  const [confirmStep, setConfirmStep] = useState<ConfirmStep>("none");
  const [nuevoTopicId, setNuevoTopicId] = useState<string>("none");
  const [saving, setSaving] = useState(false);

  const totalMinutes = blockCount * blockDurationMin;

  function handleAddBlock() {
    if (!canSave) return;
    setBlockCount((c) => c + 1);
    setConfirmStep("acabado");
  }

  async function finalize(opts: { acabado: boolean; nuevoTopicId?: string }) {
    if (blockCount === 0 || topicId === "none") return;
    setSaving(true);
    try {
      const fin = new Date();
      const duracionMin = blockCount * blockDurationMin;
      const inicio = new Date(fin.getTime() - duracionMin * 60000);
      await createSession({
        topicId,
        tipo,
        inicio: inicio.toISOString(),
        fin: fin.toISOString(),
        duracionMin,
        fecha: toFechaISO(fin),
        observaciones,
      });

      if (opts.acabado) {
        await updateTopic(topicId, { estado: "acabado" });
      }
      if (opts.nuevoTopicId) {
        await updateTopic(opts.nuevoTopicId, { estado: "en_progreso" });
        setTopicId(opts.nuevoTopicId);
      } else if (opts.acabado) {
        setTopicId("none");
      }

      toast.success("Sesión guardada");
      setBlockCount(0);
      setConfirmStep("none");
      setNuevoTopicId("none");
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  function handleAcabadoAnswer(yes: boolean) {
    if (yes) {
      setConfirmStep("nuevo");
    } else {
      void finalize({ acabado: false });
    }
  }

  function handleNuevoAnswer(yes: boolean) {
    if (yes && nuevoTopicId !== "none") {
      void finalize({ acabado: true, nuevoTopicId });
    } else {
      void finalize({ acabado: true });
    }
  }

  const pendingTopics = topics.filter((t) => t.id !== topicId && t.estado === "pendiente");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Button onClick={handleAddBlock} disabled={saving || !canSave} className="gap-1.5">
          <Plus className="size-4" />
          Bloque de {blockDurationMin} min
        </Button>
        {blockCount > 0 && (
          <span className="text-sm text-muted-foreground">
            {blockCount} bloque{blockCount === 1 ? "" : "s"} · {minutesToHoursLabel(totalMinutes)}
          </span>
        )}
      </div>

      {confirmStep === "acabado" && (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-secondary/30 p-3">
          <p className="text-sm text-foreground">¿Has acabado el tema?</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleAcabadoAnswer(true)} disabled={saving}>
              Sí
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleAcabadoAnswer(false)} disabled={saving}>
              No
            </Button>
          </div>
        </div>
      )}

      {confirmStep === "nuevo" && (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-secondary/30 p-3">
          <p className="text-sm text-foreground">¿Has empezado un nuevo tema?</p>
          <Select
            value={nuevoTopicId}
            onValueChange={(v) => setNuevoTopicId(v ?? "none")}
            items={{
              none: "Selecciona un tema…",
              ...Object.fromEntries(pendingTopics.map((t) => [t.id, t.nombre])),
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Selecciona un tema…</SelectItem>
              {pendingTopics.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleNuevoAnswer(true)}
              disabled={saving || nuevoTopicId === "none"}
            >
              Sí
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleNuevoAnswer(false)} disabled={saving}>
              No
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
