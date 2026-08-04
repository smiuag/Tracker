"use client";

import { useEffect } from "react";
import { seedDatabaseIfEmpty } from "@/lib/db/seed";

/** Prepara la base local al montar la app. No renderiza nada. */
export function DbInitializer() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      void seedDatabaseIfEmpty();
    }

    // Pide al navegador que exima este origen de la limpieza automática de
    // almacenamiento por presión de disco (no garantizado en todos los
    // navegadores, pero gratis pedirlo). No aplica en SSR.
    if (typeof navigator !== "undefined" && navigator.storage?.persist) {
      void navigator.storage.persist();
    }
  }, []);

  return null;
}
