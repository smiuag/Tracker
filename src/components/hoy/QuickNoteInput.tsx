import { Textarea } from "@/components/ui/textarea";

interface QuickNoteInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function QuickNoteInput({
  value,
  onChange,
  label = "Observaciones",
  placeholder = "Notas rápidas sobre esta sesión…",
}: QuickNoteInputProps) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="resize-none"
      />
    </div>
  );
}
