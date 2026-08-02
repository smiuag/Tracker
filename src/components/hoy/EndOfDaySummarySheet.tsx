"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RatingPicker } from "@/components/shared/RatingPicker";
import { QuickNoteInput } from "./QuickNoteInput";
import { upsertDailyLog } from "@/lib/services/sessions.service";
import { evaluateDayEndBadges } from "@/lib/services/badges.service";
import { minutesToHoursLabel } from "@/lib/utils/date";
import type { Nivel1a5 } from "@/types/common";

interface EndOfDaySummarySheetProps {
  fecha: string;
  totalMinutes: number;
  sessionCount: number;
  horasObjetivo: number;
}

export function EndOfDaySummarySheet({
  fecha,
  totalMinutes,
  sessionCount,
  horasObjetivo,
}: EndOfDaySummarySheetProps) {
  const [open, setOpen] = useState(false);
  const [productividad, setProductividad] = useState<Nivel1a5>(3);
  const [reflexion, setReflexion] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await upsertDailyLog({ fecha, horasObjetivo, reflexion, productividad });
      await evaluateDayEndBadges(fecha);
      toast.success("Resumen del día guardado");
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" className="gap-1.5" />}>
        <CheckCircle2 className="size-4" />
        Terminar el día
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Resumen del día</SheetTitle>
          <SheetDescription>
            {minutesToHoursLabel(totalMinutes)} en {sessionCount}{" "}
            {sessionCount === 1 ? "sesión" : "sesiones"}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          <RatingPicker label="Productividad" value={productividad} onChange={setProductividad} />
          <QuickNoteInput
            value={reflexion}
            onChange={setReflexion}
            label="Reflexión"
            placeholder="¿Cómo ha ido el día?"
          />
        </div>
        <SheetFooter>
          <Button onClick={handleSave} disabled={saving}>
            Guardar resumen
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
