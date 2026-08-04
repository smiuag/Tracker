import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
  nombre: string;
  descripcion?: string;
  earned: boolean;
  count?: number;
  /** Texto dentro del círculo (p. ej. "50h") en lugar del icono de medalla. */
  circleLabel?: string;
}

export function BadgeCard({ nombre, descripcion, earned, count, circleLabel }: BadgeCardProps) {
  return (
    <Card className={cn("gap-2 py-4", !earned && "opacity-50")}>
      <CardContent className="flex flex-col items-center gap-2 px-4 text-center">
        <span
          className={cn(
            "relative flex size-12 items-center justify-center rounded-full",
            earned ? "bg-primary/40" : "bg-secondary/60"
          )}
        >
          {circleLabel ? (
            <span className="text-sm font-semibold text-foreground">{circleLabel}</span>
          ) : (
            <Award className="size-5 text-foreground" />
          )}
          {earned && count !== undefined && count > 1 && (
            <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              x{count}
            </span>
          )}
        </span>
        <p className="text-sm font-medium text-foreground">{nombre}</p>
        {descripcion && <p className="text-xs text-muted-foreground">{descripcion}</p>}
      </CardContent>
    </Card>
  );
}
