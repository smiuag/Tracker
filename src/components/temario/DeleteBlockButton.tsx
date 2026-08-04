"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteBlock } from "@/lib/services/topics.service";
import type { Block } from "@/types/topic";

interface DeleteBlockButtonProps {
  block: Block;
  topicCount: number;
  onDeleted: () => void;
}

export function DeleteBlockButton({ block, topicCount, onDeleted }: DeleteBlockButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);
    try {
      await deleteBlock(block.id);
      toast.success("Bloque eliminado");
      onDeleted();
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-1.5 text-sm">
        <span className="text-foreground">
          ¿Eliminar &quot;{block.nombre}&quot;
          {topicCount > 0 ? ` y sus ${topicCount} tema${topicCount === 1 ? "" : "s"}` : ""}?
        </span>
        <Button size="sm" variant="ghost" className="text-destructive" onClick={handleConfirm} disabled={deleting}>
          Sí, eliminar
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setConfirming(false)} disabled={deleting}>
          Cancelar
        </Button>
      </div>
    );
  }

  return (
    <Button variant="ghost" className="gap-1.5 text-destructive" onClick={() => setConfirming(true)}>
      <Trash2 className="size-3.5" />
      Eliminar bloque
    </Button>
  );
}
