"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
import { TOPIC_STATES, TOPIC_STATE_LABELS } from "@/lib/constants/topicStates";
import { createBlock, createTopic, deleteTopic, updateTopic } from "@/lib/services/topics.service";
import { useNextTopicNumber } from "@/hooks/useNextTopicNumber";
import { composeTopicName } from "@/lib/utils/topicName";
import { minutesToHoursLabel } from "@/lib/utils/date";
import type { Block, Topic } from "@/types/topic";
import type { EstadoTema } from "@/types/common";

const NEW_BLOCK_VALUE = "__new__";

interface TopicFormProps {
  topic?: Topic;
  blocks: Block[];
  onSaved: () => void;
  onDeleted?: () => void;
}

export function TopicForm({ topic, blocks, onSaved, onDeleted }: TopicFormProps) {
  const [nombre, setNombre] = useState(topic?.nombre ?? "");
  const [blockId, setBlockId] = useState(topic?.blockId ?? blocks[0]?.id ?? NEW_BLOCK_VALUE);
  const [newBlockName, setNewBlockName] = useState("");
  const [notas, setNotas] = useState(topic?.notas ?? "");
  const [estado, setEstado] = useState<EstadoTema>(topic?.estado ?? "pendiente");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const nextNumero = useNextTopicNumber(!topic && blockId !== NEW_BLOCK_VALUE ? blockId : null);
  const canSave = topic
    ? Boolean(nombre.trim())
    : blockId !== NEW_BLOCK_VALUE || Boolean(newBlockName.trim());

  async function handleSave() {
    if (!canSave) return;

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
          notas,
          estado,
        });
        toast.success("Tema actualizado");
      } else {
        await createTopic({
          nombre: composeTopicName(nextNumero, nombre),
          blockId: finalBlockId,
          notas,
        });
        toast.success("Tema creado");
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!topic) return;
    setDeleting(true);
    try {
      await deleteTopic(topic.id);
      toast.success("Tema eliminado");
      onDeleted?.();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="topic-nombre" className="mb-1.5 text-xs font-medium text-muted-foreground">
          {topic ? "Nombre" : `Tema ${nextNumero}`}
        </Label>
        <Input
          id="topic-nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder={
            topic
              ? "Tema 7. La organización territorial del Estado"
              : "Título (opcional) · ej. La organización territorial del Estado"
          }
        />
      </div>

      <div>
        <Label htmlFor="topic-block" className="mb-1.5 text-xs font-medium text-muted-foreground">
          Bloque
        </Label>
        <Select
          value={blockId}
          onValueChange={(v) => v && setBlockId(v)}
          items={{
            ...Object.fromEntries(blocks.map((block) => [block.id, block.nombre])),
            [NEW_BLOCK_VALUE]: "+ Nuevo bloque…",
          }}
        >
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

      {topic && (
        <>
          <div>
            <Label htmlFor="topic-estado" className="mb-1.5 text-xs font-medium text-muted-foreground">
              Estado
            </Label>
            <Select
              value={estado}
              onValueChange={(v) => v && setEstado(v as EstadoTema)}
              items={TOPIC_STATE_LABELS}
            >
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
          <p className="text-sm text-muted-foreground">
            Tiempo invertido: {minutesToHoursLabel(topic.tiempoInvertidoMin)}
            {topic.ultimoEstudio && ` · Último estudio: ${topic.ultimoEstudio}`}
          </p>
        </>
      )}

      <QuickNoteInput value={notas} onChange={setNotas} label="Notas" placeholder="Notas del tema…" />

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={saving || !canSave}>
          {topic ? "Guardar cambios" : "Crear tema"}
        </Button>
        {topic && (
          <Button
            variant="ghost"
            className="gap-1.5 text-destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="size-3.5" />
            Eliminar
          </Button>
        )}
      </div>
    </div>
  );
}
