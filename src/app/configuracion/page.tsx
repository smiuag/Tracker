import { PageHeader } from "@/components/shared/PageHeader";
import { ConfiguracionView } from "@/components/configuracion/ConfiguracionView";

export default function ConfiguracionPage() {
  return (
    <>
      <PageHeader title="Configuración" />
      <ConfiguracionView />
    </>
  );
}
