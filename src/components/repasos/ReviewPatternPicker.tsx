"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useReviewPattern } from "@/hooks/useReviewPattern";
import { updateReviewPattern } from "@/lib/services/reviews.service";

const DEFAULT_DIAS = [1, 3, 7, 15, 30];

function isDefaultDias(dias: number[]): boolean {
  return dias.length === DEFAULT_DIAS.length && dias.every((d, i) => d === DEFAULT_DIAS[i]);
}

function parseCustomDias(text: string): number[] {
  return text
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isInteger(n) && n > 0)
    .sort((a, b) => a - b);
}

export function ReviewPatternPicker() {
  const pattern = useReviewPattern();
  const savedDias = pattern?.dias ?? DEFAULT_DIAS;

  // Solo se usan si el usuario ha tocado el formulario en esta sesión;
  // si no, se derivan directamente del patrón guardado (sin useEffect).
  const [modeOverride, setModeOverride] = useState<"default" | "custom" | null>(null);
  const [textOverride, setTextOverride] = useState<string | null>(null);

  const mode = modeOverride ?? (isDefaultDias(savedDias) ? "default" : "custom");
  const customText = textOverride ?? savedDias.join(", ");

  async function handleSave() {
    const dias = mode === "default" ? DEFAULT_DIAS : parseCustomDias(customText);
    if (dias.length === 0) return;
    await updateReviewPattern(dias);
    setModeOverride(null);
    setTextOverride(null);
    toast.success("Patrón de repaso actualizado");
  }

  return (
    <SectionCard title="Patrón de repaso">
      <div className="flex flex-col gap-3">
        <RadioGroup value={mode} onValueChange={(v) => v && setModeOverride(v as "default" | "custom")}>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <RadioGroupItem value="default" />
            1 - 3 - 7 - 15 - 30 días
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <RadioGroupItem value="custom" />
            Personalizado
          </label>
        </RadioGroup>

        {mode === "custom" && (
          <div>
            <Label htmlFor="custom-pattern" className="mb-1.5 text-xs font-medium text-muted-foreground">
              Días separados por comas
            </Label>
            <Input
              id="custom-pattern"
              value={customText}
              onChange={(e) => setTextOverride(e.target.value)}
              placeholder="1, 4, 10, 20"
            />
          </div>
        )}

        <Button onClick={handleSave} className="w-fit">
          Guardar patrón
        </Button>
      </div>
    </SectionCard>
  );
}
