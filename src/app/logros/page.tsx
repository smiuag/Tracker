import { PageHeader } from "@/components/shared/PageHeader";
import { LogrosView } from "@/components/logros/LogrosView";

export default function LogrosPage() {
  return (
    <>
      <PageHeader title="Logros" subtitle="Tus medallas" />
      <LogrosView />
    </>
  );
}
