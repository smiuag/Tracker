"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Download, Upload } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { downloadBackup, exportBackup, importBackup, parseBackupFile } from "@/lib/services/backup.service";

export function BackupSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleExport() {
    setBusy(true);
    try {
      const payload = await exportBackup();
      downloadBackup(payload);
      toast.success("Copia de seguridad descargada");
    } catch {
      toast.error("No se pudo exportar la copia de seguridad");
    } finally {
      setBusy(false);
    }
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const confirmed = window.confirm(
      "Importar sustituirá TODOS los datos actuales de la app por los del archivo. ¿Continuar?"
    );
    if (!confirmed) return;

    setBusy(true);
    try {
      const payload = await parseBackupFile(file);
      await importBackup(payload);
      toast.success("Datos importados. Recargando…");
      setTimeout(() => window.location.reload(), 800);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo importar el archivo");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SectionCard title="Copia de seguridad">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          Todos tus datos viven solo en este dispositivo. Exporta una copia de vez en cuando
          para no perder tu progreso.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleExport} disabled={busy} className="gap-1.5">
            <Download className="size-4" />
            Exportar datos
          </Button>
          <Button onClick={handleImportClick} disabled={busy} variant="outline" className="gap-1.5">
            <Upload className="size-4" />
            Importar datos
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleFileSelected}
          />
        </div>
      </div>
    </SectionCard>
  );
}
