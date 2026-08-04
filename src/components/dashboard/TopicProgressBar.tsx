import { SectionCard } from "@/components/shared/SectionCard";
import type { TopicProgressBreakdown } from "@/lib/services/stats.service";

interface TopicProgressBarProps {
  breakdown: TopicProgressBreakdown;
}

export function TopicProgressBar({ breakdown }: TopicProgressBarProps) {
  const { pendientes, enCurso, completados, total } = breakdown;

  if (total === 0) return null;

  const pct = (value: number) => (value / total) * 100;

  return (
    <SectionCard title="Progreso del temario">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-secondary/40">
        {completados > 0 && (
          <div className="h-full bg-chart-4" style={{ width: `${pct(completados)}%` }} />
        )}
        {enCurso > 0 && (
          <div className="h-full bg-chart-5" style={{ width: `${pct(enCurso)}%` }} />
        )}
        {pendientes > 0 && (
          <div className="h-full bg-secondary" style={{ width: `${pct(pendientes)}%` }} />
        )}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-chart-4" aria-hidden />
          Completados · {completados}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-chart-5" aria-hidden />
          En progreso · {enCurso}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-secondary" aria-hidden />
          Pendientes · {pendientes}
        </span>
      </div>
    </SectionCard>
  );
}
