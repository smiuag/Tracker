import Link from "next/link";
import { Settings, Target, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";

export default function ConfiguracionPage() {
  return (
    <>
      <PageHeader title="Configuración" />
      <SectionCard title="Objetivos">
        <Link
          href="/objetivos"
          className="flex items-center justify-between rounded-xl px-1 py-1.5 text-sm text-foreground transition-colors hover:text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <Target className="size-4" />
            Gestionar objetivos diarios, semanales, mensuales y anuales
          </span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
      </SectionCard>
      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Settings className="size-4" />
        Más ajustes (patrón de repasos, datos locales) llegan en próximas fases.
      </div>
    </>
  );
}
