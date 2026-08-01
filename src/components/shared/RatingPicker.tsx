import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Nivel1a5 } from "@/types/common";

interface RatingPickerProps {
  label: string;
  value: Nivel1a5;
  onChange: (value: Nivel1a5) => void;
}

export function RatingPicker({ label, value, onChange }: RatingPickerProps) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
      <ToggleGroup
        value={[String(value)]}
        onValueChange={(v) => v[0] && onChange(Number(v[0]) as Nivel1a5)}
        className="justify-start gap-1"
      >
        {([1, 2, 3, 4, 5] as const).map((n) => (
          <ToggleGroupItem
            key={n}
            value={String(n)}
            className="size-9 rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {n}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
