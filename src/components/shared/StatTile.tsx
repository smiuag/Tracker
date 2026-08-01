import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function StatTile({ icon: Icon, label, value }: StatTileProps) {
  return (
    <Card className="gap-2 py-4">
      <CardContent className="flex items-center gap-3 px-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/40">
          <Icon className="size-4 text-foreground" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold leading-none text-foreground">{value}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
