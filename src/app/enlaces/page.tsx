import type { Metadata } from "next";
import { LinksView } from "@/components/enlaces/LinksView";

export const metadata: Metadata = {
  title: "Opobook — Enlaces",
  description: "La app, redes y contacto de Opobook en un solo sitio.",
};

export default function EnlacesPage() {
  return <LinksView />;
}
