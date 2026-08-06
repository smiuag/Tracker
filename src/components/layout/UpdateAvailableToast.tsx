"use client";

import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Avisa cuando el service worker activa una versión nueva mientras la app
 * está abierta (p. ej. tras un despliegue). No se dispara en la primera
 * carga: solo cuando el controlador cambia respecto al que ya había.
 */
export function UpdateAvailableToast() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const hadControllerOnMount = !!navigator.serviceWorker.controller;

    function handleControllerChange() {
      if (!hadControllerOnMount) return;
      toast("Hay una versión nueva de Opobook", {
        description: "Actualiza para ver los últimos cambios.",
        duration: Infinity,
        action: {
          label: "Actualizar",
          onClick: () => window.location.reload(),
        },
      });
    }

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
    return () => navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
  }, []);

  return null;
}
