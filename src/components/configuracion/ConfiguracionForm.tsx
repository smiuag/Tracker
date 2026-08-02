"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BackupSection } from "./BackupSection";
import { setBlockDurationMin, setGoalConfig, DEFAULT_BLOCK_DURATION_MIN } from "@/lib/services/settings.service";
import type { GoalConfig, WeekdaysMode } from "@/types/settings";

const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

interface ConfiguracionFormProps {
  goalConfig: GoalConfig;
  blockDurationMin: number;
}

export function ConfiguracionForm({ goalConfig: initialGoalConfig, blockDurationMin }: ConfiguracionFormProps) {
  const [goalConfig, setLocalGoalConfig] = useState<GoalConfig>(initialGoalConfig);
  const [blockDuration, setLocalBlockDuration] = useState(String(blockDurationMin));
  const [saving, setSaving] = useState(false);

  function toggleCustomDay(day: number) {
    setLocalGoalConfig((prev) => {
      const has = prev.customWeekdays.includes(day);
      return {
        ...prev,
        customWeekdays: has
          ? prev.customWeekdays.filter((d) => d !== day)
          : [...prev.customWeekdays, day].sort((a, b) => a - b),
      };
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await setGoalConfig(goalConfig);
      await setBlockDurationMin(Math.max(1, Number(blockDuration) || DEFAULT_BLOCK_DURATION_MIN));
      toast.success("Configuración guardada");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Objetivo diario">
        <div className="flex flex-col gap-4">
          <div>
            <Label className="mb-1.5 text-xs font-medium text-muted-foreground">¿Qué días?</Label>
            <ToggleGroup
              value={[goalConfig.weekdaysMode]}
              onValueChange={(v) =>
                v[0] &&
                setLocalGoalConfig((prev) => ({ ...prev, weekdaysMode: v[0] as WeekdaysMode }))
              }
            >
              <ToggleGroupItem value="todos" className="px-3">
                Toda la semana
              </ToggleGroupItem>
              <ToggleGroupItem value="entre_semana" className="px-3">
                Entre semana
              </ToggleGroupItem>
              <ToggleGroupItem value="personalizado" className="px-3">
                Días específicos
              </ToggleGroupItem>
            </ToggleGroup>
            {goalConfig.weekdaysMode === "personalizado" && (
              <div className="mt-2 flex gap-1.5">
                {WEEKDAY_LABELS.map((label, day) => {
                  const active = goalConfig.customWeekdays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleCustomDay(day)}
                      className={
                        active
                          ? "flex size-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground"
                          : "flex size-8 items-center justify-center rounded-full border border-border text-sm text-muted-foreground"
                      }
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="hours-per-day" className="mb-1.5 text-xs font-medium text-muted-foreground">
                Horas al día
              </Label>
              <Input
                id="hours-per-day"
                type="number"
                min={0}
                step={0.5}
                value={goalConfig.hoursPerDay}
                onChange={(e) =>
                  setLocalGoalConfig((prev) => ({ ...prev, hoursPerDay: Number(e.target.value) }))
                }
              />
            </div>
            <div>
              <Label htmlFor="topics-per-week" className="mb-1.5 text-xs font-medium text-muted-foreground">
                Temas por semana (opcional)
              </Label>
              <Input
                id="topics-per-week"
                type="number"
                min={0}
                value={goalConfig.topicsPerWeek ?? ""}
                onChange={(e) =>
                  setLocalGoalConfig((prev) => ({
                    ...prev,
                    topicsPerWeek: e.target.value ? Number(e.target.value) : null,
                  }))
                }
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            El objetivo semanal y mensual se calculan solos a partir de esto.
          </p>
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
    </div>
  );
}
