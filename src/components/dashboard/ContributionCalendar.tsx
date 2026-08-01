import { SectionCard } from "@/components/shared/SectionCard";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { INTENSITY_BUCKET_CLASSES, minutesToIntensityBucket } from "@/lib/utils/colors";
import { minutesToHoursLabel } from "@/lib/utils/date";
import { cn } from "@/lib/utils";
import type { ContributionDay } from "@/lib/services/stats.service";

interface ContributionCalendarProps {
  days: ContributionDay[];
}

export function ContributionCalendar({ days }: ContributionCalendarProps) {
  return (
    <SectionCard title="Últimas semanas">
      <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1">
        {days.map((day) => {
          const bucket = minutesToIntensityBucket(day.minutos);
          return (
            <HoverCard key={day.fecha}>
              <HoverCardTrigger
                className={cn(
                  "size-3.5 rounded-sm transition-transform hover:scale-125",
                  INTENSITY_BUCKET_CLASSES[bucket]
                )}
                aria-label={`${day.fecha}: ${minutesToHoursLabel(day.minutos)}`}
              />
              <HoverCardContent className="w-auto px-3 py-2 text-xs">
                <p className="font-medium text-foreground">{day.fecha}</p>
                <p className="text-muted-foreground">{minutesToHoursLabel(day.minutos)}</p>
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>
    </SectionCard>
  );
}
