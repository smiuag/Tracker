"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { createGoal, updateGoal } from "@/lib/services/goals.service";
import {
  addDays,
  endOfMonth,
  endOfYear,
  startOfIsoWeek,
  startOfMonth,
  startOfYear,
  toFechaISO,
} from "@/lib/utils/date";
import type { Goal } from "@/types/goal";
import type { MetricaObjetivo, TipoObjetivo } from "@/types/common";

const TIPO_LABELS: Record<TipoObjetivo, string> = {
  diario: "Diario",
  semanal: "Semanal",
  mensual: "Mensual",
  anual: "Anual",
};

const METRICA_LABELS: Record<MetricaObjetivo, string> = {
  horas: "Horas",
  temas: "Temas completados",
  tests: "Tests realizados",
};

function defaultRange(tipo: TipoObjetivo): { fechaInicio: string; fechaFin: string } {
  const today = toFechaISO(new Date());
  switch (tipo) {
    case "diario":
      return { fechaInicio: today, fechaFin: today };
    case "semanal": {
      const inicio = startOfIsoWeek(today);
      return { fechaInicio: inicio, fechaFin: addDays(inicio, 6) };
    }
    case "mensual":
      return { fechaInicio: startOfMonth(today), fechaFin: endOfMonth(today) };
    case "anual":
      return { fechaInicio: startOfYear(today), fechaFin: endOfYear(today) };
  }
}

interface GoalFormProps {
  goal?: Goal;
  onSaved: () => void;
}

export function GoalForm({ goal, onSaved }: GoalFormProps) {
  const [tipo, setTipo] = useState<TipoObjetivo>(goal?.tipo ?? "semanal");
  const [metrica, setMetrica] = useState<MetricaObjetivo>(goal?.metrica ?? "horas");
  const [valorObjetivo, setValorObjetivo] = useState(String(goal?.valorObjetivo ?? ""));
  const [range, setRange] = useState(() =>
    goal ? { fechaInicio: goal.fechaInicio, fechaFin: goal.fechaFin } : defaultRange(tipo)
  );
  const [saving, setSaving] = useState(false);

  function handleTipoChange(next: TipoObjetivo) {
    setTipo(next);
    if (!goal) setRange(defaultRange(next));
  }

  async function handleSave() {
    const valor = Number(valorObjetivo);
    if (!valor || valor <= 0) return;

    setSaving(true);
    try {
      const input = { tipo, metrica, valorObjetivo: valor, ...range };
      if (goal) {
        await updateGoal(goal.id, input);
        toast.success("Objetivo actualizado");
      } else {
        await createGoal(input);
        toast.success("Objetivo creado");
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="goal-tipo" className="mb-1.5 text-xs font-medium text-muted-foreground">
            Periodo
          </Label>
          <Select value={tipo} onValueChange={(v) => v && handleTipoChange(v as TipoObjetivo)}>
            <SelectTrigger id="goal-tipo" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(TIPO_LABELS) as TipoObjetivo[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {TIPO_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="goal-metrica" className="mb-1.5 text-xs font-medium text-muted-foreground">
            Métrica
          </Label>
          <Select value={metrica} onValueChange={(v) => v && setMetrica(v as MetricaObjetivo)}>
            <SelectTrigger id="goal-metrica" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(METRICA_LABELS) as MetricaObjetivo[]).map((m) => (
                <SelectItem key={m} value={m}>
                  {METRICA_LABELS[m]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="goal-valor" className="mb-1.5 text-xs font-medium text-muted-foreground">
          Objetivo ({METRICA_LABELS[metrica].toLowerCase()})
        </Label>
        <Input
          id="goal-valor"
          type="number"
          min={1}
          value={valorObjetivo}
          onChange={(e) => setValorObjetivo(e.target.value)}
          className="w-32"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Periodo: {range.fechaInicio} — {range.fechaFin}
      </p>

      <Button onClick={handleSave} disabled={saving || !valorObjetivo}>
        {goal ? "Guardar cambios" : "Crear objetivo"}
      </Button>
    </div>
  );
}
