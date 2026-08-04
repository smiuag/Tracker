"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Play, Square } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BlockSessionRecorder } from "./BlockSessionRecorder";
import { QuickNoteInput } from "./QuickNoteInput";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { useTopics } from "@/hooks/useTopics";
import { useBlocks } from "@/hooks/useBlocks";
import { createSession } from "@/lib/services/sessions.service";
import { toFechaISO } from "@/lib/utils/date";
import { STUDY_TYPES, STUDY_TYPE_LABELS } from "@/lib/constants/studyTypes";
import type { TipoEstudio } from "@/types/common";

const NONE = "none";

function formatElapsed(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function SessionRecorderCard() {
  const blocks = useBlocks();
  const topics = useTopics();
  const timer = useSessionTimer();

  const [mode, setMode] = useState<"timer" | "manual" | "bloques">("bloques");
  const [blockId, setBlockId] = useState<string>(NONE);
  const [topicId, setTopicId] = useState<string>(NONE);
  const [tipo, setTipo] = useState<TipoEstudio>("lectura");
  const [observaciones, setObservaciones] = useState("");
  const [manualMinutes, setManualMinutes] = useState("");
  const [saving, setSaving] = useState(false);

  const blockTopics = (topics ?? []).filter((topic) => topic.blockId === blockId);
  const canSave = blockId !== NONE && topicId !== NONE;

  function handleBlockChange(next: string) {
    setBlockId(next);
    setTopicId(NONE);
  }

  function resetFields() {
    setObservaciones("");
    setManualMinutes("");
    timer.reset();
  }

  async function handleSave() {
    if (!canSave) return;
    const fin = new Date();
    let inicio: Date;
    let duracionMin: number;

    if (mode === "timer") {
      if (!timer.isRunning || timer.startedAt === null) return;
      inicio = new Date(timer.startedAt);
      duracionMin = Math.max(1, Math.round((fin.getTime() - inicio.getTime()) / 60000));
    } else {
      const minutes = Number(manualMinutes);
      if (!minutes || minutes <= 0) return;
      duracionMin = Math.round(minutes);
      inicio = new Date(fin.getTime() - duracionMin * 60000);
    }

    setSaving(true);
    try {
      await createSession({
        topicId,
        tipo,
        inicio: inicio.toISOString(),
        fin: fin.toISOString(),
        duracionMin,
        fecha: toFechaISO(fin),
        observaciones,
      });
      toast.success("Sesión guardada");
      resetFields();
    } finally {
      setSaving(false);
    }
  }

  return (
    <SectionCard title="Registrar sesión">
      <div className="flex flex-col gap-4">
        <ToggleGroup
          value={[mode]}
          onValueChange={(v) => v[0] && setMode(v[0] as "timer" | "manual" | "bloques")}
          className="w-fit"
        >
          <ToggleGroupItem value="bloques" className="px-4 data-[state=on]:bg-primary">
            Bloques
          </ToggleGroupItem>
          <ToggleGroupItem value="timer" className="px-4 data-[state=on]:bg-primary">
            Cronómetro
          </ToggleGroupItem>
          <ToggleGroupItem value="manual" className="px-4 data-[state=on]:bg-primary">
            Manual
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label htmlFor="session-block" className="mb-1.5 text-xs font-medium text-muted-foreground">
              Bloque
            </Label>
            <Select
              value={blockId}
              onValueChange={(v) => handleBlockChange(v ?? NONE)}
              items={{
                none: "Selecciona un bloque…",
                ...Object.fromEntries((blocks ?? []).map((block) => [block.id, block.nombre])),
              }}
            >
              <SelectTrigger id="session-block" className="w-full">
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
            <Label htmlFor="session-topic" className="mb-1.5 text-xs font-medium text-muted-foreground">
              Tema
            </Label>
            <Select
              value={topicId}
              onValueChange={(v) => setTopicId(v ?? NONE)}
              disabled={blockId === NONE}
              items={{
                none: "Selecciona un tema…",
                ...Object.fromEntries(blockTopics.map((topic) => [topic.id, topic.nombre])),
              }}
            >
              <SelectTrigger id="session-topic" className="w-full">
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
          <div>
            <Label htmlFor="session-tipo" className="mb-1.5 text-xs font-medium text-muted-foreground">
              Tipo
            </Label>
            <Select
              value={tipo}
              onValueChange={(v) => setTipo(v as TipoEstudio)}
              items={STUDY_TYPE_LABELS}
            >
              <SelectTrigger id="session-tipo" className="w-full">
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
        </div>

        <QuickNoteInput value={observaciones} onChange={setObservaciones} />

        {mode === "timer" && (
          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold tabular-nums text-foreground">
              {formatElapsed(timer.elapsedSeconds)}
            </span>
            {timer.isRunning ? (
              <Button onClick={handleSave} disabled={saving || !canSave} className="gap-1.5">
                <Square className="size-4" />
                Detener y guardar
              </Button>
            ) : (
              <Button onClick={timer.start} variant="outline" disabled={!canSave} className="gap-1.5">
                <Play className="size-4" />
                Iniciar
              </Button>
            )}
          </div>
        )}

        {mode === "manual" && (
          <div className="flex items-end gap-3">
            <div>
              <Label htmlFor="manual-minutes" className="mb-1.5 text-xs font-medium text-muted-foreground">
                Duración (min)
              </Label>
              <Input
                id="manual-minutes"
                type="number"
                min={1}
                value={manualMinutes}
                onChange={(e) => setManualMinutes(e.target.value)}
                className="w-28"
              />
            </div>
            <Button onClick={handleSave} disabled={saving || !manualMinutes || !canSave}>
              Guardar sesión
            </Button>
          </div>
        )}

        {mode === "bloques" && (
          <BlockSessionRecorder
            topics={blockTopics}
            topicId={topicId}
            setTopicId={setTopicId}
            tipo={tipo}
            observaciones={observaciones}
            canSave={canSave}
            onSaved={resetFields}
          />
        )}
      </div>
    </SectionCard>
  );
}
