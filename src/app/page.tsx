import { PageHeader } from "@/components/shared/PageHeader";
import { ProgresoView } from "@/components/dashboard/ProgresoView";

export default function ProgresoPage() {
  return (
    <>
      <PageHeader title="Progreso" subtitle="¿Cómo voy?" />
      <ProgresoView />
    </>
  );
}
