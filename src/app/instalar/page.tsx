import type { Metadata } from "next";
import { InstallGuideView } from "@/components/instalar/InstallGuideView";

export const metadata: Metadata = {
  title: "Instalar Opobook",
  description: "Cómo instalar Opobook en iPhone, Android u ordenador, paso a paso.",
};

export default function InstalarPage() {
  return <InstallGuideView />;
}
