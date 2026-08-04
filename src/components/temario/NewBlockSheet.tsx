"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TOPIC_STATES, TOPIC_STATE_LABELS } from "@/lib/constants/topicStates";
import { createBlockWithTopics } from "@/lib/services/topics.service";
import { composeTopicName } from "@/lib/utils/topicName";
import { createId } from "@/lib/utils/id";
import type { EstadoTema } from "@/types/common";

interface TopicRow {
  key: string;
  nombre: string;
  estado: EstadoTema;
  horas: string;
  notas: string;
}

function emptyRow(): TopicRow {
  return { key: createId(), nombre: "", estado: "pendiente", horas: "0", notas: "" };
}

export function NewBlockSheet() {
  const [open, setOpen] = useState(false);
  const [blockNombre, setBlockNombre] = useState("");
  const [rows, setRows] = useState<TopicRow[]>([emptyRow()]);
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setBlockNombre("");
    setRows([emptyRow()]);
  }

  function updateRow(key: string, patch: Partial<TopicRow>) {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  function removeRow(key: string) {
    setRows((prev) => (prev.length > 1 ? prev.filter((row) => row.key !== key) : prev));
  }

  const canSave = Boolean(blockNombre.trim());

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      await createBlockWithTopics(
        blockNombre.trim(),
        rows.map((row, index) => ({
          nombre: composeTopicName(index + 1, row.nombre),
          estado: row.estado,
          tiempoInvertidoMin: Math.max(0, Math.round((Number(row.horas) || 0) * 60)),
          notas: row.notas.trim(),
        }))
      );
      toast.success(`Bloque creado con ${rows.length} tema${rows.length === 1 ? "" : "s"}`);
      resetForm();
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <SheetTrigger render={<Button className="gap-1.5" />}>
        <Plus className="size-4" />
        Nuevo bloque
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Nuevo bloque</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-6">
          <div>
            <Label htmlFor="block-nombre" className="mb-1.5 text-xs font-medium text-muted-foreground">
              Nombre del bloque
            </Label>
            <Input
              id="block-nombre"
              value={blockNombre}
              onChange={(e) => setBlockNombre(e.target.value)}
              placeholder="Bloque 1. Derecho Constitucional"
            />
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground">Temas del bloque</p>
            {rows.map((row, index) => (
              <div key={row.key} className="flex flex-col gap-2 rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-muted-foreground">Tema {index + 1}</p>
                  {rows.length > 1 && (
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => removeRow(row.key)}
                      aria-label="Quitar tema"
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  )}
                </div>
                <Input
                  value={row.nombre}
                  onChange={(e) => updateRow(row.key, { nombre: e.target.value })}
                  placeholder="Título (opcional) · ej. La Constitución Española de 1978"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={row.estado}
                    onValueChange={(v) => v && updateRow(row.key, { estado: v as EstadoTema })}
                    items={TOPIC_STATE_LABELS}
                  >
                    <SelectTrigger className="w-full">
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
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={row.horas}
                    onChange={(e) => updateRow(row.key, { horas: e.target.value })}
                    placeholder="Horas ya dedicadas"
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addRow} className="w-fit gap-1.5">
              <Plus className="size-4" />
              Añadir otro tema
            </Button>
          </div>

          <Button onClick={handleSave} disabled={saving || !canSave}>
            Crear bloque
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
