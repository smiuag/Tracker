import { Hourglass } from "lucide-react";
import { daysBetween, fromFechaISO, toFechaISO } from "@/lib/utils/date";
import type { FechaISO } from "@/types/common";

const MOTIVATIONAL_PHRASES = [
  "Cada sesión cuenta, incluso las difíciles.",
  "La constancia vence al talento.",
  "Hoy también suma.",
  "Vas más lejos de lo que crees.",
  "No hace falta ser perfecto, solo constante.",
  "Cada hora de estudio es una inversión en ti.",
  "Un paso más cerca, aunque hoy cueste.",
];

interface ExamCountdownCardProps {
  fechaExamen: FechaISO;
}

export function ExamCountdownCard({ fechaExamen }: ExamCountdownCardProps) {
  const today = toFechaISO(new Date());
  const daysLeft = daysBetween(today, fechaExamen);
  if (daysLeft < 0) return null;

  const todayDate = fromFechaISO(today);
  const seed = todayDate.getMonth() * 31 + todayDate.getDate();
  const phrase = MOTIVATIONAL_PHRASES[seed % MOTIVATIONAL_PHRASES.length];

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-primary/30 px-4 py-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card/70">
        <Hourglass className="size-5 text-foreground" />
      </span>
      <div className="min-w-0">
        {daysLeft === 0 ? (
          <p className="text-xl font-semibold text-foreground">¡Es hoy!</p>
        ) : (
          <p className="flex items-baseline gap-1.5 text-foreground">
            <span className="text-2xl font-semibold leading-none tabular-nums">{daysLeft}</span>
            <span className="text-sm font-medium">
              día{daysLeft === 1 ? "" : "s"} para el examen
            </span>
          </p>
        )}
        <p className="mt-0.5 text-xs text-muted-foreground">{phrase}</p>
      </div>
    </div>
  );
}
