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
    <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-primary/30 px-4 py-5 text-center">
      <span className="mb-1 flex size-16 items-center justify-center rounded-full bg-card text-2xl font-semibold tabular-nums text-foreground shadow-sm">
        {daysLeft}
      </span>
      <p className="text-sm font-medium text-foreground">
        {daysLeft === 0 ? "¡El examen es hoy!" : `día${daysLeft === 1 ? "" : "s"} para el examen`}
      </p>
      <p className="text-xs italic text-muted-foreground">{phrase}</p>
    </div>
  );
}
