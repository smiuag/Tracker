import { Heart } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const REVOLUT_URL = "https://revolut.me/opobook";

/** Donaciones voluntarias vía Revolut: solo un enlace externo, sin pagos dentro de la app. */
export function DonationsSection() {
  return (
    <SectionCard title="Apoya el proyecto">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          Opobook es un proyecto independiente. Cada nueva función, mejora y
          actualización requiere tiempo de desarrollo. Si la aplicación te
          resulta útil y quieres ayudar a que siga creciendo, puedes apoyarla
          de forma totalmente voluntaria.
        </p>
        <a
          href={REVOLUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants(), "w-fit gap-1.5")}
        >
          <Heart className="size-4" />
          Apoyar con una donación
        </a>
      </div>
    </SectionCard>
  );
}
