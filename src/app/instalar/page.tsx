import type { Metadata } from "next";
import { InstallGuideView } from "@/components/instalar/InstallGuideView";

export const metadata: Metadata = {
  title: "Instalar Opobook",
  description: "Cómo instalar Opobook en tu iPhone o Android, paso a paso.",
};

export default function InstalarPage() {
  return <InstallGuideView />;
}
