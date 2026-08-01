import { PageHeader } from "@/components/shared/PageHeader";
import { RepasosView } from "@/components/repasos/RepasosView";

export default function RepasosPage() {
  return (
    <>
      <PageHeader title="Repasos" subtitle="¿Qué toca hoy?" />
      <RepasosView />
    </>
  );
}
