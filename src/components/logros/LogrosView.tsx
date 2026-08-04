"use client";

import { SectionCard } from "@/components/shared/SectionCard";
import { Progress } from "@/components/ui/progress";
import { BadgeCard } from "./BadgeCard";
import { useBadges } from "@/hooks/useBadges";
import { useTotalMinutes } from "@/hooks/useTotalMinutes";
import { BADGE_CATALOG, HOUR_MILESTONE_BASE, hourMilestoneLabel } from "@/lib/constants/badges";
import { minutesToHoursLabel } from "@/lib/utils/date";

export function LogrosView() {
  const badges = useBadges();
  const totalMinutes = useTotalMinutes();

  if (!badges || totalMinutes === undefined) {
    return <p className="text-sm text-muted-foreground">Cargando…</p>;
  }

  const totalHours = totalMinutes / 60;
  const countByTipo = new Map<string, number>();
  for (const badge of badges) {
    countByTipo.set(badge.tipo, (countByTipo.get(badge.tipo) ?? 0) + 1);
  }

  const isMilestoneEarned = (m: number) => countByTipo.has(`horas_${m}`) || totalHours >= m;
  const nextMilestone = HOUR_MILESTONE_BASE.find((m) => !isMilestoneEarned(m));

  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Logros">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BADGE_CATALOG.map((def) => (
            <BadgeCard
              key={def.tipo}
              nombre={def.nombre}
              descripcion={def.descripcion}
              earned={(countByTipo.get(def.tipo) ?? 0) > 0}
              count={def.repetible ? countByTipo.get(def.tipo) : undefined}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Horas de estudio">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {HOUR_MILESTONE_BASE.map((m) => (
            <BadgeCard
              key={m}
              nombre={`${m} horas`}
              earned={isMilestoneEarned(m)}
              circleLabel={`${m}h`}
            />
          ))}
        </div>
        {nextMilestone && (
          <div className="mt-4">
            <p className="mb-1.5 text-xs text-muted-foreground">
              Próximo hito: {hourMilestoneLabel(nextMilestone)} — llevas {minutesToHoursLabel(totalMinutes)}
            </p>
            <Progress value={Math.min(100, Math.round((totalHours / nextMilestone) * 100))} />
          </div>
        )}
      </SectionCard>
    </div>
  );
}
