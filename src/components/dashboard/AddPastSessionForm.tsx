"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuickNoteInput } from "@/components/hoy/QuickNoteInput";
import { useBlocks } from "@/hooks/useBlocks";
import { useTopics } from "@/hooks/useTopics";
import { createSession } from "@/lib/services/sessions.service";
import { STUDY_TYPES, STUDY_TYPE_LABELS } from "@/lib/constants/studyTypes";
import type { FechaISO, TipoEstudio } from "@/types/common";

const NONE = "none";

interface AddPastSessionFormProps {
  fecha: FechaISO;
}

export function AddPastSessionForm({ fecha }: AddPastSessionFormProps) {
  const blocks = useBlocks();
  const topics = useTopics();

  const [blockId, setBlockId] = useState(NONE);
  const [topicId, setTopicId] = useState(NONE);
  const [tipo, setTipo] = useState<TipoEstudio>("lectura");
  const [minutes, setMinutes] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [saving, setSaving] = useState(false);

  const blockTopics = (topics ?? []).filter((topic) => topic.blockId === blockId);
  const observacionesRequired = tipo === "otros";
  const canSave =
    blockId !== NONE &&
    topicId !== NONE &&
    Number(minutes) > 0 &&
    (!observacionesRequired || observaciones.trim().length > 0);

  function handleBlockChange(next: string) {
    setBlockId(next);
    setTopicId(NONE);
  }

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      const duracionMin = Math.round(Number(minutes));
      // Se ancla al mediodía del día elegido: la hora exacta no importa aquí
      // (no hay cronómetro), y evita que un desfase horario empuje la sesión
      // al día anterior o siguiente si se usara medianoche.
      const fin = new Date(`${fecha}T12:00:00`);
      const inicio = new Date(fin.getTime() - duracionMin * 60000);
      await createSession({
        topicId,
        tipo,
        inicio: inicio.toISOString(),
        fin: fin.toISOString(),
        duracionMin,
        fecha,
        observaciones,
      });
      toast.success("Sesión guardada");
      setBlockId(NONE);
      setTopicId(NONE);
      setTipo("lectura");
      setMinutes("");
      setObservaciones("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
      <p className="text-xs font-medium text-muted-foreground">Añadir sesión de este día</p>

      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <Label className="mb-1.5 text-xs font-medium text-muted-foreground">Bloque</Label>
          <Select
            value={blockId}
            onValueChange={(v) => handleBlockChange(v ?? NONE)}
            items={{
              none: "Selecciona un bloque…",
              ...Object.fromEntries((blocks ?? []).map((block) => [block.id, block.nombre])),
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Selecciona un bloque…</SelectItem>
              {blocks?.map((block) => (
                <SelectItem key={block.id} value={block.id}>
                  {block.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5 text-xs font-medium text-muted-foreground">Tema</Label>
          <Select
            value={topicId}
            onValueChange={(v) => setTopicId(v ?? NONE)}
            disabled={blockId === NONE}
            items={{
              none: "Selecciona un tema…",
              ...Object.fromEntries(blockTopics.map((topic) => [topic.id, topic.nombre])),
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Selecciona un tema…</SelectItem>
              {blockTopics.map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="mb-1.5 text-xs font-medium text-muted-foreground">Tipo</Label>
          <Select value={tipo} onValueChange={(v) => setTipo(v as TipoEstudio)} items={STUDY_TYPE_LABELS}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STUDY_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {STUDY_TYPE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="past-session-minutes" className="mb-1.5 text-xs font-medium text-muted-foreground">
            Duración (min)
          </Label>
          <Input
            id="past-session-minutes"
            type="number"
            min={1}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </div>
      </div>

      <QuickNoteInput
        value={observaciones}
        onChange={setObservaciones}
        label={observacionesRequired ? "Observaciones (obligatorio para Otros)" : undefined}
      />

      <Button onClick={handleSave} disabled={saving || !canSave} className="w-fit gap-1.5">
        <Plus className="size-4" />
        Guardar sesión
      </Button>
    </div>
  );
}
