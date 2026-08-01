import { PageHeader } from "@/components/shared/PageHeader";
import { HoyView } from "@/components/hoy/HoyView";

export default function HoyPage() {
  return (
    <>
      <PageHeader title="Hoy" subtitle="¿Qué hago ahora?" />
      <HoyView />
    </>
  );
}
