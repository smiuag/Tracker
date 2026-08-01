import { PageHeader } from "@/components/shared/PageHeader";
import { DashboardView } from "@/components/dashboard/DashboardView";

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" subtitle="¿Cómo voy?" />
      <DashboardView />
    </>
  );
}
