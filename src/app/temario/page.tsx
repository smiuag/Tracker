import { PageHeader } from "@/components/shared/PageHeader";
import { TemarioView } from "@/components/temario/TemarioView";

export default function TemarioPage() {
  return (
    <>
      <PageHeader title="Temario" subtitle="¿Qué me queda?" />
      <TemarioView />
    </>
  );
}
