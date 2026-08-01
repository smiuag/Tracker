"use client";

import { useEffect } from "react";
import { ensureBootstrapData } from "@/lib/db/bootstrap";
import { seedDatabaseIfEmpty } from "@/lib/db/seed";

/** Prepara la base local al montar la app. No renderiza nada. */
export function DbInitializer() {
  useEffect(() => {
    void ensureBootstrapData();
    if (process.env.NODE_ENV === "development") {
      void seedDatabaseIfEmpty();
    }
  }, []);

  return null;
}
