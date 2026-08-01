"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useSubtopics } from "@/hooks/useSubtopics";
import { addSubtopic, deleteSubtopic, toggleSubtopic } from "@/lib/services/topics.service";

interface SubtopicChecklistProps {
  topicId: string;
}

export function SubtopicChecklist({ topicId }: SubtopicChecklistProps) {
  const subtopics = useSubtopics(topicId);
  const [newName, setNewName] = useState("");

  async function handleAdd() {
    if (!newName.trim()) return;
    await addSubtopic(topicId, newName.trim());
    setNewName("");
  }

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">Subtemas</p>
      <ul className="flex flex-col gap-1.5">
        {subtopics?.map((subtopic) => (
          <li key={subtopic.id} className="flex items-center gap-2">
            <Checkbox
              checked={subtopic.completado}
              onCheckedChange={(checked) => toggleSubtopic(subtopic.id, checked === true)}
            />
            <span
              className={
                subtopic.completado
                  ? "flex-1 text-sm text-muted-foreground line-through"
                  : "flex-1 text-sm text-foreground"
              }
            >
              {subtopic.nombre}
            </span>
            <button
              type="button"
              onClick={() => deleteSubtopic(subtopic.id)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Eliminar subtema"
            >
              <Trash2 className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Añadir subtema…"
          className="h-8"
        />
        <Button size="icon-sm" variant="outline" onClick={handleAdd} aria-label="Añadir subtema">
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}
