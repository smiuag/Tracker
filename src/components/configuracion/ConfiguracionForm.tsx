"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackupSection } from "./BackupSection";
import { DonationsSection } from "./DonationsSection";
import { SuggestionsSection } from "./SuggestionsSection";
import { TopicsPaceHint } from "./TopicsPaceHint";
import { setBlockDurationMin, setGoalConfig, DEFAULT_BLOCK_DURATION_MIN } from "@/lib/services/settings.service";
import { createId } from "@/lib/utils/id";
import type { GoalConfig } from "@/types/settings";

const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

/** Franja en edición: las horas se guardan como texto mientras se teclea. */
interface RuleDraft {
  key: string;
  weekdays: number[];
  hours: string;
}

function emptyRule(): RuleDraft {
  return { key: createId(), weekdays: [], hours: "" };
}

interface ConfiguracionFormProps {
  goalConfig: GoalConfig;
  blockDurationMin: number;
}

export function ConfiguracionForm({ goalConfig: initialGoalConfig, blockDurationMin }: ConfiguracionFormProps) {
  const [rules, setRules] = useState<RuleDraft[]>(() =>
    initialGoalConfig.rules.length > 0
      ? initialGoalConfig.rules.map((r) => ({ key: createId(), weekdays: r.weekdays, hours: String(r.hours) }))
      : [emptyRule()]
  );
  const [topicsPerWeek, setTopicsPerWeek] = useState(
    initialGoalConfig.topicsPerWeek !== null ? String(initialGoalConfig.topicsPerWeek) : ""
  );
  const [fechaExamen, setFechaExamen] = useState(initialGoalConfig.fechaExamen ?? "");
  const [blockDuration, setLocalBlockDuration] = useState(String(blockDurationMin));
  const [saving, setSaving] = useState(false);

  /** Un día pertenece como mucho a una franja: activarlo aquí lo quita de las demás. */
  function toggleDay(ruleKey: string, day: number) {
    setRules((prev) =>
      prev.map((rule) => {
        if (rule.key === ruleKey) {
          const has = rule.weekdays.includes(day);
          return {
            ...rule,
            weekdays: has
              ? rule.weekdays.filter((d) => d !== day)
              : [...rule.weekdays, day].sort((a, b) => a - b),
          };
        }
        return { ...rule, weekdays: rule.weekdays.filter((d) => d !== day) };
      })
    );
  }

  function updateHours(ruleKey: string, hours: string) {
    setRules((prev) => prev.map((r) => (r.key === ruleKey ? { ...r, hours } : r)));
  }

  function addRule() {
    setRules((prev) => [...prev, emptyRule()]);
  }

  function removeRule(ruleKey: string) {
    setRules((prev) => (prev.length > 1 ? prev.filter((r) => r.key !== ruleKey) : [emptyRule()]));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const config: GoalConfig = {
        rules: rules
          .map((r) => ({ weekdays: r.weekdays, hours: Math.max(0, Number(r.hours) || 0) }))
          .filter((r) => r.weekdays.length > 0 && r.hours > 0),
        topicsPerWeek: topicsPerWeek ? Number(topicsPerWeek) : null,
        fechaExamen: fechaExamen || null,
      };
      await setGoalConfig(config);
      await setBlockDurationMin(Math.max(1, Number(blockDuration) || DEFAULT_BLOCK_DURATION_MIN));
      toast.success("Configuración guardada");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Objetivo de estudio">
        <div className="flex flex-col gap-3">
          {rules.map((rule, index) => (
            <div key={rule.key} className="flex flex-col gap-2.5 rounded-lg border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-muted-foreground">Franja {index + 1}</p>
                {rules.length > 1 && (
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => removeRule(rule.key)}
                    aria-label="Quitar franja"
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                )}
              </div>
              <div className="flex gap-1.5">
                {WEEKDAY_LABELS.map((label, day) => {
                  const active = rule.weekdays.includes(day);
                  // Fin de semana en rosa (bg-accent), el mismo tono que usa la racha.
                  const activeColor = day >= 5 ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground";
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(rule.key, day)}
                      className={
                        active
                          ? `flex size-8 items-center justify-center rounded-full text-sm font-medium ${activeColor}`
                          : "flex size-8 items-center justify-center rounded-full border border-border text-sm text-muted-foreground"
                      }
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  value={rule.hours}
                  onChange={(e) => updateHours(rule.key, e.target.value)}
                  className="w-24"
                  aria-label={`Horas al día de la franja ${index + 1}`}
                />
                <span className="text-xs text-muted-foreground">horas cada uno de esos días</span>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addRule} className="w-fit gap-1.5">
            <Plus className="size-4" />
            Añadir franja
          </Button>

          <div>
            <Label htmlFor="topics-per-week" className="mb-1.5 text-xs font-medium text-muted-foreground">
              Temas por semana (opcional)
            </Label>
            <Input
              id="topics-per-week"
              type="number"
              min={0}
              value={topicsPerWeek}
              onChange={(e) => setTopicsPerWeek(e.target.value)}
            />
            <TopicsPaceHint topicsPerWeek={topicsPerWeek} />
          </div>

          <p className="text-xs text-muted-foreground">
            El objetivo semanal y mensual se calculan solos a partir de las franjas.
            Los cambios se aplican desde hoy: los días anteriores conservan el
            objetivo que tenían entonces.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Examen">
        <div>
          <Label htmlFor="fecha-examen" className="mb-1.5 text-xs font-medium text-muted-foreground">
            Fecha del examen (opcional)
          </Label>
          <Input
            id="fecha-examen"
            type="date"
            value={fechaExamen}
            onChange={(e) => setFechaExamen(e.target.value)}
            className="w-48"
          />
        </div>
      </SectionCard>

      <SectionCard title="Bloques de tiempo">
        <div>
          <Label htmlFor="block-duration" className="mb-1.5 text-xs font-medium text-muted-foreground">
            Duración de cada bloque (min)
          </Label>
          <Input
            id="block-duration"
            type="number"
            min={5}
            step={5}
            value={blockDuration}
            onChange={(e) => setLocalBlockDuration(e.target.value)}
            className="w-32"
          />
        </div>
      </SectionCard>

      <Button onClick={handleSave} disabled={saving} className="w-fit">
        Guardar configuración
      </Button>

      <BackupSection />

      <SuggestionsSection />

      <DonationsSection />

      <p className="pb-2 text-center text-xs text-muted-foreground">
        Hecho con calma para opositores · Opobook
      </p>
    </div>
  );
}
