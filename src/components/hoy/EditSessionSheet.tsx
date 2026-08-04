"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
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
import { QuickNoteInput } from "./QuickNoteInput";
import { deleteSession, updateSession } from "@/lib/services/sessions.service";
import { STUDY_TYPES, STUDY_TYPE_LABELS } from "@/lib/constants/studyTypes";
import type { StudySession } from "@/types/session";
import type { Topic } from "@/types/topic";
import type { TipoEstudio } from "@/types/common";

interface EditSessionSheetProps {
  session: StudySession;
  topics: Topic[] | undefined;
}

export function EditSessionSheet({ session, topics }: EditSessionSheetProps) {
  const [open, setOpen] = useState(false);
  const [topicId, setTopicId] = useState(session.topicId ?? "none");
  const [tipo, setTipo] = useState<TipoEstudio>(session.tipo);
  const [duracionMin, setDuracionMin] = useState(String(session.duracionMin));
  const [observaciones, setObservaciones] = useState(session.observaciones);
  const [saving, setSaving] = useState(false);

  function handleOpenChange(next: boolean) {
    if (next) {
      setTopicId(session.topicId ?? "none");
      setTipo(session.tipo);
      setDuracionMin(String(session.duracionMin));
      setObservaciones(session.observaciones);
    }
    setOpen(next);
  }

  const observacionesRequired = tipo === "otros";
  const canSave = !observacionesRequired || observaciones.trim().length > 0;

  async function handleSave() {
    const minutes = Number(duracionMin);
    if (!minutes || minutes <= 0 || !canSave) return;
    setSaving(true);
    try {
      await updateSession(session.id, {
        topicId: topicId === "none" ? null : topicId,
        tipo,
        duracionMin: Math.round(minutes),
        observaciones,
      });
      toast.success("Sesión actualizada");
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deleteSession(session.id);
      toast.success("Sesión eliminada");
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label="Editar sesión" />}
      >
        <Pencil className="size-3.5" />
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Editar sesión</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          <div>
            <Label className="mb-1.5 text-xs font-medium text-muted-foreground">Tema</Label>
            <Select
              value={topicId}
              onValueChange={(v) => setTopicId(v ?? "none")}
              items={{
                none: "Sin tema",
                ...Object.fromEntries((topics ?? []).map((topic) => [topic.id, topic.nombre])),
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin tema</SelectItem>
                {topics?.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
            <Label htmlFor="edit-duracion" className="mb-1.5 text-xs font-medium text-muted-foreground">
              Duración (min)
            </Label>
            <Input
              id="edit-duracion"
              type="number"
              min={1}
              value={duracionMin}
              onChange={(e) => setDuracionMin(e.target.value)}
              className="w-28"
            />
          </div>

          <QuickNoteInput
            value={observaciones}
            onChange={setObservaciones}
            label={observacionesRequired ? "Observaciones (obligatorio para Otros)" : undefined}
          />

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving || !duracionMin || !canSave}>
              Guardar cambios
            </Button>
            <Button variant="ghost" className="gap-1.5 text-destructive" onClick={handleDelete} disabled={saving}>
              <Trash2 className="size-3.5" />
              Eliminar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
