"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RatingPicker } from "@/components/shared/RatingPicker";
import { QuickNoteInput } from "@/components/hoy/QuickNoteInput";
import { TOPIC_STATES, TOPIC_STATE_LABELS } from "@/lib/constants/topicStates";
import { createBlock, createTopic, updateTopic } from "@/lib/services/topics.service";
import type { Block, Topic } from "@/types/topic";
import type { EstadoTema, Nivel1a5 } from "@/types/common";

const NEW_BLOCK_VALUE = "__new__";

interface TopicFormProps {
  topic?: Topic;
  blocks: Block[];
  onSaved: () => void;
}

export function TopicForm({ topic, blocks, onSaved }: TopicFormProps) {
  const [nombre, setNombre] = useState(topic?.nombre ?? "");
  const [blockId, setBlockId] = useState(topic?.blockId ?? blocks[0]?.id ?? NEW_BLOCK_VALUE);
  const [newBlockName, setNewBlockName] = useState("");
  const [dificultad, setDificultad] = useState<Nivel1a5>(topic?.dificultad ?? 3);
  const [notas, setNotas] = useState(topic?.notas ?? "");
  const [estado, setEstado] = useState<EstadoTema>(topic?.estado ?? "no_iniciado");
  const [porcentaje, setPorcentaje] = useState(topic?.porcentaje ?? 0);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!nombre.trim()) return;
    if (blockId === NEW_BLOCK_VALUE && !newBlockName.trim()) return;

    setSaving(true);
    try {
      let finalBlockId = blockId;
      if (blockId === NEW_BLOCK_VALUE) {
        const block = await createBlock(newBlockName.trim());
        finalBlockId = block.id;
      }

      if (topic) {
        await updateTopic(topic.id, {
          nombre: nombre.trim(),
          blockId: finalBlockId,
          dificultad,
          notas,
          estado,
          porcentaje,
        });
        toast.success("Tema actualizado");
      } else {
        await createTopic({ nombre: nombre.trim(), blockId: finalBlockId, dificultad, notas });
        toast.success("Tema creado");
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="topic-nombre" className="mb-1.5 text-xs font-medium text-muted-foreground">
          Nombre
        </Label>
        <Input
          id="topic-nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tema 7. La organización territorial del Estado"
        />
      </div>

      <div>
        <Label htmlFor="topic-block" className="mb-1.5 text-xs font-medium text-muted-foreground">
          Bloque
        </Label>
        <Select value={blockId} onValueChange={(v) => v && setBlockId(v)}>
          <SelectTrigger id="topic-block" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {blocks.map((block) => (
              <SelectItem key={block.id} value={block.id}>
                {block.nombre}
              </SelectItem>
            ))}
            <SelectItem value={NEW_BLOCK_VALUE}>+ Nuevo bloque…</SelectItem>
          </SelectContent>
        </Select>
        {blockId === NEW_BLOCK_VALUE && (
          <Input
            className="mt-2"
            value={newBlockName}
            onChange={(e) => setNewBlockName(e.target.value)}
            placeholder="Nombre del bloque"
          />
        )}
      </div>

      <RatingPicker label="Dificultad" value={dificultad} onChange={setDificultad} />

      {topic && (
        <>
          <div>
            <Label htmlFor="topic-estado" className="mb-1.5 text-xs font-medium text-muted-foreground">
              Estado
            </Label>
            <Select value={estado} onValueChange={(v) => v && setEstado(v as EstadoTema)}>
              <SelectTrigger id="topic-estado" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TOPIC_STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {TOPIC_STATE_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 text-xs font-medium text-muted-foreground">
              Progreso: {porcentaje}%
            </Label>
            <Slider
              value={[porcentaje]}
              onValueChange={(v) => setPorcentaje(Array.isArray(v) ? v[0] : v)}
              step={5}
            />
          </div>
        </>
      )}

      <QuickNoteInput value={notas} onChange={setNotas} label="Notas" placeholder="Notas del tema…" />

      <Button onClick={handleSave} disabled={saving || !nombre.trim()}>
        {topic ? "Guardar cambios" : "Crear tema"}
      </Button>
    </div>
  );
}
