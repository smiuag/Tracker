"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db/db";
import { downloadBackup, exportBackup } from "@/lib/services/backup.service";
import {
  BACKUP_REMINDER_INTERVAL_DAYS,
  dismissBackupReminderForever,
  getNextBackupReminderAt,
  isBackupReminderDismissed,
  recordBackupExported,
  setNextBackupReminderAt,
} from "@/lib/services/settings.service";
import { addDays, toFechaISO } from "@/lib/utils/date";

/** Recordatorio periódico (silenciable) de exportar copia de seguridad. */
export function BackupReminderSheet() {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    (async () => {
      if (await isBackupReminderDismissed()) return;

      const hasData = (await db.topics.count()) > 0 || (await db.studySessions.count()) > 0;
      if (!hasData) return;

      const today = toFechaISO(new Date());
      const nextReminderAt = await getNextBackupReminderAt();

      if (!nextReminderAt) {
        // Primera comprobación: no molestar de inmediato, solo fija cuándo tocaría avisar.
        await setNextBackupReminderAt(addDays(today, BACKUP_REMINDER_INTERVAL_DAYS));
        return;
      }

      if (today >= nextReminderAt) setOpen(true);
    })();
  }, []);

  async function handleSnooze() {
    await setNextBackupReminderAt(addDays(toFechaISO(new Date()), BACKUP_REMINDER_INTERVAL_DAYS));
    setOpen(false);
  }

  async function handleDismissForever() {
    await dismissBackupReminderForever();
    setOpen(false);
  }

  async function handleExport() {
    setExporting(true);
    try {
      const payload = await exportBackup();
      downloadBackup(payload);
      await recordBackupExported(toFechaISO(new Date()));
      toast.success("Copia de seguridad descargada");
      setOpen(false);
    } finally {
      setExporting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(next) => !next && setOpen(false)}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Haz una copia de seguridad</SheetTitle>
          <SheetDescription>
            Hace tiempo que no exportas tus datos. Guarda una copia por si acaso.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="flex-row flex-wrap">
          <Button onClick={handleExport} disabled={exporting}>
            Exportar ahora
          </Button>
          <Button variant="outline" onClick={handleSnooze} disabled={exporting}>
            Recordar más tarde
          </Button>
          <Button variant="ghost" className="text-muted-foreground" onClick={handleDismissForever} disabled={exporting}>
            No volver a recordar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
