"use client";

import { useAppSettings } from "@/hooks/useAppSettings";
import { ConfiguracionForm } from "./ConfiguracionForm";

export function ConfiguracionView() {
  const settings = useAppSettings();
  if (!settings) return null;
  return (
    <ConfiguracionForm goalConfig={settings.goalConfig} blockDurationMin={settings.blockDurationMin} />
  );
}
