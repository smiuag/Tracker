import { PageHeader } from "@/components/shared/PageHeader";
import { ObjetivosView } from "@/components/objetivos/ObjetivosView";

export default function ObjetivosPage() {
  return (
    <>
      <PageHeader title="Objetivos" subtitle="Diarios, semanales, mensuales y anuales" />
      <ObjetivosView />
    </>
  );
}
