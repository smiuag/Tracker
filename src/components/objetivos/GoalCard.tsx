"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { GoalProgressBar } from "./GoalProgressBar";
import { GoalForm } from "./GoalForm";
import { deleteGoal } from "@/lib/services/goals.service";
import type { Goal } from "@/types/goal";

const METRICA_LABEL: Record<Goal["metrica"], string> = {
  horas: "horas",
  temas: "temas",
  tests: "tests",
};

export function GoalCard({ goal }: { goal: Goal }) {
  const [editing, setEditing] = useState(false);

  async function handleDelete() {
    await deleteGoal(goal.id);
    toast.success("Objetivo eliminado");
  }

  return (
    <Card className="gap-2 py-4">
      <CardContent className="flex flex-col gap-2 px-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground">
            {Math.round(goal.valorActual)} / {goal.valorObjetivo} {METRICA_LABEL[goal.metrica]}
          </p>
          <div className="flex shrink-0 gap-1">
            <Button size="icon-sm" variant="ghost" onClick={() => setEditing(true)} aria-label="Editar">
              <Pencil className="size-3.5" />
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={handleDelete} aria-label="Eliminar">
              <Trash2 className="size-3.5 text-destructive" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {goal.fechaInicio} — {goal.fechaFin}
        </p>
        <GoalProgressBar valorActual={goal.valorActual} valorObjetivo={goal.valorObjetivo} />
      </CardContent>

      <Sheet open={editing} onOpenChange={setEditing}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Editar objetivo</SheetTitle>
          </SheetHeader>
          <div className="px-4">
            <GoalForm goal={goal} onSaved={() => setEditing(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  );
}
