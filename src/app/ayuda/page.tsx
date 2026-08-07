import type { Metadata } from "next";
import { AyudaView } from "@/components/ayuda/AyudaView";

export const metadata: Metadata = {
  title: "¿Qué es Opobook?",
  description: "Qué es Opobook y cómo te ayuda a preparar tu oposición con calma.",
};

export default function AyudaPage() {
  return <AyudaView />;
}
