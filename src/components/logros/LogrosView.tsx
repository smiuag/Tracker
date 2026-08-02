"use client";

import { SectionCard } from "@/components/shared/SectionCard";
import { Progress } from "@/components/ui/progress";
import { BadgeCard } from "./BadgeCard";
import { useBadges } from "@/hooks/useBadges";
import { useTotalMinutes } from "@/hooks/useTotalMinutes";
import { BADGE_CATALOG, HOUR_MILESTONE_BASE, hourMilestoneLabel } from "@/lib/constants/badges";
import { minutesToHoursLabel } from "@/lib/utils/date";

function upcomingMilestones(totalHours: number): number[] {
  const list = [...HOUR_MILESTONE_BASE];
  for (let next = 200; next <= totalHours + 200; next += 50) {
    list.push(next);
  }
  return list;
}

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

  const milestones = upcomingMilestones(totalHours);
  const earnedMilestones = milestones.filter((m) => countByTipo.has(`horas_${m}`));
  const nextMilestone = milestones.find((m) => !countByTipo.has(`horas_${m}`));

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
        {earnedMilestones.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {earnedMilestones.map((m) => (
              <BadgeCard
                key={m}
                nombre={hourMilestoneLabel(m)}
                descripcion="Hito de horas de estudio efectivo"
                earned
              />
            ))}
          </div>
        )}
        {nextMilestone && (
          <div className={earnedMilestones.length > 0 ? "mt-4" : undefined}>
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
