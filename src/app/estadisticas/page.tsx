import { PageHeader } from "@/components/shared/PageHeader";
import { EstadisticasView } from "@/components/estadisticas/EstadisticasView";

export default function EstadisticasPage() {
  return (
    <>
      <PageHeader title="Estadísticas" subtitle="¿Estoy siendo constante?" />
      <EstadisticasView />
    </>
  );
}
