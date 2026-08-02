"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useDailyTasks } from "@/hooks/useDailyTasks";
import { createTask, deleteTask, toggleTask } from "@/lib/services/tasks.service";
import type { FechaISO } from "@/types/common";

interface DailyTaskChecklistProps {
  fecha: FechaISO;
}

export function DailyTaskChecklist({ fecha }: DailyTaskChecklistProps) {
  const tasks = useDailyTasks(fecha);
  const [newText, setNewText] = useState("");

  async function handleAdd() {
    if (!newText.trim()) return;
    await createTask(fecha, newText.trim());
    setNewText("");
  }

  return (
    <SectionCard title="Tareas de hoy">
      {tasks && tasks.length > 0 && (
        <ul className="mb-2 flex flex-col gap-1.5">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-2">
              <Checkbox
                checked={task.completado}
                onCheckedChange={(checked) => toggleTask(task.id, checked === true)}
              />
              <span
                className={
                  task.completado
                    ? "flex-1 text-sm text-muted-foreground line-through"
                    : "flex-1 text-sm text-foreground"
                }
              >
                {task.texto}
              </span>
              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Eliminar tarea"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <Input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Añadir tarea…"
          className="h-8"
        />
        <Button size="icon-sm" variant="outline" onClick={handleAdd} aria-label="Añadir tarea">
          <Plus className="size-4" />
        </Button>
      </div>
    </SectionCard>
  );
}
